"""
SupplyLens – FastAPI Backend
Run: uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import get_settings
from app.database import engine, Base
from app.routers import suppliers_router, metrics_router, health_router, auth_router, upload_router

# Import models so SQLAlchemy registers them before create_all
import app.models  # noqa: F401

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup: create tables if DB is reachable ───────────────────────────
    import logging
    logger = logging.getLogger("uvicorn.error")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified / created.")
    except Exception as exc:
        logger.warning(
            f"Could not connect to DB on startup (tables not created): {exc}\n"
            "Fix DB_HOST in .env and restart. The API will still serve requests."
        )
    yield
    # ── Shutdown ─────────────────────────────────────────────────────────────


app = FastAPI(
    title="SupplyLens API",
    description="Supplier performance analytics backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(suppliers_router, prefix="/api/v1")
app.include_router(metrics_router, prefix="/api/v1")
app.include_router(upload_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {"message": "SupplyLens API is running", "docs": "/docs"}


# ── Dev entrypoint ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.debug,
    )
