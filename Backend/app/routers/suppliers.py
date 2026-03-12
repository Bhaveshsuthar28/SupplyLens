from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.supplier import Supplier, WeeklyScore
from app.core.security import verify_access_token
from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierOut,
    SupplierSummary,
    PaginatedSuppliers,
    WeeklyScoreCreate,
    WeeklyScoreOut,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
    dependencies=[Depends(verify_access_token)],  # protects every route
)


# ── helpers ──────────────────────────────────────────────────────────────────

def _get_or_404(supplier_id: str, db: Session) -> Supplier:
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supplier '{supplier_id}' not found",
        )
    return supplier


# ── CRUD ─────────────────────────────────────────────────────────────────────

@router.get("/", response_model=PaginatedSuppliers, summary="List suppliers")
def list_suppliers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=1000),
    category: str = Query(None),
    grade: str = Query(None, pattern="^[ABCD]$"),
    search: str = Query(None, description="Search by name"),
    db: Session = Depends(get_db),
):
    q = db.query(Supplier)
    if category:
        q = q.filter(Supplier.category == category)
    if grade:
        q = q.filter(Supplier.grade == grade)
    if search:
        q = q.filter(Supplier.name.ilike(f"%{search}%"))

    total = q.count()
    suppliers = q.offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedSuppliers(total=total, page=page, page_size=page_size, data=suppliers)


@router.get("/{supplier_id}", response_model=SupplierOut, summary="Get supplier detail")
def get_supplier(supplier_id: str, db: Session = Depends(get_db)):
    return _get_or_404(supplier_id, db)


@router.post("/", response_model=SupplierOut, status_code=status.HTTP_201_CREATED, summary="Create supplier")
def create_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
    if db.query(Supplier).filter(Supplier.id == payload.id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Supplier ID '{payload.id}' already exists",
        )
    supplier_data = payload.model_dump(exclude={"weekly_scores"})
    supplier = Supplier(**supplier_data)

    for ws in payload.weekly_scores:
        supplier.weekly_scores.append(WeeklyScore(**ws.model_dump(), supplier_id=payload.id))

    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


@router.put("/{supplier_id}", response_model=SupplierOut, summary="Update supplier")
def update_supplier(
    supplier_id: str, payload: SupplierUpdate, db: Session = Depends(get_db)
):
    supplier = _get_or_404(supplier_id, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(supplier, field, value)
    db.commit()
    db.refresh(supplier)
    return supplier


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT, summary="Delete all suppliers")
def delete_all_suppliers(db: Session = Depends(get_db)):
    db.query(WeeklyScore).delete()
    db.query(Supplier).delete()
    db.commit()


@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete supplier")
def delete_supplier(supplier_id: str, db: Session = Depends(get_db)):
    supplier = _get_or_404(supplier_id, db)
    db.delete(supplier)
    db.commit()


# ── Weekly Scores ─────────────────────────────────────────────────────────────

@router.get("/{supplier_id}/weekly-scores", response_model=list[WeeklyScoreOut])
def get_weekly_scores(supplier_id: str, db: Session = Depends(get_db)):
    _get_or_404(supplier_id, db)
    return db.query(WeeklyScore).filter(WeeklyScore.supplier_id == supplier_id).all()


@router.post(
    "/{supplier_id}/weekly-scores",
    response_model=WeeklyScoreOut,
    status_code=status.HTTP_201_CREATED,
)
def add_weekly_score(
    supplier_id: str, payload: WeeklyScoreCreate, db: Session = Depends(get_db)
):
    _get_or_404(supplier_id, db)
    score = WeeklyScore(**payload.model_dump(), supplier_id=supplier_id)
    db.add(score)
    db.commit()
    db.refresh(score)
    return score
