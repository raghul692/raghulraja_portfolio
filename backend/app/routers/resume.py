from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from app.services.resume_builder_engine import build_tailored_ats_resume, generate_docx_resume_bytes

router = APIRouter(prefix="/api/v1/resume", tags=["ATS Resume Builder"])

class BuildResumeRequest(BaseModel):
    target_role: str = "Full Stack AI Engineer"

@router.post("/build")
def build_resume_json(req: BuildResumeRequest):
    resume_data = build_tailored_ats_resume(target_role=req.target_role)
    return resume_data

@router.post("/export/docx")
def export_resume_docx(req: BuildResumeRequest):
    resume_data = build_tailored_ats_resume(target_role=req.target_role)
    docx_bytes = generate_docx_resume_bytes(resume_data)

    safe_role = req.target_role.replace(" ", "_").lower()
    filename = f"Raghul_Raja_M_{safe_role}_resume.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
