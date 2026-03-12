"""
app/routers/email.py

POST /api/v1/email/send  — manually send an email from the UI.

Emails are dispatched in a background task so the API returns
immediately without waiting for SMTP.
"""

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr

from app.core.security import verify_access_token
from app.services.mail_service import send_email

router = APIRouter(
    prefix="/email",
    tags=["Email"],
    dependencies=[Depends(verify_access_token)],
)


class EmailRequest(BaseModel):
    to_email: EmailStr
    from_email: EmailStr | None = None   # optional override; must be Brevo-verified
    subject: str
    message: str


@router.post("/send", summary="Send an email manually")
async def send_manual_email(
    payload: EmailRequest,
    background_tasks: BackgroundTasks,
):
    """Queue an outbound email. Returns immediately; SMTP happens in background."""
    background_tasks.add_task(
        send_email,
        to_email=str(payload.to_email),
        subject=payload.subject,
        body=payload.message,
        from_email=str(payload.from_email) if payload.from_email else None,
    )
    return {
        "status": "queued",
        "to": str(payload.to_email),
        "subject": payload.subject,
    }
