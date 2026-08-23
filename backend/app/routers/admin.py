from fastapi import APIRouter
from app.db import get_all_chunks

router = APIRouter(prefix="/api/v1/admin", tags=["Admin System Control"])

@router.get("/status")
def system_status():
    chunks = get_all_chunks()
    return {
        "status": "online",
        "system": "Portfolio AI Intelligence Suite",
        "total_indexed_chunks": len(chunks),
        "database": "Supabase PostgreSQL + pgvector (Hybrid FTS + Vector)"
    }
