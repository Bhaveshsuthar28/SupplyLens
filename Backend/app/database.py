from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

# Aiven requires SSL – PyMySQL passes connect_args to the underlying driver
connect_args: dict = {}
if settings.db_ssl_mode.upper() == "REQUIRED":
    connect_args["ssl"] = {"ssl_disabled": False}

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,       # test connections before using them
    pool_recycle=3600,        # recycle connections every hour
    pool_size=10,             # more connections ready for burst requests
    max_overflow=20,
    echo=False,               # never log every SQL query (too noisy, adds overhead)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ── Dependency ─────────────────────────────────────────────────────────────
def get_db():
    """Yield a DB session and guarantee it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
