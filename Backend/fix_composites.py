"""
fix_composites.py

One-time migration: recalculate WeeklyScore.composite for all rows
where composite = 0, using the stored KPI values.

Run once from the Backend directory:
    python fix_composites.py

Formula (same as analytics agent, default weights):
    composite = 0.40 * otd + 0.30 * fill_rate + 0.30 * (100 - reject_rate)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal
from app.models.supplier import WeeklyScore


def recalculate(otd: float, fr: float, qr: float) -> int:
    """Compute composite score with the default 0.4/0.3/0.3 weights."""
    return round(0.40 * otd + 0.30 * fr + 0.30 * (100.0 - qr))


def main():
    db = SessionLocal()
    try:
        rows = db.query(WeeklyScore).filter(WeeklyScore.composite == 0).all()
        print(f"Found {len(rows)} rows with composite = 0")

        fixed = 0
        for row in rows:
            # Skip rows where all KPIs are genuinely 0 (no real data)
            if row.otd == 0 and row.fill_rate == 0 and row.reject_rate == 0:
                continue
            new_composite = recalculate(row.otd, row.fill_rate, row.reject_rate)
            if new_composite > 0:
                row.composite = new_composite
                fixed += 1

        db.commit()
        print(f"Recalculated and fixed {fixed} rows.")
        print("Done. Re-upload any CSV to get fresh data going forward.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
