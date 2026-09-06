import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import time
from fastapi.testclient import TestClient
from backend.main import app


client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("[START] STARTING PORTFOLIO API ENDPOINT INTEGRATION TESTS")
    print("=" * 60)
    
    # 1. Test Root & Health
    t0 = time.time()
    res = client.get("/")
    print(f"\n[1] GET / -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    print(f"    Response: {res.json()}")

    t0 = time.time()
    res = client.get("/api/health")
    print(f"\n[2] GET /api/health -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    print(f"    System Health: {res.json().get('status')} | DB: {res.json().get('database_engine')}")

    # 2. Test ATS Analyze with frontend camelCase format
    sample_resume = (
        "Raghul Raja M. Full Stack AI Developer. "
        "Skills: React, TypeScript, Python, FastAPI, Node.js, Tailwind CSS, PostgreSQL, Docker, Git. "
        "Experience: TVK Technologies Intern, developed Multi-Disease Prediction System using Machine Learning and Scikit-Learn. "
        "Education: SKP Engineering College, B.E Computer Science, CGPA 8.2."
    )
    sample_jd = "Looking for a Full Stack Developer skilled in React, TypeScript, Python, FastAPI, and Git."

    t0 = time.time()
    res = client.post("/api/ats/analyze", json={
        "resumeText": sample_resume,
        "jdText": sample_jd
    })
    print(f"\n[3] POST /api/ats/analyze (Frontend camelCase) -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    ats_data = res.json()
    print(f"    Overall ATS Score: {ats_data.get('overall_score')}%")
    print(f"    Matched Keywords: {ats_data.get('matched_keywords')[:5]}")
    print(f"    Recommendations count: {len(ats_data.get('actionable_recommendations', []))}")

    # 3. Test ATS Analyze with v1 snake_case format
    t0 = time.time()
    res = client.post("/api/v1/ats/analyze", json={
        "resume_text": sample_resume,
        "target_role": "Full Stack AI Engineer",
        "job_description": sample_jd
    })
    print(f"\n[4] POST /api/v1/ats/analyze (Standard snake_case) -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    print(f"    Success: {res.json().get('overall_score')}% match")

    # 4. Test Resume Builder
    t0 = time.time()
    res = client.post("/api/resume-builder/generate", json={
        "target_role": "Full Stack AI Engineer"
    })
    print(f"\n[5] POST /api/resume-builder/generate -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    resume_data = res.json()
    print(f"    Generated Resume Role: {resume_data.get('target_role')}")
    print(f"    ATS Readiness: {resume_data.get('ats_readiness')}")

    # 5. Test Placement Grammar
    t0 = time.time()
    res = client.post("/api/placement/grammar", json={
        "text": "I has builded the web application using React and FastAPI."
    })
    print(f"\n[6] POST /api/placement/grammar -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    print(f"    Grammar Feedback: {res.json().get('feedback')[:100]}...")

    # 6. Test Placement Practice
    t0 = time.time()
    res = client.post("/api/placement/practice", json={
        "module": "aptitude"
    })
    print(f"\n[7] POST /api/placement/practice -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    questions = res.json()
    print(f"    Retrieved {len(questions)} aptitude practice questions.")

    # 7. Test GitHub Stats
    t0 = time.time()
    res = client.get("/api/v1/github/stats")
    print(f"\n[8] GET /api/v1/github/stats -> Status: {res.status_code} ({round((time.time() - t0)*1000, 2)}ms)")
    assert res.status_code == 200, f"Failed: {res.text}"
    gh = res.json()
    print(f"    GitHub User: {gh.get('username')} ({gh.get('name')}) | Repos: {gh.get('public_repos')}")

    print("\n" + "=" * 60)
    print("[SUCCESS] ALL 8 TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
