import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
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

# Import Portfolio AI Routers
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

import sqlite3

USE_SQLITE = False
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio.db")

def get_db():
    global USE_SQLITE
    if USE_SQLITE:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "portfolio"),
        )
    except Exception as err:
        logger.warning("MySQL connection failed (%s). Falling back to local SQLite database.", err)
        USE_SQLITE = True
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    global USE_SQLITE
    try:
        conn = get_db()
        cursor = conn.cursor()
        if USE_SQLITE:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contact_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT,
                    message TEXT NOT NULL,
                    status TEXT DEFAULT 'new',
                    ip_address TEXT,
                    user_agent TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        else:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contact_submissions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    subject VARCHAR(255),
                    message TEXT NOT NULL,
                    status ENUM('new', 'read', 'replied') DEFAULT 'new',
                    ip_address VARCHAR(45),
                    user_agent TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
        conn.commit()
        cursor.close()
        conn.close()
        logger.info("Database initialized successfully (Engine: %s)", "SQLite" if USE_SQLITE else "MySQL")
    except Exception as e:
        logger.error("Database initialization failed: %s", e)

@app.on_event("startup")
def startup():
    init_db()

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
    return {
        "status": "ok",
        "system": "Portfolio AI Intelligence Suite",
        "database_engine": "Supabase PostgreSQL + pgvector",
        "timestamp": datetime.utcnow().isoformat()
    }

def send_email_notification(submission: ContactSubmission):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_password = os.getenv("EMAIL_PASSWORD", "").replace(" ", "").strip()
    to_email = os.getenv("TO_EMAIL", "raghulraja2006@gmail.com").strip()

    if not email_user or not email_password:
        logger.error("EMAIL_USER or EMAIL_PASSWORD is not configured in backend environment")
        return {"status": "failed", "error": "Email credentials are not configured"}

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

    domain = email_user.split('@')[1] if '@' in email_user else 'gmail.com'
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = to_email
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
        logger.info("Email notification sent successfully to %s", to_email)
        return {"status": "sent"}
    except Exception as e:
        logger.error("Failed to send email notification: %s", e)
        # Attempt fallback using SMTP_SSL port 465 if STARTTLS on 587 failed
        try:
            logger.info("Attempting SMTP_SSL fallback on port 465...")
            with smtplib.SMTP_SSL(smtp_server, 465, timeout=10) as server:
                server.login(email_user, email_password)
                server.sendmail(email_user, [to_email], msg.as_string())
            logger.info("Fallback email notification sent successfully to %s", to_email)
            return {"status": "sent"}
        except Exception as fallback_err:
            logger.error("Fallback SMTP sending also failed: %s", fallback_err)
            return {"status": "failed", "error": str(e)}

def send_auto_responder_email(submission: ContactSubmission):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    email_user = os.getenv("EMAIL_USER", "").strip()
    email_password = os.getenv("EMAIL_PASSWORD", "").replace(" ", "").strip()

    if not email_user or not email_password:
        logger.warning("Auto-responder skipped: EMAIL_USER or EMAIL_PASSWORD not configured")
        return {"status": "skipped", "reason": "No credentials"}

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
        logger.info("Auto responder email sent to %s", submission.email)
        return {"status": "sent"}
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
        conn = get_db()
        cursor = conn.cursor()
        query = (
            "INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)"
            if USE_SQLITE else
            "INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent) VALUES (%s, %s, %s, %s, %s, %s)"
        )
        cursor.execute(
            query,
            (
                submission.name,
                submission.email,
                submission.subject,
                submission.message,
                request.client.host if request.client else None,
                request.headers.get("user-agent"),
            ),
        )
        conn.commit()
        submission_id = cursor.lastrowid
        cursor.close()
        conn.close()

        # Queue emails in background to return instant 200 response to client
        background_tasks.add_task(send_email_notification, submission)
        background_tasks.add_task(send_auto_responder_email, submission)

        return JSONResponse(
            status_code=200,
            content={
                "message": "Message sent successfully!",
                "id": submission_id,
                "email": {"status": "queued"},
            },
        )
    except Exception as e:
        logger.error("Failed to save contact submission: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to save message: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
