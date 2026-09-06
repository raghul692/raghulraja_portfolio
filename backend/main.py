import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import re
import logging
from datetime import datetime
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter

# Import Database & Portfolio AI Routers
from app.db import init_db, insert_contact_submission, get_db
from app.routers import chat, ats, resume, placement, github, admin

# Load environment variables explicitly from backend/.env and current directory
backend_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=backend_env)
load_dotenv()

logger = logging.getLogger("portfolio")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)

app = FastAPI(
    title="Portfolio AI System & Developer API",
    version="1.0.0",
    description="Unified API backend for personal portfolio contact form, RAG Q&A, ATS checking, ATS resume building, placement preparation, and GitHub auto-sync."
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

cors_env = os.getenv("CORS_ORIGINS", "")
if cors_env:
    allowed_origins = [orig.strip() for orig in cors_env.split(",") if orig.strip()]
else:
    allowed_origins = [
        "https://raghulraja.is-a.dev",
        "https://raghulraja-portfolio.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(ats.router)
app.include_router(resume.router)
app.include_router(placement.router)
app.include_router(github.router)
app.include_router(admin.router)

class ContactSubmission(BaseModel):
    name: str
    email: str
    subject: str | None = None
    message: str
    honeypot: str | None = None

@app.on_event("startup")
def startup():
    try:
        init_db()
        logger.info("Application startup: Supabase PostgreSQL connected.")
    except Exception as e:
        logger.error(f"Application startup error connecting to Supabase: {e}")

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Portfolio AI System & Developer API is running",
        "documentation": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health():
    db_status = "healthy"
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
    except Exception as e:
        db_status = f"unhealthy: {e}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "system": "Portfolio AI Intelligence Suite",
        "database_engine": "Supabase PostgreSQL + pgvector",
        "database_status": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

def send_email_notification(submission: ContactSubmission):
    resend_api_key = os.getenv("RESEND_API_KEY", "").strip()
    resend_from = os.getenv("RESEND_FROM_EMAIL", "Portfolio Contact <onboarding@resend.dev>").strip()
    to_email = os.getenv("TO_EMAIL", "raghulraja2006@gmail.com").strip()
    subject = f"New Contact Form Submission: {submission.subject or 'No Subject'}"

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.1) 100%); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 40px; backdrop-filter: blur(20px);">
              <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0; background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                New Contact Form Submission
              </h1>
              <p style="font-size: 14px; color: #94a3b8; margin: 0 0 32px 0;">
                You received a new message from your portfolio website
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 12px; display: block;">
                    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin: 0 0 4px 0; font-weight: 600;">Name</p>
                    <p style="font-size: 16px; margin: 0; color: #f1f5f9;">{submission.name}</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; display: block;">
                    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin: 0 0 4px 0; font-weight: 600;">Email</p>
                    <p style="font-size: 16px; margin: 0; color: #f1f5f9;">{submission.email}</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; display: block;">
                    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin: 0 0 4px 0; font-weight: 600;">Subject</p>
                    <p style="font-size: 16px; margin: 0; color: #f1f5f9;">{submission.subject or 'No subject'}</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; display: block;">
                    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin: 0 0 8px 0; font-weight: 600;">Message</p>
                    <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #cbd5e1; white-space: pre-wrap;">{submission.message}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
                    <p style="font-size: 12px; color: #64748b; margin: 0;">
                      Received on {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    # 1. Primary: Send via Resend HTTP API (Built-in urllib, zero external dependency issues)
    if resend_api_key:
        try:
            import urllib.request
            import json

            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Portfolio-Contact/1.0"
            }
            payload = json.dumps({
                "from": resend_from,
                "to": [to_email],
                "reply_to": submission.email,
                "subject": subject,
                "html": html_content
            }).encode("utf-8")

            req = urllib.request.Request("https://api.resend.com/emails", data=payload, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                result_data = json.loads(response.read().decode())
                email_id = result_data.get("id")
                logger.info("Email notification sent successfully via Resend API to %s (ID: %s)", to_email, email_id)
                return {"status": "sent", "provider": "resend", "id": email_id}
        except Exception as resend_err:
            logger.error("Resend API urllib exception: %s. Attempting fallback...", resend_err)
            try:
                import requests
                headers = {
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "Portfolio-Contact/1.0"
                }
                res = requests.post(
                    "https://api.resend.com/emails",
                    headers=headers,
                    json={
                        "from": resend_from,
                        "to": [to_email],
                        "reply_to": submission.email,
                        "subject": subject,
                        "html": html_content
                    },
                    timeout=10
                )
                if res.status_code in (200, 201):
                    email_id = res.json().get("id")
                    logger.info("Email notification sent successfully via Resend requests to %s (ID: %s)", to_email, email_id)
                    return {"status": "sent", "provider": "resend", "id": email_id}
            except Exception as req_err:
                logger.error("Resend requests fallback also failed: %s", req_err)

    # 2. Fallback: SMTP Sending
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_password = os.getenv("EMAIL_PASSWORD", "").replace(" ", "").strip()

    if not email_user or not email_password:
        logger.error("Neither Resend API nor SMTP credentials configured in backend environment")
        return {"status": "failed", "error": "No email delivery service available"}

    domain = email_user.split('@')[1] if '@' in email_user else 'gmail.com'
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = to_email
    msg["Reply-To"] = submission.email
    msg["Message-ID"] = f"<{datetime.utcnow().timestamp()}@{domain}>"

    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, 465, timeout=10) as server:
                server.login(email_user, email_password)
                server.sendmail(email_user, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(email_user, email_password)
                server.sendmail(email_user, [to_email], msg.as_string())
        logger.info("Email notification sent successfully via SMTP to %s", to_email)
        return {"status": "sent", "provider": "smtp"}
    except Exception as e:
        logger.error("Failed to send email notification via SMTP: %s", e)
        try:
            logger.info("Attempting SMTP_SSL fallback on port 465...")
            with smtplib.SMTP_SSL(smtp_server, 465, timeout=10) as server:
                server.login(email_user, email_password)
                server.sendmail(email_user, [to_email], msg.as_string())
            logger.info("Fallback SMTP email notification sent successfully to %s", to_email)
            return {"status": "sent", "provider": "smtp_ssl_fallback"}
        except Exception as fallback_err:
            logger.error("Fallback SMTP sending also failed: %s", fallback_err)
            return {"status": "failed", "error": str(e)}

def send_auto_responder_email(submission: ContactSubmission):
    resend_api_key = os.getenv("RESEND_API_KEY", "").strip()
    resend_from = os.getenv("RESEND_FROM_EMAIL", "Portfolio Contact <onboarding@resend.dev>").strip()

    subject = f"Thank you for contacting Raghul Raja M"
    html_content = f"""<!DOCTYPE html>
<html>
<body style="font-family: 'Inter', sans-serif; background: #0a0a0f; color: #fff; padding: 30px;">
  <div style="max-width: 500px; margin: auto; background: #12121a; padding: 24px; border-radius: 12px; border: 1px solid #6366f1;">
    <h2 style="color: #6366f1; margin-top: 0;">Hi {submission.name},</h2>
    <p style="color: #cbd5e1; line-height: 1.6;">Thank you for reaching out through my developer portfolio! I have received your message regarding <strong>"{submission.subject or 'General Inquiry'}"</strong> and will get back to you shortly.</p>
    <p style="color: #94a3b8; font-size: 13px;">Best regards,<br><strong style="color: #fff;">Raghul Raja M</strong><br>Full Stack Developer & AI/ML Specialist</p>
  </div>
</body>
</html>"""

    # 1. Attempt Resend for auto-responder
    if resend_api_key:
        try:
            import urllib.request
            import json
            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Portfolio-Contact/1.0"
            }
            payload = json.dumps({
                "from": resend_from,
                "to": [submission.email],
                "subject": subject,
                "html": html_content
            }).encode("utf-8")
            req = urllib.request.Request("https://api.resend.com/emails", data=payload, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                logger.info("Auto responder email sent via Resend to %s", submission.email)
                return {"status": "sent", "provider": "resend"}
        except Exception:
            pass

    # 2. SMTP fallback
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_password = os.getenv("EMAIL_PASSWORD", "").replace(" ", "").strip()

    if not email_user or not email_password:
        return {"status": "skipped", "reason": "No SMTP credentials for external auto-responder"}

    domain = email_user.split('@')[1] if '@' in email_user else 'gmail.com'
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = submission.email
    msg["Message-ID"] = f"<{datetime.utcnow().timestamp()}-auto@{domain}>"
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_server, 465, timeout=10) as server:
                server.login(email_user, email_password)
                server.sendmail(email_user, [submission.email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.login(email_user, email_password)
                server.sendmail(email_user, [submission.email], msg.as_string())
        logger.info("Auto responder email sent via SMTP to %s", submission.email)
        return {"status": "sent", "provider": "smtp"}
    except Exception as e:
        logger.error("Auto responder failed: %s", e)
        return {"status": "failed", "error": str(e)}

@app.post("/api/contact")
@limiter.limit("5/minute")
async def contact(request: Request, submission: ContactSubmission, background_tasks: BackgroundTasks):
    if submission.honeypot:
        return JSONResponse(status_code=200, content={"message": "OK"})

    if not submission.name or not submission.email or not submission.message:
        raise HTTPException(status_code=400, detail="Name, email, and message are required")

    email_regex = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if not email_regex.match(submission.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if len(submission.message.strip()) < 20:
        raise HTTPException(status_code=400, detail="Message must be at least 20 characters")

    try:
        submission_id = insert_contact_submission(
            name=submission.name,
            email=submission.email,
            subject=submission.subject,
            message=submission.message,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

        # Send owner notification immediately so delivery to Gmail is guaranteed
        email_result = send_email_notification(submission)

        # Queue auto-responder in background
        background_tasks.add_task(send_auto_responder_email, submission)

        return JSONResponse(
            status_code=200,
            content={
                "message": "Message sent successfully!",
                "id": submission_id,
                "email": email_result,
            },
        )
    except Exception as e:
        logger.error("Failed to save contact submission to Supabase: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to save message: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
