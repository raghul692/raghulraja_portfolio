import json
import io
import logging
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from app.services.llm_provider import generate_ai_response

logger = logging.getLogger("portfolio_ai_resume_builder")

RESUME_BASE_FACTS = {
    "name": "Raghul Raja M",
    "title": "AI/ML Engineer & Full-Stack Developer",
    "contact": {
        "email": "raghulraja2006@gmail.com",
        "phone": "+91 9876543210",
        "location": "Tamil Nadu, India",
        "linkedin": "linkedin.com/in/raghulrajam",
        "github": "github.com/raghulrajam"
    },
    "education": [
        {
            "degree": "Bachelor of Engineering in Computer Science & Engineering",
            "institution": "Anna University / Technical Institute",
            "duration": "2022 - 2026",
            "cgpa": "8.8/10"
        }
    ],
    "skills": {
        "AI / RAG": ["Google Gemini API", "PyTorch", "OpenCV", "pgvector", "RAG Systems", "NLP", "LangChain"],
        "Languages": ["Python", "TypeScript", "JavaScript", "SQL", "C++", "HTML5", "CSS3"],
        "Frontend": ["React 19", "Vite", "Tailwind CSS", "Redux", "Framer Motion", "Three.js"],
        "Backend & DB": ["FastAPI", "Node.js", "Express", "PostgreSQL", "Supabase", "MySQL", "SQLite", "REST APIs"],
        "Tools & DevOps": ["Git", "GitHub", "Docker", "VS Code", "Postman", "Vercel"]
    },
    "projects": [
        {
            "title": "Wolf Sec 2X — AI Security Intelligence Platform",
            "tech": "Python, FastAPI, React, PyTorch, Supabase",
            "bullets": [
                "Architected multi-agent AI security system executing automated vulnerability scanning and threat detection.",
                "Integrated custom deep learning models achieving 94.2% accuracy in malware anomaly classification.",
                "Engineered high-throughput FastAPI backend handling over 500+ requests/sec with low-latency WebSocket alerts."
            ]
        },
        {
            "title": "Healthcare Management & Diagnostic AI Assistant",
            "tech": "React, TypeScript, FastAPI, PostgreSQL, RAG",
            "bullets": [
                "Built healthcare management hub with patient records, doctor scheduling, and OCR medical report parsing.",
                "Implemented non-diagnostic safety-compliant RAG chatbot providing evidence-grounded health guidance.",
                "Designed responsive dark-mode dashboard adhering to modern UI/UX design tokens."
            ]
        },
        {
            "title": "Aether Weather Telemetry Platform",
            "tech": "React 19, TypeScript, WeatherAPI, Tailwind CSS",
            "bullets": [
                "Developed real-time weather analytics suite with dynamic location auto-complete and multi-city forecasting.",
                "Optimized state management reducing render overhead by 40% across responsive viewports."
            ]
        }
    ]
}


def build_tailored_ats_resume(target_role: str = "Full Stack AI Engineer") -> dict:
    """Generates an IEEE ATS-compliant structured resume tailored for the specified target role."""
    
    prompt = f"""Target Role: {target_role}

Base Candidate Information:
Name: {RESUME_BASE_FACTS['name']}
Current Title: {RESUME_BASE_FACTS['title']}
Skills: {json.dumps(RESUME_BASE_FACTS['skills'])}
Projects: {json.dumps(RESUME_BASE_FACTS['projects'])}

Instruction: Reframe and optimize the Professional Summary and Bullet Points specifically for the target role: "{target_role}".
Make bullet points strong, action-verb driven, and ATS keyword dense.
Return ONLY valid JSON matching this structure:
{{
  "summary": "2-3 sentence tailored executive summary",
  "tailored_bullets": {{
    "Wolf Sec 2X": ["bullet 1", "bullet 2"],
    "Healthcare AI Assistant": ["bullet 1", "bullet 2"],
    "Aether Weather Platform": ["bullet 1", "bullet 2"]
  }}
}}"""

    try:
        raw_json_str = generate_ai_response(prompt=prompt, system_instruction="You are a professional resume writer specializing in ATS tech resume optimization. Return strictly raw JSON.")
        
        # Parse JSON
        cleaned_json = raw_json_str.strip()
        if "```json" in cleaned_json:
            cleaned_json = cleaned_json.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned_json:
            cleaned_json = cleaned_json.split("```")[1].split("```")[0].strip()

        parsed_tailoring = json.loads(cleaned_json)
        summary = parsed_tailoring.get("summary", f"Accomplished {target_role} with strong expertise in building scalable web applications, RAG intelligence suites, and high-performance cloud backends.")
        tailored_bullets = parsed_tailoring.get("tailored_bullets", {})
    except Exception as e:
        logger.warning(f"Resume LLM tailoring error: {e}. Using deterministic facts.")
        summary = f"Results-driven {target_role} specializing in full-stack web applications, AI/ML models, RAG pipelines, and cloud backend architectures."
        tailored_bullets = {}

    # Build final resume JSON structure
    projects_list = []
    for proj in RESUME_BASE_FACTS["projects"]:
        title_key = proj["title"].split("—")[0].strip()
        bullets = tailored_bullets.get(title_key, proj["bullets"])
        projects_list.append({
            "title": proj["title"],
            "tech": proj["tech"],
            "bullets": bullets
        })

    resume_data = {
        "name": RESUME_BASE_FACTS["name"],
        "title": f"{RESUME_BASE_FACTS['name']} — {target_role}",
        "target_role": target_role,
        "contact": RESUME_BASE_FACTS["contact"],
        "summary": summary,
        "education": RESUME_BASE_FACTS["education"],
        "skills": RESUME_BASE_FACTS["skills"],
        "projects": projects_list
    }

    return resume_data


def generate_docx_resume_bytes(resume_data: dict) -> bytes:
    """Generates a clean DOCX document bytes stream for downloading."""
    doc = Document()

    # Document Title / Header
    name_heading = doc.add_heading(resume_data["name"], level=0)
    name_heading.style.font.color.rgb = RGBColor(15, 23, 42)
    name_heading.style.font.name = 'Arial'

    contact_info = f"{resume_data['contact']['email']} | {resume_data['contact']['phone']} | {resume_data['contact']['location']} | {resume_data['contact']['linkedin']}"
    p_contact = doc.add_paragraph(contact_info)
    p_contact.style.font.size = Pt(9.5)

    doc.add_heading("PROFESSIONAL SUMMARY", level=1)
    doc.add_paragraph(resume_data["summary"])

    doc.add_heading("TECHNICAL SKILLS", level=1)
    for cat, skills in resume_data["skills"].items():
        p = doc.add_paragraph()
        runner = p.add_run(f"• {cat}: ")
        runner.bold = True
        p.add_run(", ".join(skills))

    doc.add_heading("KEY PROJECTS", level=1)
    for proj in resume_data["projects"]:
        p = doc.add_paragraph()
        title_run = p.add_run(proj["title"])
        title_run.bold = True
        p.add_run(f" [{proj['tech']}]")
        for b in proj["bullets"]:
            bp = doc.add_paragraph(f"  - {b}", style='List Bullet')

    doc.add_heading("EDUCATION", level=1)
    for edu in resume_data["education"]:
        doc.add_paragraph(f"{edu['degree']} — {edu['institution']} ({edu['duration']}) — CGPA: {edu['cgpa']}")

    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)
    return file_stream.getvalue()
