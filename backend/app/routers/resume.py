from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.resume_builder_engine import build_tailored_ats_resume, generate_docx_resume_bytes

router = APIRouter(tags=["ATS Resume Builder"])

class BuildResumeRequest(BaseModel):
    target_role: Optional[str] = "Full Stack AI Engineer"
    targetRole: Optional[str] = None
    target_company: Optional[str] = None
    job_description: Optional[str] = None

    def get_target_role(self) -> str:
        return self.target_role or self.targetRole or "Full Stack AI Engineer"

@router.post("/api/v1/resume/build")
@router.post("/api/resume/build")
@router.post("/api/resume-builder/generate")
def build_resume_json(req: BuildResumeRequest):
    role = req.get_target_role()
    resume_data = build_tailored_ats_resume(target_role=role)
    return resume_data

@router.post("/api/v1/resume/export/docx")
@router.post("/api/resume/export/docx")
def export_resume_docx(req: BuildResumeRequest):
    role = req.get_target_role()
    resume_data = build_tailored_ats_resume(target_role=role)
    docx_bytes = generate_docx_resume_bytes(resume_data)

    safe_role = role.replace(" ", "_").lower()
    filename = f"Raghul_Raja_M_{safe_role}_resume.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

