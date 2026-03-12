"""
app/routers/upload.py

POST /api/v1/upload/
    Parse file in-request (fast), hand all heavy work to a background task.
    Returns {job_id, status: "processing"} immediately — never blocks the caller.

GET  /api/v1/upload/status/{job_id}
    Poll for job result. Returns status + result when done, or error on failure.

Architecture
    - In-memory job store (thread-safe) with 2-hour TTL auto-eviction
    - CPU-heavy agent tasks run via asyncio.to_thread() (thread pool, non-blocking)
    - DB writes use bulk_insert_mappings / bulk_update_mappings (3 round trips, not O(n))
    - Email alerts await directly (already async via fastapi-mail)
"""

import asyncio
import csv
import io
import logging
import threading
import uuid
from datetime import date, datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status

from app.agents import analytics as analytics_agent
from app.agents import preprocessing as preprocessing_agent
from app.agents import trend_forecast as trend_agent
from app.core.config import get_settings
from app.core.security import CurrentUser, verify_access_token
from app.database import SessionLocal
from app.models.supplier import Supplier, WeeklyScore
from app.services.mail_service import send_supplier_alert

_logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
    dependencies=[Depends(verify_access_token)],
)


# ── In-memory job store ───────────────────────────────────────────────────────

_jobs: dict[str, dict] = {}
_jobs_lock = threading.Lock()
_JOB_TTL_HOURS = 2


def _job_set(job_id: str, data: dict) -> None:
    with _jobs_lock:
        _jobs[job_id] = data


def _job_get(job_id: str) -> dict | None:
    with _jobs_lock:
        return _jobs.get(job_id)


def _jobs_evict_stale() -> None:
    """Remove jobs older than _JOB_TTL_HOURS to prevent unbounded memory growth."""
    cutoff = datetime.now() - timedelta(hours=_JOB_TTL_HOURS)
    with _jobs_lock:
        stale = [k for k, v in _jobs.items() if v.get("ts", datetime.now()) < cutoff]
        for k in stale:
            del _jobs[k]


# ── File parsing (fast, synchronous, in-memory) ───────────────────────────────

def _parse_csv(content: bytes) -> list[dict]:
    text = content.decode("utf-8-sig", errors="replace")
    return [dict(r) for r in csv.DictReader(io.StringIO(text))]


def _parse_excel(content: bytes) -> list[dict]:
    try:
        import openpyxl
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="openpyxl is required. Run: pip install openpyxl",
        )
    wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    headers = [str(h).strip() if h is not None else "" for h in rows[0]]
    return [
        {headers[i]: (str(v).strip() if v is not None else "") for i, v in enumerate(row)}
        for row in rows[1:]
    ]


# ── DB helpers (sync, each creates its own session — safe for thread pool) ────

def _load_history(supplier_ids: list[str]) -> dict[str, list[dict]]:
    """Fetch per-supplier weekly history. Runs in a thread; creates its own Session."""
    db = SessionLocal()
    try:
        result: dict[str, list[dict]] = {}
        for sid in supplier_ids:
            rows = (
                db.query(WeeklyScore)
                .filter(WeeklyScore.supplier_id == sid)
                .order_by(WeeklyScore.created_at.asc())
                .all()
            )
            if rows:
                supplier = db.query(Supplier).filter(Supplier.id == sid).first()
                result[sid] = [
                    {
                        "week_start_date": r.week,
                        "otd_pct":         r.otd,
                        "fr_pct":          r.fill_rate,
                        "qr_pct":          r.reject_rate,
                        "composite_score": float(r.composite),
                        "rating":          supplier.grade if supplier else None,
                    }
                    for r in rows
                ]
        return result
    finally:
        db.close()


