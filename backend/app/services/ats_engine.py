import re
import logging
from app.services.llm_provider import generate_ai_response

logger = logging.getLogger("portfolio_ai_ats")

CORE_TECH_KEYWORDS = [
    "react", "typescript", "javascript", "python", "fastapi", "node.js", "express",
    "postgresql", "supabase", "mysql", "mongodb", "redis", "tailwind css", "html5",
    "css3", "git", "github", "docker", "aws", "gcp", "rest api", "graphql", "rag",
    "llm", "vector database", "pgvector", "machine learning", "deep learning", "nlp",
    "ci/cd", "unit testing", "jest", "pytest", "agile", "scrum", "system design"
]

REQUIRED_SECTIONS = [
    "summary", "experience", "projects", "skills", "education", "certifications", "contact"
]

def analyze_resume(resume_text: str, target_role: str = "Full Stack Engineer", job_description: str = "") -> dict:
    """Performs deterministic and LLM-enhanced ATS resume analysis."""
    text_lower = resume_text.lower()
    jd_lower = job_description.lower() if job_description else ""

    # 1. Deterministic Section Detection
    detected_sections = []
    missing_sections = []
    for section in REQUIRED_SECTIONS:
        if section in text_lower or (section == "summary" and ("profile" in text_lower or "about" in text_lower)):
            detected_sections.append(section.capitalize())
        else:
            missing_sections.append(section.capitalize())

    section_score = (len(detected_sections) / len(REQUIRED_SECTIONS)) * 100.0

    # 2. Keyword Overlap Analysis
    found_keywords = [kw for kw in CORE_TECH_KEYWORDS if kw in text_lower]
    
    # If JD is provided, extract custom keywords from JD
    if jd_lower:
        jd_keywords = [kw for kw in CORE_TECH_KEYWORDS if kw in jd_lower]
        target_keywords = list(set(jd_keywords if jd_keywords else CORE_TECH_KEYWORDS))
    else:
        target_keywords = CORE_TECH_KEYWORDS

    matched_keywords = [kw for kw in target_keywords if kw in text_lower]
    missing_keywords = [kw for kw in target_keywords if kw not in text_lower]
    keyword_score = (len(matched_keywords) / max(len(target_keywords), 1)) * 100.0

    # 3. Formatting & Impact Metrics Detection (regex numbers/percentages)
    has_metrics = bool(re.search(r'\d+%\s*|\$\d+|\d+\s*users|\d+\s*ms|\d+\s*x', resume_text, re.IGNORECASE))
    impact_score = 90.0 if has_metrics else 55.0

    # 4. Overall Weighted ATS Score calculation
    overall_score = round(
        (0.40 * keyword_score) + 
        (0.25 * section_score) + 
        (0.20 * impact_score) + 
        (0.15 * 85.0), # Format & readability baseline
        1
    )
    overall_score = min(max(overall_score, 40.0), 98.0)

    # 5. LLM Recommendations Synthesis
    prompt = f"""Target Role: {target_role}
ATS Score: {overall_score}/100
Missing Sections: {', '.join(missing_sections) if missing_sections else 'None'}
Missing Keywords: {', '.join(missing_keywords[:10])}

Resume Text:
{resume_text[:1500]}

Instruction: Provide 3 actionable, high-impact bullet recommendations to optimize this resume for ATS screening and target role alignment."""

    ai_feedback = generate_ai_response(
        prompt=prompt,
        system_instruction="You are an expert ATS Optimization Officer & Senior Executive Resume Coach."
    )

    recommendations = [rec.strip() for rec in ai_feedback.split("\n") if rec.strip() and not rec.startswith("#")]
    if not recommendations:
        recommendations = [
            f"Add quantified metrics (e.g. 'Improved speed by 35%') to bullet points under experience.",
            f"Integrate key tech terms: {', '.join(missing_keywords[:4])} into relevant project descriptions.",
            "Ensure standard IEEE headings (Summary, Skills, Projects, Experience, Education) for maximum ATS parser parsing accuracy."
        ]

    return {
        "target_role": target_role,
        "overall_score": overall_score,
        "category_scores": {
            "keyword_match": round(keyword_score, 1),
            "section_structure": round(section_score, 1),
            "impact_metrics": round(impact_score, 1),
            "format_readability": 85.0
        },
        "detected_sections": detected_sections,
        "missing_sections": missing_sections,
        "matched_keywords": matched_keywords[:15],
        "missing_keywords": missing_keywords[:10],
        "actionable_recommendations": recommendations[:5],
        "raw_summary": ai_feedback
    }
