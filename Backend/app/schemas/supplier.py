from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


# ── Weekly Score ────────────────────────────────────────────────────────────

class WeeklyScoreBase(BaseModel):
    week: str = Field(..., examples=["W1"])
    otd: float = Field(..., ge=0, le=100)
    fill_rate: float = Field(..., ge=0, le=100)
    reject_rate: float = Field(..., ge=0, le=100)
    composite: int = Field(..., ge=0, le=100)


class WeeklyScoreCreate(WeeklyScoreBase):
    pass


class WeeklyScoreOut(WeeklyScoreBase):
    id: int
    supplier_id: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── Supplier ─────────────────────────────────────────────────────────────────

class SupplierBase(BaseModel):
    id: str = Field(..., min_length=1, max_length=20, examples=["S001"])
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., max_length=100)
    otd: float = Field(..., ge=0, le=100, description="On-Time Delivery %")
    fill_rate: float = Field(..., ge=0, le=100, description="Fill Rate %")
    reject_rate: float = Field(..., ge=0, le=100, description="Reject Rate %")
    composite_score: int = Field(..., ge=0, le=100)
    grade: str = Field(..., pattern="^[ABCD]$")
    trend: str = Field(default="Stable", max_length=50)
    notes: Optional[str] = None


class SupplierCreate(SupplierBase):
    weekly_scores: list[WeeklyScoreCreate] = []


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    otd: Optional[float] = Field(default=None, ge=0, le=100)
    fill_rate: Optional[float] = Field(default=None, ge=0, le=100)
    reject_rate: Optional[float] = Field(default=None, ge=0, le=100)
    composite_score: Optional[int] = Field(default=None, ge=0, le=100)
    grade: Optional[str] = Field(default=None, pattern="^[ABCD]$")
    trend: Optional[str] = None
    notes: Optional[str] = None


class SupplierOut(SupplierBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    weekly_scores: list[WeeklyScoreOut] = []

    model_config = {"from_attributes": True}


class SupplierSummary(BaseModel):
    """Lightweight projection used in list endpoints."""
    id: str
    name: str
    category: str
    composite_score: int
    grade: str
    trend: str
    otd: float
    fill_rate: float
    reject_rate: float

    model_config = {"from_attributes": True}


# ── Pagination wrapper ────────────────────────────────────────────────────────

class PaginatedSuppliers(BaseModel):
    total: int
    page: int
    page_size: int
    data: list[SupplierSummary]