def _upsert_bulk(supplier_results: list[dict], wsd: str) -> tuple[int, int]:
    """
    Bulk-upsert suppliers + insert weekly scores.
    Only 4 DB round-trips regardless of dataset size:
      1. SELECT existing supplier IDs (one IN query)
      2. bulk_insert_mappings  — new suppliers
      3. bulk_update_mappings  — existing suppliers
      4. bulk_insert_mappings  — weekly scores
    vs. the previous O(n) per-row approach.
    """
    if not supplier_results:
        return 0, 0

    db = SessionLocal()
    try:
        sids = [s["supplier_id"] for s in supplier_results]
        existing_ids: set[str] = {
            row[0]
            for row in db.query(Supplier.id).filter(Supplier.id.in_(sids)).all()
        }

        to_create:    list[dict] = []
        to_update:    list[dict] = []
        week_inserts: list[dict] = []
        week_label = wsd[:10]

        for s in supplier_results:
            sid       = s["supplier_id"]
            score_obj = s["score"]
            kpis      = s["kpis"]
            trend_obj = s["trend"]

            composite_int = round(score_obj["composite_score"]) if score_obj["composite_score"] is not None else 0
            grade         = score_obj["rating"] or "D"
            trend_str     = trend_obj.get("trend_30d") or trend_obj.get("wow_direction") or "Stable"
            if trend_str in ("Insufficient Data", ""):
                trend_str = "Stable"
            trend_str = trend_str[:50]

            otd_val = kpis["otd_pct"] or 0.0
            fr_val  = kpis["fr_pct"]  or 0.0
            qr_val  = kpis["qr_pct"]  or 0.0

            row = dict(
                id=sid,
                name=s["supplier_name"],
                category=s["category"],
                otd=otd_val,
                fill_rate=fr_val,
                reject_rate=qr_val,
                composite_score=composite_int,
                grade=grade,
            )
            if sid in existing_ids:
                to_update.append({**row, "trend": trend_str})
            else:
                to_create.append({**row, "trend": "Stable"})

            week_inserts.append(dict(
                supplier_id=sid,
                week=week_label,
                otd=otd_val,
                fill_rate=fr_val,
                reject_rate=qr_val,
                composite=composite_int,
            ))

        if to_create:
            db.bulk_insert_mappings(Supplier, to_create)
        if to_update:
            db.bulk_update_mappings(Supplier, to_update)
        if week_inserts:
            db.bulk_insert_mappings(WeeklyScore, week_inserts)

        db.commit()
        return len(to_create), len(to_update)
    finally:
        db.close()


# ── Background pipeline ───────────────────────────────────────────────────────

