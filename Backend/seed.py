"""
seed.py – Populate the database with the initial mock supplier data.
Run: python seed.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal, engine, Base
import app.models  # noqa – register models
from app.models.supplier import Supplier, WeeklyScore

MOCK_SUPPLIERS = [
    {
        "id": "S001", "name": "Krishna Supplies", "category": "Packaging",
        "otd": 74.2, "fill_rate": 99.0, "reject_rate": 6.5,
        "composite_score": 87, "grade": "B", "trend": "Erratic",
        "weekly_scores": [
            {"week": "W1", "otd": 72.1, "fill_rate": 98.0, "reject_rate": 6.6, "composite": 86},
            {"week": "W2", "otd": 76.7, "fill_rate": 97.6, "reject_rate": 7.3, "composite": 88},
            {"week": "W3", "otd": 76.4, "fill_rate": 98.4, "reject_rate": 5.9, "composite": 88},
            {"week": "W4", "otd": 73.1, "fill_rate": 96.7, "reject_rate": 6.3, "composite": 86},
        ],
    },
    {
        "id": "S002", "name": "Apex Logistics", "category": "Freight/Pkg",
        "otd": 95.0, "fill_rate": 97.5, "reject_rate": 1.2,
        "composite_score": 95, "grade": "A", "trend": "Stable",
        "weekly_scores": [
            {"week": "W1", "otd": 94.0, "fill_rate": 97.0, "reject_rate": 1.3, "composite": 94},
            {"week": "W2", "otd": 96.0, "fill_rate": 98.0, "reject_rate": 1.1, "composite": 96},
            {"week": "W3", "otd": 95.5, "fill_rate": 97.5, "reject_rate": 1.2, "composite": 95},
            {"week": "W4", "otd": 94.5, "fill_rate": 97.5, "reject_rate": 1.2, "composite": 95},
        ],
    },
    {
        "id": "S003", "name": "Global Fasteners Co.", "category": "Fasteners",
        "otd": 60.0, "fill_rate": 85.0, "reject_rate": 12.0,
        "composite_score": 65, "grade": "D", "trend": "Declining",
        "weekly_scores": [
            {"week": "W1", "otd": 65.0, "fill_rate": 87.0, "reject_rate": 11.0, "composite": 68},
            {"week": "W2", "otd": 62.0, "fill_rate": 86.0, "reject_rate": 11.5, "composite": 66},
            {"week": "W3", "otd": 59.0, "fill_rate": 84.0, "reject_rate": 12.5, "composite": 63},
            {"week": "W4", "otd": 57.0, "fill_rate": 83.0, "reject_rate": 13.0, "composite": 62},
        ],
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in MOCK_SUPPLIERS:
            existing = db.query(Supplier).filter(Supplier.id == data["id"]).first()
            if existing:
                print(f"  Skipping {data['id']} – already exists")
                continue
            scores = data.pop("weekly_scores", [])
            supplier = Supplier(**data)
            for s in scores:
                supplier.weekly_scores.append(
                    WeeklyScore(**s, supplier_id=supplier.id)
                )
            db.add(supplier)
            print(f"  Inserted {supplier.id} – {supplier.name}")
        db.commit()
        print("Seed complete.")
    except Exception as exc:
        db.rollback()
        print(f"Error: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
