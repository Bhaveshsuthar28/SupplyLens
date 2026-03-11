from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.database import get_db
from app.models.supplier import Supplier
from app.core.security import verify_access_token

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
