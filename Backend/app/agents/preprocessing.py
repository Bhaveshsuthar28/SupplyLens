"""
Agent 1 — Preprocessing Agent
==============================
Receives raw tabular rows (list[dict]).
Returns a structured preprocessing result with clean_data + report.
No DB access. Pure data transformation.
"""

import math
import re
from collections import defaultdict
from datetime import date, datetime, timedelta

TODAY = date.today()

# ── Column mapping ─────────────────────────────────────────────────────────────
COLUMN_MAP: dict[str, str] = {
    # supplier_id
    "supplier_id": "supplier_id", "supplierid": "supplier_id",
    "supp_id": "supplier_id",     "vendor_id": "supplier_id",
    "vendorid": "supplier_id",    "id": "supplier_id",
    "sid": "supplier_id",         "s_id": "supplier_id",
    # supplier_name
    "supplier_name": "supplier_name", "suppliername": "supplier_name",
    "supp_name": "supplier_name",     "vendor_name": "supplier_name",
    "vendorname": "supplier_name",    "name": "supplier_name",
    "company_name": "supplier_name",  "companyname": "supplier_name",
    # category
    "category": "category",       "cat": "category",
    "type": "category",           "supplier_type": "category",
    "vendor_type": "category",    "material_type": "category",
    "materialtype": "category",   "item_category": "category",
    # po_date
    "po_date": "po_date",               "podate": "po_date",
    "po": "po_date",                    "purchase_order_date": "po_date",
    "order_date": "po_date",            "orderdate": "po_date",
    # delivery_date
    "delivery_date": "delivery_date",         "deliverydate": "delivery_date",
    "actual_delivery": "delivery_date",       "actual_delivery_date": "delivery_date",
    "received_date": "delivery_date",         "receiveddate": "delivery_date",
    "date_received": "delivery_date",         "delivered_date": "delivery_date",
    "arrival_date": "delivery_date",
    # expected_delivery_date
    "expected_delivery_date": "expected_delivery_date",
    "expecteddeliverydate": "expected_delivery_date",
    "due_date": "expected_delivery_date",     "duedate": "expected_delivery_date",
    "promised_date": "expected_delivery_date",
    "commitment_date": "expected_delivery_date",
    "committed_date": "expected_delivery_date",
    "eta": "expected_delivery_date",
    # ordered_qty
    "ordered_qty": "ordered_qty",       "orderedqty": "ordered_qty",
    "order_quantity": "ordered_qty",    "orderquantity": "ordered_qty",
    "qty_ordered": "ordered_qty",       "quantity_ordered": "ordered_qty",
    "po_qty": "ordered_qty",            "poqty": "ordered_qty",
    "quantity": "ordered_qty",          "order_qty": "ordered_qty",
    "units_ordered": "ordered_qty",
    # received_qty
    "received_qty": "received_qty",     "receivedqty": "received_qty",
    "qty_received": "received_qty",     "quantity_received": "received_qty",
    "delivered_qty": "received_qty",    "actual_qty": "received_qty",
    "actualqty": "received_qty",        "units_received": "received_qty",
    "recv_qty": "received_qty",
    # rejected_qty
    "rejected_qty": "rejected_qty",     "rejectedqty": "rejected_qty",
    "qty_rejected": "rejected_qty",     "rejection_qty": "rejected_qty",
    "defect_qty": "rejected_qty",       "defectqty": "rejected_qty",
    "defective_qty": "rejected_qty",    "returns": "rejected_qty",
    "reject_count": "rejected_qty",     "units_rejected": "rejected_qty",
    "bad_qty": "rejected_qty",
}

_CANONICAL = set(COLUMN_MAP.values())
_BLANK = {"", "n/a", "na", "none", "null", "-", "--", "nan"}

# ── Date helpers ───────────────────────────────────────────────────────────────
_EXCEL_EPOCH = date(1899, 12, 30)


def _excel_serial(v: str) -> date | None:
    try:
        n = int(v)
        if 1000 <= n <= 99999:
            return _EXCEL_EPOCH + timedelta(days=n)
    except (ValueError, TypeError):
        pass
    return None


