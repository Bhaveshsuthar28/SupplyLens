"""
seed.py – Initialise database tables (no mock data).
Run: python seed.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import engine, Base
import app.models  # noqa – register models

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tables created (or already exist). No seed data inserted.")
