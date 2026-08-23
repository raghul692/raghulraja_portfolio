from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ats_engine import analyze_resume

router = APIRouter(prefix="/api/v1/ats", tags=["ATS Resume Checker"])

class ATSAnalyzeTextRequest(BaseModel):
    resume_text: str
    target_role: str = "Full Stack Engineer"
    job_description: str = ""

@router.post("/analyze")
def analyze_resume_text(req: ATSAnalyzeTextRequest):
    if not req.resume_text or not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required.")
    
    result = analyze_resume(
        resume_text=req.resume_text,
        target_role=req.target_role,
        job_description=req.job_description
    )
    return result

@router.post("/upload")
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Full Stack Engineer"),
    job_description: str = Form("")
):
    content_bytes = await file.read()
    filename = file.filename.lower()

    resume_text = ""
    if filename.endswith(".pdf"):
        try:
            import io
            from pypdf import PdfReader
            pdf = PdfReader(io.BytesIO(content_bytes))
            resume_text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {e}")
    elif filename.endswith(".docx"):
        try:
            import io
            from docx import Document
            doc = Document(io.BytesIO(content_bytes))
            resume_text = "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse DOCX: {e}")
    else:
        try:
            resume_text = content_bytes.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=400, detail="Unsupported file format.")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file contained no extractable text.")

    result = analyze_resume(
        resume_text=resume_text,
        target_role=target_role,
        job_description=job_description
    )
    return result
