"""
SupplyLens – FastAPI Backend
Run: uvicorn main:app --reload
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse

from app.core.config import get_settings
from app.database import engine, Base
from app.routers import suppliers_router, metrics_router, health_router, auth_router, upload_router, email_router

# Import models so SQLAlchemy registers them before create_all
import app.models  # noqa: F401

settings = get_settings()
_logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup: create tables if DB is reachable ───────────────────────────
    try:
        Base.metadata.create_all(bind=engine)
        _logger.info("Database tables verified / created.")
    except Exception as exc:
        _logger.warning(
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
    default_response_class=ORJSONResponse,  # orjson: faster serialization for large payloads
)

# ── Middleware (outermost = applied last to response) ──────────────────────────
# GZip: compress all responses > 1 KB — improves network performance significantly
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def _timing_middleware(request: Request, call_next):
    """Log slow endpoints and expose X-Process-Time-Ms header for debugging."""
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Process-Time-Ms"] = f"{duration_ms:.1f}"
    if duration_ms > 500:
        _logger.warning(
            "Slow response: %s %s — %.0f ms",
            request.method, request.url.path, duration_ms,
        )
    return response


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(suppliers_router, prefix="/api/v1")
app.include_router(metrics_router, prefix="/api/v1")
app.include_router(upload_router, prefix="/api/v1")
app.include_router(email_router, prefix="/api/v1")


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
