import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # Supabase REST API Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://arsvfzmlotzbkgfxjirn.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyc3Zmem1sb3R6YmtnZnhqaXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NDEzMzAsImV4cCI6MjEwMzAxNzMzMH0.zXYXZOVan5OyPMJxJFMWJ4XyzG-x-GIq9OMRan18Rms")
    
    # Supabase Direct DB Settings
    SUPABASE_DB_HOST: str = os.getenv("SUPABASE_DB_HOST", "db.arsvfzmlotzbkgfxjirn.supabase.co")
    SUPABASE_DB_USER: str = os.getenv("SUPABASE_DB_USER", "postgres")
    SUPABASE_DB_PASSWORD: str = os.getenv("SUPABASE_DB_PASSWORD", "Ragul2006#@")
    SUPABASE_DB_NAME: str = os.getenv("SUPABASE_DB_NAME", "postgres")

    # Gemini AI Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # GitHub Webhook Secret
    GITHUB_WEBHOOK_SECRET: str = os.getenv("GITHUB_WEBHOOK_SECRET", "portfolio_ai_secret_key")

    # Local SQLite Fallback DB Path
    LOCAL_DB_PATH: str = os.getenv("LOCAL_DB_PATH", "portfolio_ai.db")

    # API Settings
    PROJECT_NAME: str = "Portfolio AI System API"
    VERSION: str = "1.0.0"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]

settings = Settings()
