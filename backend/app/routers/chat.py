from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.services.rag_engine import answer_portfolio_query
from app.limiter import limiter

router = APIRouter(tags=["Portfolio Chat RAG"])

class ChatRequest(BaseModel):
    query: Optional[str] = None
    message: Optional[str] = None
    persona: str = "default"  # default, technical_recruiter, engineering_manager, hr_recruiter, general

@router.post("/api/rag/query")
@router.post("/api/v1/chat")
@limiter.limit("15/minute")
def chat_with_portfolio_ai(request: Request, req: ChatRequest):
    user_query = req.query or req.message or ""
    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Query or message cannot be empty.")
    
    result = answer_portfolio_query(query=user_query, persona=req.persona)
    return result