def _parse_date(val: str, col: str) -> tuple[date | None, list[str]]:
    flags: list[str] = []
    if not val or val.strip().lower() in _BLANK:
        return None, flags
    v = val.strip()

    # Excel serial (5-digit integer)
    if re.fullmatch(r"\d{5}", v):
        d = _excel_serial(v)
        if d:
            return d, flags

    # YYYYMMDD
    if re.fullmatch(r"\d{8}", v):
        try:
            return datetime.strptime(v, "%Y%m%d").date(), flags
        except ValueError:
            pass

    # Named month formats
    for fmt in (
        "%d-%b-%Y", "%d %b %Y", "%b %d, %Y", "%b %d %Y",
        "%d-%B-%Y", "%d %B %Y", "%B %d, %Y", "%B %d %Y",
    ):
        try:
            return datetime.strptime(v, fmt).date(), flags
        except ValueError:
            continue

    # ISO and slash-YYYY
    for fmt in ("%Y/%m/%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(v, fmt).date(), flags
        except ValueError:
            continue

    # DD.MM.YYYY
    try:
        return datetime.strptime(v, "%d.%m.%Y").date(), flags
    except ValueError:
        pass

    # Ambiguous NN/NN/YYYY or NN-NN-YYYY
    m = re.fullmatch(r"(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})", v)
    if m:
        a, b, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if a > 12:
            try:
                return date(year, b, a), flags
            except ValueError:
                pass
        elif b > 12:
            try:
                return date(year, a, b), flags
            except ValueError:
                pass
        else:
            flags.append(f"date_ambiguous_dd_mm_assumed:{col}")
            try:
                return date(year, b, a), flags
            except ValueError:
                pass

    return None, [f"unparseable_date:{col}"]


# ── Quantity helpers ───────────────────────────────────────────────────────────
def _parse_qty(val) -> tuple[int | None, list[str]]:
    flags: list[str] = []
    if val is None:
        return None, flags
    v = str(val).strip()
    if v.lower() in _BLANK:
        return None, flags

    v = re.sub(r"(?i)\s*(units?|pcs?|pieces?|ea|each)$", "", v).strip()

    if v.startswith("-"):
        flags.append(f"negative_quantity:{v}")
        return None, flags

    # European thousands: 1.234 or 1.234.567
    if re.fullmatch(r"\d{1,3}(\.\d{3})+", v):
        v = v.replace(".", "")

    v = v.replace(",", "").lstrip("0") or "0"

    try:
        f = float(v)
    except ValueError:
        flags.append("qty_unparseable")
        return None, flags

    if f < 0:
        flags.append(f"negative_quantity:{f}")
        return None, flags

    return math.ceil(f), flags


# ── Header normalisation ───────────────────────────────────────────────────────
def _nkey(k: str) -> str:
    return k.strip().lower().replace(" ", "_").replace("-", "_")


def _map_headers(raw_headers: list[str]) -> tuple[dict[str, str], list[str], dict[str, str]]:
    col_map: dict[str, str] = {}
    unknown: list[str] = []
    applied: dict[str, str] = {}
    for h in raw_headers:
        norm = _nkey(h)
        if norm in COLUMN_MAP:
            canon = COLUMN_MAP[norm]
            col_map[h] = canon
            if h != canon:
                applied[h] = canon
        else:
            unknown.append(h)
    return col_map, unknown, applied


# ── Single-row preprocessing ───────────────────────────────────────────────────
def _process_row(raw: dict, col_map: dict[str, str], row_num: int) -> tuple[dict | None, str | None]:
    flags: list[str] = []

    # Remap
    row: dict = {}
    for rk, val in raw.items():
        canon = col_map.get(rk)
        if canon and canon in _CANONICAL:
            row[canon] = val

    # supplier_id
    sid = str(row.get("supplier_id") or "").strip().upper()
    if not sid or sid.lower() in _BLANK:
        return None, "supplier_id_missing"

    # supplier_name
    raw_name = str(row.get("supplier_name") or "").strip()
    if not raw_name or raw_name.lower() in _BLANK:
        sname, flags = "Unknown Supplier", flags + ["supplier_name_filled_unknown"]
    else:
        sname = raw_name.title()

    # category
    raw_cat = str(row.get("category") or "").strip()
    if not raw_cat or raw_cat.lower() in _BLANK:
        cat, flags = "Uncategorized", flags + ["category_filled_uncategorized"]
    else:
        cat = raw_cat.title()

    # ordered_qty
    oq, oq_f = _parse_qty(row.get("ordered_qty"))
    flags.extend(oq_f)
    if oq is None:
        return None, "ordered_qty_missing"
    if oq <= 0:
        return None, "ordered_qty_zero_or_negative"

    # received_qty
    rq, rq_f = _parse_qty(row.get("received_qty"))
    flags.extend(rq_f)
    if rq is None:
        rq = round(oq * 0.90)
        flags.append("received_qty_estimated:90pct_of_ordered")

    # rejected_qty
    xq, xq_f = _parse_qty(row.get("rejected_qty"))
    flags.extend(xq_f)
    if xq is None:
        xq = 0
        flags.append("rejected_qty_assumed_zero")

    # dates
    raw_po = str(row.get("po_date") or "").strip()
    po_date, po_f = _parse_date(raw_po, "po_date")
    flags.extend(po_f)
    if po_date is None:
        flags.append("po_date_missing")

    raw_dd = str(row.get("delivery_date") or "").strip()
    delivery_date, dd_f = _parse_date(raw_dd, "delivery_date")
    flags.extend(dd_f)
    if delivery_date is None:
        flags.append("delivery_date_missing:otd_unavailable")

    raw_ed = str(row.get("expected_delivery_date") or "").strip()
    exp_date, ed_f = _parse_date(raw_ed, "expected_delivery_date")
    flags.extend(ed_f)
    if exp_date is None:
        flags.append("expected_delivery_date_missing:otd_unavailable")

    # sanity checks
    if rq > oq:
        rq = oq
        flags.append("received_capped_to_ordered")
    if xq > rq:
        xq = rq
        flags.append("rejected_capped_to_received")
    if oq == 0 and rq == 0 and xq == 0:
        return None, "all_quantities_zero"
    if delivery_date and po_date and delivery_date < po_date:
        flags.append("delivery_before_po:suspicious")
    if exp_date and po_date and exp_date < po_date:
        flags.append("expected_before_po:suspicious")
    if delivery_date and delivery_date > TODAY + timedelta(days=365):
        flags.append("future_date:suspicious")

    # computed fields
    delay_days: int | None = None
    is_on_time: bool | None = None
    if delivery_date and exp_date:
        delay_days = (delivery_date - exp_date).days
        is_on_time = delay_days <= 0
        if delay_days > 90:
            flags.append("extreme_delay:verify")

    # deduplicate flags
    seen: set[str] = set()
    unique_flags: list[str] = []
    for f in flags:
        if f not in seen:
            seen.add(f)
            unique_flags.append(f)

    return {
        "supplier_id":            sid,
        "supplier_name":          sname,
        "category":               cat,
        "po_date":                po_date.isoformat() if po_date else None,
        "delivery_date":          delivery_date.isoformat() if delivery_date else None,
        "expected_delivery_date": exp_date.isoformat() if exp_date else None,
        "ordered_qty":            oq,
        "received_qty":           rq,
        "rejected_qty":           xq,
        "is_on_time":             is_on_time,
        "delay_days":             delay_days,
        "_row_number":            row_num,
        "_row_flags":             unique_flags,
    }, None


# ── Public entry point ─────────────────────────────────────────────────────────
def run(raw_rows: list[dict]) -> dict:
    """
    Run the preprocessing agent over a list of raw rows.
    Returns the full agent output dict.
    """
    total = len(raw_rows)
    raw_headers = list(raw_rows[0].keys()) if raw_rows else []
    col_map, unknown_cols, col_mapping = _map_headers(raw_headers)

    clean_data: list[dict] = []
    dropped_rows: list[dict] = []
    rows_flagged = 0

    _MISSING_COLS = {
        "supplier_name_filled_unknown":           "supplier_name",
        "category_filled_uncategorized":          "category",
        "received_qty_estimated:90pct_of_ordered": "received_qty",
        "rejected_qty_assumed_zero":              "rejected_qty",
        "po_date_missing":                        "po_date",
        "delivery_date_missing:otd_unavailable":           "delivery_date",
        "expected_delivery_date_missing:otd_unavailable":  "expected_delivery_date",
    }
    _ACTIONS = {
        "supplier_name":          "→ set to 'Unknown Supplier'",
        "category":               "→ set to 'Uncategorized'",
        "received_qty":           "→ estimated as ordered_qty × 0.90",
        "rejected_qty":           "→ set to 0",
        "po_date":                "→ set to null",
        "delivery_date":          "→ set to null, OTD skipped",
        "expected_delivery_date": "→ set to null, OTD skipped",
    }

    missing_counts: dict[str, int] = defaultdict(int)

    for i, raw in enumerate(raw_rows, start=1):
        clean, drop_reason = _process_row(raw, col_map, i)
        if drop_reason:
            dropped_rows.append({"row_number": i, "reason": drop_reason})
        else:
            if clean["_row_flags"]:
                rows_flagged += 1
                for f in clean["_row_flags"]:
                    col = _MISSING_COLS.get(f)
                    if col:
                        missing_counts[col] += 1
            clean_data.append(clean)

    rows_processed = len(clean_data)
    rows_dropped = len(dropped_rows)
    dq_score = round((rows_processed / total) * 100, 1) if total else 0.0

    if dq_score >= 85:
        status = "success"
    elif dq_score >= 50:
        status = "partial"
    else:
        status = "failed"

    if rows_processed == 0:
        status = "failed"

    warnings: list[str] = []
    if unknown_cols:
        warnings.append(f"Unknown columns ignored: {', '.join(unknown_cols)}")
    if dq_score < 85 and status != "failed":
        warnings.append(f"Data quality score {dq_score}% — review dropped rows")

    return {
        "agent": "preprocessing",
        "status": status,
        "report": {
            "total_rows_received": total,
            "rows_processed":      rows_processed,
            "rows_flagged":        rows_flagged,
            "rows_dropped":        rows_dropped,
            "data_quality_score":  dq_score,
            "column_mapping":      col_mapping,
            "missing_fixes": {
                col: f"{cnt} row(s) {_ACTIONS.get(col, '→ fixed')}"
                for col, cnt in missing_counts.items()
            },
            "dropped_rows":               dropped_rows,
            "unknown_columns_ignored":    unknown_cols,
            "warnings":                   warnings,
        },
        "clean_data": clean_data,
    }
