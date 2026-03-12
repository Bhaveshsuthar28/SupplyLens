from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database import get_db
from app.models.supplier import Supplier, WeeklyScore
from app.core.security import verify_access_token
from app.agents import weight_recalculation as wr_agent

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"],
    dependencies=[Depends(verify_access_token)],  # protects every route
)


@router.get("/summary", summary="Aggregated KPI summary")
def get_summary(db: Session = Depends(get_db)):
    total = db.query(func.count(Supplier.id)).scalar()
    avg_score = db.query(func.avg(Supplier.composite_score)).scalar()
    avg_otd = db.query(func.avg(Supplier.otd)).scalar()
    avg_fill = db.query(func.avg(Supplier.fill_rate)).scalar()
    avg_reject = db.query(func.avg(Supplier.reject_rate)).scalar()

    grade_dist = (
        db.query(Supplier.grade, func.count(Supplier.id))
        .group_by(Supplier.grade)
        .all()
    )
    category_dist = (
        db.query(Supplier.category, func.count(Supplier.id))
        .group_by(Supplier.category)
        .all()
    )

    return {
        "total_suppliers": total,
        "avg_composite_score": round(avg_score or 0, 1),
        "avg_otd": round(avg_otd or 0, 1),
        "avg_fill_rate": round(avg_fill or 0, 1),
        "avg_reject_rate": round(avg_reject or 0, 1),
        "grade_distribution": {g: c for g, c in grade_dist},
        "category_distribution": {cat: c for cat, c in category_dist},
    }


@router.get("/top-performers", summary="Top 5 suppliers by composite score")
def top_performers(db: Session = Depends(get_db)):
    rows = (
        db.query(Supplier)
        .order_by(Supplier.composite_score.desc())
        .limit(5)
        .all()
    )
    return [
        {"id": s.id, "name": s.name, "grade": s.grade, "composite_score": s.composite_score}
        for s in rows
    ]


@router.get("/risk-suppliers", summary="Suppliers with grade D or C")
def risk_suppliers(db: Session = Depends(get_db)):
    rows = (
        db.query(Supplier)
        .filter(Supplier.grade.in_(["C", "D"]))
        .order_by(Supplier.composite_score.asc())
        .all()
    )
    return [
        {
            "id": s.id,
            "name": s.name,
            "grade": s.grade,
            "composite_score": s.composite_score,
            "trend": s.trend,
        }
        for s in rows
    ]


@router.get("/weekly-trend", summary="Avg composite score per week (filterable)")
def weekly_trend(
    category: str = Query(None),
    grade: str = Query(None, pattern="^[ABCD]$"),
    db: Session = Depends(get_db),
):
    q = (
        db.query(WeeklyScore.week, func.avg(WeeklyScore.composite).label("avg"))
        .join(WeeklyScore.supplier)
    )
    if category:
        q = q.filter(Supplier.category == category)
    if grade:
        q = q.filter(Supplier.grade == grade)
    q = q.filter(WeeklyScore.composite > 0)
    rows = q.group_by(WeeklyScore.week).order_by(WeeklyScore.week).all()
    return [{"week": r.week, "avg": round(r.avg or 0)} for r in rows]


# ── Weight Recalculation ──────────────────────────────────────────────────────

class WeightsBody(BaseModel):
    new_weights: dict  # {weight_otd, weight_fr, weight_qr} as fractions summing to 1
    old_weights: dict


@router.post("/recalculate", summary="Recalculate all scores with new weights")
def recalculate_weights(payload: WeightsBody, db: Session = Depends(get_db)):
    # Build historical_data from all WeeklyScore rows joined with Supplier
    rows = (
        db.query(WeeklyScore)
        .options(joinedload(WeeklyScore.supplier))
        .order_by(WeeklyScore.supplier_id, WeeklyScore.week)
        .all()
    )

    def _old_rating(score):
        if score >= 95: return "A"
        if score >= 85: return "B"
        if score >= 70: return "C"
        return "D"

    historical_data = [
        {
            "record_id":           row.id,
            "supplier_id":         row.supplier_id,
            "supplier_name":       row.supplier.name,
            "category":            row.supplier.category,
            "week_start_date":     row.week,
            "otd_pct":             row.otd,
            "fr_pct":              row.fill_rate,
            "qr_pct":              row.reject_rate,
            "old_composite_score": float(row.composite),
            "old_rating":          _old_rating(row.composite),
        }
        for row in rows
    ]

    result = wr_agent.run(payload.new_weights, payload.old_weights, historical_data)

    # Bulk-update WeeklyScore.composite
    rec_map = {r["record_id"]: r for r in result["recalculated_records"]}
    for row in rows:
        rec = rec_map.get(row.id)
        if rec and rec["score"]["new_composite_score"] is not None:
            row.composite = int(round(rec["score"]["new_composite_score"]))

    # Update each Supplier using its latest week's recalculated record
    latest: dict = {}
    for rec in result["recalculated_records"]:
        sid = rec["supplier_id"]
        if sid not in latest or rec["week_start_date"] > latest[sid]["week_start_date"]:
            latest[sid] = rec

    for sid, rec in latest.items():
        supplier = db.query(Supplier).filter(Supplier.id == sid).first()
        if not supplier:
            continue
        ns = rec["score"]["new_composite_score"]
        nr = rec["score"]["new_rating"]
        t  = rec["trend"].get("trend_30d") or "Stable"
        if t == "Insufficient Data":
            t = "Stable"
        if ns is not None:
            supplier.composite_score = int(round(ns))
        if nr:
            supplier.grade = nr
        supplier.trend = t

    db.commit()

    # Return impact summary only (skip bulk recalculated_records to keep response lean)
    return {
        "status":          result["status"],
        "weights_applied": result["weights_applied"],
        "impact_summary":  result["impact_summary"],
    }
