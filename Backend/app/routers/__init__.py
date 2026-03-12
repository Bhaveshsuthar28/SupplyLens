from app.routers.suppliers import router as suppliers_router
from app.routers.metrics import router as metrics_router
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.upload import router as upload_router
from app.routers.email import router as email_router

__all__ = ["suppliers_router", "metrics_router", "health_router", "auth_router", "upload_router", "email_router"]

