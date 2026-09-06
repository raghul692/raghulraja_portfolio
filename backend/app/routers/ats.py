from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ats_engine import analyze_resume

router = APIRouter(tags=["ATS Resume Checker"])

class ATSAnalyzeTextRequest(BaseModel):
    resume_text: Optional[str] = None
    resumeText: Optional[str] = None
    target_role: Optional[str] = "Full Stack Engineer"
    targetRole: Optional[str] = None
    job_description: Optional[str] = ""
    jdText: Optional[str] = None

    def get_resume_text(self) -> str:
        return (self.resume_text or self.resumeText or "").strip()

    def get_target_role(self) -> str:
        return self.target_role or self.targetRole or "Full Stack Engineer"

    def get_job_description(self) -> str:
        return self.job_description or self.jdText or ""

@router.post("/api/v1/ats/analyze")
@router.post("/api/ats/analyze")
def analyze_resume_text(req: ATSAnalyzeTextRequest):
    resume_text = req.get_resume_text()
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required.")
    
    result = analyze_resume(
        resume_text=resume_text,
        target_role=req.get_target_role(),
        job_description=req.get_job_description()
    )
    return result

@router.post("/api/v1/ats/upload")
@router.post("/api/ats/upload")
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