async def _run_pipeline(
    job_id: str,
    raw_rows: list[dict],
    weights: dict,
    user_email: str,
) -> None:
    """
    Full 3-agent pipeline. Runs non-blocking:
    - CPU-heavy sync work → asyncio.to_thread() (thread pool)
    - DB I/O              → asyncio.to_thread() (each helper owns its Session)
    - Email alerts        → awaited directly (fastapi-mail is async)
    The event loop is never blocked; concurrent HTTP requests are served normally.
    """
    _jobs_evict_stale()

    try:
        # ── Agent 1: Preprocessing ────────────────────────────────────────
        prep_result = await asyncio.to_thread(preprocessing_agent.run, raw_rows)

        if prep_result["status"] == "failed":
            result = {
                "status":             "failed",
                "message":            "Preprocessing failed — no usable rows.",
                "rows_processed":     0,
                "suppliers_upserted": 0,
                "errors":             len(prep_result["report"]["dropped_rows"]),
                "preprocessing":      prep_result["report"],
                "analytics":          None,
                "trend_forecast":     None,
            }
            _job_set(job_id, {"status": "done", "result": result, "ts": datetime.now()})
            return

        clean_data = prep_result["clean_data"]

        # ── Agent 2: Analytics ────────────────────────────────────────────
        wsd = date.today().isoformat()
        analytics_result = await asyncio.to_thread(
            analytics_agent.run, clean_data, weights, wsd
        )

        # ── Agent 3: Trend & Forecast ─────────────────────────────────────
        supplier_ids = [s["supplier_id"] for s in analytics_result["supplier_analytics"]]
        history      = await asyncio.to_thread(_load_history, supplier_ids)
        trend_result = await asyncio.to_thread(trend_agent.run, analytics_result, history, wsd)

        # ── Bulk DB Upsert ────────────────────────────────────────────────
        created, updated = await asyncio.to_thread(
            _upsert_bulk, trend_result["supplier_results"], wsd
        )
        suppliers_upserted = created + updated

        # ── C/D Rating Alerts (non-blocking, awaited directly) ─────────────
        _settings = get_settings()
        alert_to = _settings.mail_alert_recipient or user_email
        if alert_to and _settings.smtp_user:
            for s in trend_result["supplier_results"]:
                rating = s["score"].get("rating") or "D"
                if rating in ("C", "D"):
                    try:
                        await send_supplier_alert(
                            to_email=alert_to,
                            supplier_name=s["supplier_name"],
                            rating=rating,
                            score=s["score"].get("composite_score") or 0,
                        )
                    except Exception as mail_exc:
                        _logger.warning(
                            "Alert email failed for %s: %s", s["supplier_name"], mail_exc
                        )

        # ── Build final result ────────────────────────────────────────────
        batch        = trend_result["batch_summary"]
        rows_dropped = prep_result["report"]["rows_dropped"]

        result = {
            "status": prep_result["status"],
            "message": (
                f"Processed {len(clean_data)} rows → "
                f"{suppliers_upserted} suppliers "
                f"({created} new, {updated} updated). "
                f"{rows_dropped} row(s) dropped."
            ),
            "rows_processed":     len(clean_data),
            "suppliers_upserted": suppliers_upserted,
            "errors":             rows_dropped,
            "preprocessing":      prep_result["report"],
            "analytics":          analytics_result["report"],
            "trend_forecast": {
                "batch_summary": batch,
                "supplier_results": [
                    {
                        "supplier_id":   s["supplier_id"],
                        "supplier_name": s["supplier_name"],
                        "score":         s["score"],
                        "risk":          s["risk"],
                        "trend":         s["trend"],
                        "forecast":      s["forecast"],
                    }
                    for s in trend_result["supplier_results"]
                ],
            },
        }
        _job_set(job_id, {"status": "done", "result": result, "ts": datetime.now()})

    except Exception as exc:
        _logger.error("Pipeline failed for job %s: %s", job_id, exc, exc_info=True)
        _job_set(job_id, {"status": "failed", "error": str(exc), "ts": datetime.now()})


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", summary="Queue CSV/Excel procurement data for background processing")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    weight_otd: float = Form(default=0.40),
    weight_fr:  float = Form(default=0.30),
    weight_qr:  float = Form(default=0.30),
    current_user: CurrentUser = Depends(verify_access_token),
):
    """
    Reads and parses the uploaded file (fast, in-memory), then schedules all heavy
    work as a background task. Returns {job_id, status: "processing"} immediately.
    Poll GET /upload/status/{job_id} for results.
    """
    filename = file.filename or ""
    content  = await file.read()

    if filename.endswith(".csv"):
        raw_rows = _parse_csv(content)
    elif filename.endswith((".xlsx", ".xls")):
        raw_rows = _parse_excel(content)
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only .csv, .xlsx, .xls files are supported",
        )

    if not raw_rows:
        raise HTTPException(status_code=400, detail="File is empty or has no valid rows")

    job_id  = str(uuid.uuid4())
    weights = {"weight_otd": weight_otd, "weight_fr": weight_fr, "weight_qr": weight_qr}
    _job_set(job_id, {"status": "processing", "ts": datetime.now()})

    background_tasks.add_task(
        _run_pipeline,
        job_id=job_id,
        raw_rows=raw_rows,
        weights=weights,
        user_email=current_user.email or "",
    )

    return {"job_id": job_id, "status": "processing", "filename": filename}


@router.get("/status/{job_id}", summary="Poll upload job status")
def get_job_status(job_id: str):
    """
    Returns current job state:
      {status: "processing"}             — still running
      {status: "done", result: {...}}    — pipeline complete, result ready
      {status: "failed", error: "..."}   — pipeline errored
      404                                — job not found or expired (> 2 h)
    """
    job = _job_get(job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or expired.",
        )
    if job["status"] == "processing":
        return {"job_id": job_id, "status": "processing"}
    if job["status"] == "failed":
        return {"job_id": job_id, "status": "failed", "error": job.get("error")}
    return {"job_id": job_id, "status": "done", "result": job["result"]}
