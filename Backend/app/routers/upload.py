"""
app/routers/upload.py

POST /api/v1/upload
  Accepts a CSV or Excel (.xlsx/.xls) file containing PO transaction data.
  Aggregates per-supplier metrics and upserts Supplier records.

Expected columns (case-insensitive):
  Supplier_ID, Supplier_Name, Category,
  PO_Date, Delivery_Date, Expected_Delivery_Date,
  Ordered_Qty, Received_Qty, Rejected_Qty
"""

import csv
import io
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.security import verify_access_token
from app.database import get_db
from app.models.supplier import Supplier, WeeklyScore

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
    dependencies=[Depends(verify_access_token)],
)


# ── helpers ───────────────────────────────────────────────────────────────────

def _normalise_headers(row: dict) -> dict:
    """Lowercase + strip all header keys."""
    return {k.strip().lower().replace(" ", "_"): v.strip() if isinstance(v, str) else v
            for k, v in row.items()}


def _parse_date(val: str):
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(val.strip(), fmt).date()
        except (ValueError, AttributeError):
            continue
    return None


def _safe_float(val, default=0.0) -> float:
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def _compute_grade(score: int) -> str:
    if score >= 95:
        return "A"
    if score >= 85:
        return "B"
    if score >= 70:
        return "C"
    return "D"


def _compute_trend(weekly: list[float]) -> str:
    if len(weekly) < 2:
        return "Stable"
    diff = weekly[-1] - weekly[0]
    variance = max(weekly) - min(weekly)
    if variance > 10:
        return "Erratic"
    if diff > 3:
        return "Improving"
    if diff < -3:
        return "Declining"
    return "Stable"


def _parse_csv_rows(content: bytes) -> list[dict]:
    text = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    return [_normalise_headers(row) for row in reader]


def _parse_excel_rows(content: bytes) -> list[dict]:
    try:
        import openpyxl
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="openpyxl is required for Excel uploads. Run: pip install openpyxl",
        )
    wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    headers = [str(h).strip().lower().replace(" ", "_") if h else "" for h in rows[0]]
    result = []
    for row in rows[1:]:
        result.append({headers[i]: (str(v).strip() if v is not None else "") for i, v in enumerate(row)})
    return result


def _aggregate(rows: list[dict]) -> dict:
    """
    Returns {supplier_id: {name, category, otd, fill_rate, reject_rate, weeks: [...]}}
    """
    data: dict[str, dict] = {}

    for row in rows:
        sid = row.get("supplier_id", "").strip()
        if not sid:
            continue

        if sid not in data:
            data[sid] = {
                "name":      row.get("supplier_name", sid),
                "category":  row.get("category", "Uncategorized"),
                "on_time":   0,
                "total_po":  0,
                "ordered":   0.0,
                "received":  0.0,
                "rejected":  0.0,
            }

        d = data[sid]
        delivery_date   = _parse_date(row.get("delivery_date", ""))
        expected_date   = _parse_date(row.get("expected_delivery_date", ""))
        ordered         = _safe_float(row.get("ordered_qty", 0))
        received        = _safe_float(row.get("received_qty", 0))
        rejected        = _safe_float(row.get("rejected_qty", 0))

        d["total_po"]  += 1
        d["ordered"]   += ordered
        d["received"]  += received
        d["rejected"]  += rejected
        if delivery_date and expected_date and delivery_date <= expected_date:
            d["on_time"] += 1

    return data


# ── endpoint ──────────────────────────────────────────────────────────────────

@router.post("/", summary="Upload CSV/Excel procurement data")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    filename = file.filename or ""
    content = await file.read()

    if filename.endswith(".csv"):
        rows = _parse_csv_rows(content)
    elif filename.endswith((".xlsx", ".xls")):
        rows = _parse_excel_rows(content)
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only .csv, .xlsx, .xls files are supported",
        )

    if not rows:
        raise HTTPException(status_code=400, detail="File is empty or has no valid rows")

    aggregated = _aggregate(rows)
    if not aggregated:
        raise HTTPException(status_code=400, detail="No valid Supplier_ID rows found")

    created, updated = 0, 0

    for sid, d in aggregated.items():
        total = d["total_po"] or 1
        otd         = round((d["on_time"] / total) * 100, 1)
        fill_rate   = round((d["received"] / d["ordered"]) * 100, 1) if d["ordered"] > 0 else 0.0
        reject_rate = round((d["rejected"] / d["received"]) * 100, 1) if d["received"] > 0 else 0.0
        composite   = int(0.4 * otd + 0.3 * fill_rate + 0.3 * (100 - reject_rate))
        grade       = _compute_grade(composite)

        existing = db.query(Supplier).filter(Supplier.id == sid).first()
        if existing:
            existing.name           = d["name"]
            existing.category       = d["category"]
            existing.otd            = otd
            existing.fill_rate      = fill_rate
            existing.reject_rate    = reject_rate
            existing.composite_score= composite
            existing.grade          = grade
            # recompute trend from previous weekly scores + new data
            ws_scores = [ws.composite for ws in existing.weekly_scores]
            existing.trend = _compute_trend(ws_scores + [composite])
            updated += 1
        else:
            supplier = Supplier(
                id             = sid,
                name           = d["name"],
                category       = d["category"],
                otd            = otd,
                fill_rate      = fill_rate,
                reject_rate    = reject_rate,
                composite_score= composite,
                grade          = grade,
                trend          = "Stable",
            )
            # add a single "Upload" weekly score entry
            supplier.weekly_scores.append(WeeklyScore(
                supplier_id = sid,
                week        = "Upload",
                otd         = otd,
                fill_rate   = fill_rate,
                reject_rate = reject_rate,
                composite   = composite,
            ))
            db.add(supplier)
            created += 1

    db.commit()

    return {
        "message": f"Processed {len(rows)} rows for {len(aggregated)} suppliers.",
        "created": created,
        "updated": updated,
        "total_rows": len(rows),
    }
