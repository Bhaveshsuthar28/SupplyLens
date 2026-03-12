from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class TrendEnum(str, enum.Enum):
    Improving = "Improving"
    Declining = "Declining"
    Stable = "Stable"
    Erratic = "Erratic"


class GradeEnum(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"


class CategoryEnum(str, enum.Enum):
    Packaging = "Packaging"
    FreightPkg = "Freight/Pkg"
    Components = "Components"
    Yarn = "Yarn"
    Fasteners = "Fasteners"
    RawMaterial = "Raw Material"


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String(20), primary_key=True, index=True)          # e.g. "S001"
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    otd = Column(Float, nullable=False, comment="On-Time Delivery %")
    fill_rate = Column(Float, nullable=False, comment="Fill Rate %")
    reject_rate = Column(Float, nullable=False, comment="Reject Rate %")
    composite_score = Column(Integer, nullable=False)
    grade = Column(String(2), nullable=False)
    trend = Column(String(50), nullable=False, default="Stable")
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    weekly_scores = relationship(
        "WeeklyScore", back_populates="supplier", cascade="all, delete-orphan"
    )


class WeeklyScore(Base):
    __tablename__ = "weekly_scores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_id = Column(
        String(20), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False
    )
    week = Column(String(10), nullable=False, comment="e.g. W1, W2 …")
    otd = Column(Float, nullable=False)
    fill_rate = Column(Float, nullable=False)
    reject_rate = Column(Float, nullable=False)
    composite = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier", back_populates="weekly_scores")


class MetricConfig(Base):
    """Single-row table that stores the active scoring weights.

    id is always 1 — use _get_or_create_config() to access it.
    """
    __tablename__ = "metric_config"

    id         = Column(Integer, primary_key=True, default=1)
    weight_otd = Column(Float, nullable=False, default=0.40)
    weight_fr  = Column(Float, nullable=False, default=0.30)
    weight_qr  = Column(Float, nullable=False, default=0.30)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
