from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.placement_engine import get_placement_questions, evaluate_placement_response

router = APIRouter(prefix="/api/v1/placement", tags=["Placement Preparation Coach"])

class EvaluateRequest(BaseModel):
    module_type: str = "aptitude" # aptitude, grammar, gd, hr, tech
    question: str
    user_answer: str

@router.get("/questions")
def get_questions(module: str = "aptitude"):
    return get_placement_questions(module_type=module)

@router.post("/evaluate")
def evaluate_answer(req: EvaluateRequest):
    if not req.question or not req.user_answer:
        raise HTTPException(status_code=400, detail="Question and user answer are required.")
    
    return evaluate_placement_response(
        module_type=req.module_type,
        question=req.question,
        user_answer=req.user_answer
    )
