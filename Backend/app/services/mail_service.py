"""
app/services/mail_service.py

Async email sender built on fastapi-mail 1.x + Brevo SMTP.

Usage:
    await send_email(to_email, subject, body)                 # basic send
    await send_supplier_alert(to_email, name, rating, score)  # pre-formatted alert
"""

import logging

from pydantic import SecretStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _build_conf() -> ConnectionConfig:
    """Build SMTP config using the authenticated Brevo SMTP user as sender."""
    settings = get_settings()
    return ConnectionConfig(
        MAIL_USERNAME=settings.smtp_user,
        MAIL_PASSWORD=SecretStr(settings.smtp_pass),
        MAIL_FROM=settings.mail_default_from or settings.smtp_user,
        MAIL_FROM_NAME="SupplyLens",
        MAIL_PORT=settings.smtp_port,
        MAIL_SERVER=settings.smtp_host,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )


async def send_email(
    to_email: str,
    subject: str,
    body: str,
    from_email: str | None = None,
) -> None:
    """Send a plain-text email.

    from_email is accepted for API compatibility but ignored — Brevo requires
    the sender to match a verified address. The configured MAIL_DEFAULT_FROM
    (your Brevo SMTP user) is always used as the actual sender.
    """
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[to_email],
            body=body,
            subtype=MessageType.plain,
        )
        await FastMail(_build_conf()).send_message(message)
        logger.info("Email sent to %s | subject: %s", to_email, subject)
    except Exception as exc:
        logger.error("Email FAILED to %s | %s: %s", to_email, type(exc).__name__, exc)
        raise


async def send_supplier_alert(
    to_email: str,
    supplier_name: str,
    rating: str,
    score: float | int,
    from_email: str | None = None,
) -> None:
    """Send a pre-formatted C / D rating performance alert."""
    divider = "-" * 42
    body = (
        f"Supplier Performance Warning\n"
        f"{divider}\n\n"
        f"Supplier : {supplier_name}\n"
        f"Rating   : {rating}\n"
        f"Score    : {score}\n\n"
        f"This supplier is currently underperforming and requires immediate review.\n\n"
        f"Please take corrective action to prevent supply chain disruptions.\n\n"
        f"{divider}\n"
        f"SupplyLens - Automated Alert\n"
        f"Do not reply to this address."
    )
    await send_email(
        to_email=to_email,
        subject=f"[SupplyLens] Supplier Alert - {supplier_name} rated {rating}",
        body=body,
    )
