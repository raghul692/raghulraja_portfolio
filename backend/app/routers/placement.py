from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.placement_engine import get_placement_questions, evaluate_placement_response

router = APIRouter(tags=["Placement Preparation Coach"])

class EvaluateRequest(BaseModel):
    module_type: Optional[str] = "aptitude" # aptitude, grammar, gd, hr, tech
    module: Optional[str] = None
    question: Optional[str] = ""
    user_answer: Optional[str] = ""
    text: Optional[str] = None

class GrammarRequest(BaseModel):
    text: str

@router.get("/api/v1/placement/questions")
@router.get("/api/placement/questions")
def get_questions(module: str = "aptitude"):
    return get_placement_questions(module_type=module)

@router.post("/api/v1/placement/evaluate")
@router.post("/api/placement/evaluate")
@router.post("/api/v1/placement/practice")
@router.post("/api/placement/practice")
def evaluate_or_practice(req: EvaluateRequest):
    mod = req.module or req.module_type or "aptitude"
    ans = req.user_answer or req.text or ""
    if not ans:
        # Return questions for the module
        return get_placement_questions(module_type=mod)
    
    q = req.question or "Placement Question"
    return evaluate_placement_response(
        module_type=mod,
        question=q,
        user_answer=ans
    )



@router.post("/api/v1/placement/grammar")
@router.post("/api/placement/grammar")
def check_grammar(req: GrammarRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is required.")
    
    evaluation = evaluate_placement_response(
        module_type="grammar",
        question="Analyze the grammatical structure, active voice, and professional syntax of this sentence.",
        user_answer=req.text
    )
    
    # Return structure matching frontend expectations
    return {
        "correctedText": req.text,
        "feedback": evaluation.get("feedback", "Grammar analysis completed.")
    }

