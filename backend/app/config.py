import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # Supabase REST & Direct PostgreSQL Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://brmafvpjvdgieelcgivi.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv(
        "SUPABASE_ANON_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybWFmdnBqdmRnaWVlbGNnaXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NjQ5NzEsImV4cCI6MjEwNDI0MDk3MX0.hxhV4CUDghIdX6aCcSPJ7RZKMj2q_Q8XEy0Ty_G99wg"
    )
    
    SUPABASE_DB_HOST: str = os.getenv("SUPABASE_DB_HOST", "db.brmafvpjvdgieelcgivi.supabase.co")
    SUPABASE_DB_USER: str = os.getenv("SUPABASE_DB_USER", "portfolio_app")
    SUPABASE_DB_PASSWORD: str = os.getenv("SUPABASE_DB_PASSWORD", "")
    SUPABASE_DB_NAME: str = os.getenv("SUPABASE_DB_NAME", "postgres")
    SUPABASE_DB_PORT: int = int(os.getenv("SUPABASE_DB_PORT", "5432"))

    # Production unified DATABASE_URL (for Render / Supabase)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{os.getenv('SUPABASE_DB_USER', 'portfolio_app')}:{os.getenv('SUPABASE_DB_PASSWORD', '')}@{os.getenv('SUPABASE_DB_HOST', 'db.brmafvpjvdgieelcgivi.supabase.co')}:{os.getenv('SUPABASE_DB_PORT', '5432')}/{os.getenv('SUPABASE_DB_NAME', 'postgres')}"
    )

    # Gemini AI Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # GitHub Webhook Secret
    GITHUB_WEBHOOK_SECRET: str = os.getenv("GITHUB_WEBHOOK_SECRET", "portfolio_ai_secret_key")

    # API Settings
    PROJECT_NAME: str = "Portfolio AI System API"
    VERSION: str = "1.0.0"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]

settings = Settings()
