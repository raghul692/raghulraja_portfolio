import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
import psycopg2
import pgvector.psycopg2
from main import app
from app.config import settings

print("================================================================")
print("RUNNING COMPREHENSIVE LOCAL INTEGRATION TEST SUITE")
print("================================================================")

client = TestClient(app)

# 1. Test Application Startup & Health
print("\n[TEST 1] Testing /api/health endpoint...")
health_res = client.get("/api/health")
print("Health response:", health_res.status_code, health_res.json())
assert health_res.status_code == 200, f"Health check failed: {health_res.text}"
health_data = health_res.json()
assert health_data["status"] == "ok"
assert "Supabase PostgreSQL + pgvector" in health_data["database_engine"]
assert health_data["database_status"] == "healthy"
print("  => PASSED: Health endpoint verified healthy!")

# 2. Test Admin Status
print("\n[TEST 2] Testing /api/v1/admin/status endpoint...")
admin_res = client.get("/api/v1/admin/status")
print("Admin status:", admin_res.status_code, admin_res.json())
assert admin_res.status_code == 200
admin_data = admin_res.json()
assert admin_data["total_indexed_chunks"] >= 17
print("  => PASSED: Admin status verified with indexed chunks!")

# 3. Test Contact Form Validation & Error Handling
print("\n[TEST 3] Testing Contact Form Validation & Error Handling...")
# Missing fields
bad_res_1 = client.post("/api/contact", json={"name": "", "email": "", "message": ""})
assert bad_res_1.status_code == 400
# Invalid email
bad_res_2 = client.post("/api/contact", json={"name": "Test", "email": "not-an-email", "message": "Valid message longer than 20 chars."})
assert bad_res_2.status_code == 400
# Message too short
bad_res_3 = client.post("/api/contact", json={"name": "Test", "email": "test@example.com", "message": "Too short"})
assert bad_res_3.status_code == 400
print("  => PASSED: Contact form validations strictly reject invalid payloads!")

# 4. Test Contact Submission & Data Insertion into Supabase
print("\n[TEST 4] Testing Contact Submission Insertion into Supabase...")
test_contact_payload = {
    "name": "Integration Test Runner",
    "email": "integration.test@portfolio.dev",
    "subject": "Unified Supabase Migration Verification",
    "message": "This is a real-time integration test verifying that submissions are stored directly in Supabase PostgreSQL."
}
contact_res = client.post("/api/contact", json=test_contact_payload)
print("Contact response:", contact_res.status_code, contact_res.json())
assert contact_res.status_code == 200
contact_data = contact_res.json()
new_id = contact_data["id"]
assert new_id is not None and new_id > 15
print(f"Contact created with ID: {new_id}")

# Verify data directly in Supabase PostgreSQL
print("\n[TEST 5] Verifying Contact Record directly in Supabase PostgreSQL...")
pg_conn = psycopg2.connect(settings.DATABASE_URL)
cur = pg_conn.cursor()
cur.execute("SELECT id, name, email, subject, message, status FROM contact_submissions WHERE id = %s", (new_id,))
inserted_row = cur.fetchone()
print(f"Retrieved row from Supabase: ID={inserted_row[0]}, Name={inserted_row[1]}, Email={inserted_row[2]}")
assert inserted_row is not None
assert inserted_row[1] == test_contact_payload["name"]
assert inserted_row[2] == test_contact_payload["email"]
assert inserted_row[3] == test_contact_payload["subject"]
assert inserted_row[4] == test_contact_payload["message"]
cur.close()
pg_conn.close()
print("  => PASSED: Contact data successfully persisted and retrieved from Supabase!")

# 6. Test RAG / Vector Query via pgvector
print("\n[TEST 6] Testing RAG Query with pgvector search (/api/rag/query)...")
rag_res = client.post("/api/rag/query", json={
    "query": "Tell me about Raghul Raja's projects and skills in AI and Full Stack development.",
    "persona": "technical_recruiter"
})
print("RAG status:", rag_res.status_code)
assert rag_res.status_code == 200
rag_data = rag_res.json()
print("RAG citations:", rag_data.get("citations"))
print("RAG answer snippet:", rag_data.get("answer", "")[:150], "...")
assert rag_data.get("context_chunks_count", 0) > 0
assert len(rag_data.get("answer", "")) > 50
print("  => PASSED: RAG engine retrieved relevant chunks and produced grounded answer!")

# 7. Test ATS Resume Checker (/api/ats/analyze)
print("\n[TEST 7] Testing ATS Resume Checker (/api/ats/analyze)...")
ats_res = client.post("/api/ats/analyze", json={
    "resume_text": """
    Raghul Raja M
    Email: raghulraja2006@gmail.com
    Full Stack & AI Engineer
    Skills: Python, FastAPI, React, TypeScript, PostgreSQL, Docker, Gemini AI, Machine Learning.
    Projects: CareerConnectPro - Job Portal with React and Node.js.
    Experience: Generative AI Intern at EBPL.
    """,
    "target_role": "Full Stack AI Engineer"
})
print("ATS response status:", ats_res.status_code)
assert ats_res.status_code == 200
ats_data = ats_res.json()
print("ATS overall score:", ats_data.get("overall_score"))
assert ats_data.get("overall_score") is not None
assert "category_scores" in ats_data
print("  => PASSED: ATS Resume Checker functional!")

# 8. Test Resume Builder (/api/resume/build)
print("\n[TEST 8] Testing Resume Builder (/api/resume/build)...")
resume_res = client.post("/api/resume/build", json={
    "target_role": "Full Stack AI Engineer"
})
print("Resume builder status:", resume_res.status_code)
assert resume_res.status_code == 200
resume_data = resume_res.json()
assert "name" in resume_data or "personal_info" in resume_data or "skills" in resume_data
print("  => PASSED: Resume Builder generated tailored resume payload!")

# 9. Test Placement Preparation (/api/placement/questions & /api/placement/evaluate)
print("\n[TEST 9] Testing Placement Preparation...")
placement_q_res = client.get("/api/placement/questions?module=aptitude")
assert placement_q_res.status_code == 200
print("Placement questions count:", len(placement_q_res.json().get("questions", [])))

eval_res = client.post("/api/placement/evaluate", json={
    "module_type": "tech",
    "question": "Explain the difference between SQL and NoSQL databases.",
    "user_answer": "SQL databases are relational and table-based with strict schemas, while NoSQL databases are non-relational and document/key-value based."
})
assert eval_res.status_code == 200
print("Placement evaluation feedback received successfully.")
print("  => PASSED: Placement module operational!")

# 10. Test CORS headers
print("\n[TEST 10] Testing CORS configuration...")
cors_res = client.options("/api/health", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "GET"})
assert "access-control-allow-origin" in cors_res.headers
print("CORS header:", cors_res.headers.get("access-control-allow-origin"))
print("  => PASSED: CORS configuration verified!")

print("\n================================================================")
print("ALL 10 ARCHITECTURE INTEGRATION TESTS PASSED 100% SUCCESSFULLY!")
print("================================================================")
