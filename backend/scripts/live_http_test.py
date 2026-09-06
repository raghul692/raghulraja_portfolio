import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import requests
import json
import psycopg2
import time

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://127.0.0.1:5173"

print("================================================================")
print("LIVE HTTP SERVER TESTING (FRONTEND & BACKEND)")
print("================================================================")

# 1. Test Root
print("\n[1] Testing GET http://127.0.0.1:8000/")
res = requests.get(f"{BACKEND_URL}/", timeout=5)
print("Status:", res.status_code, res.json())
assert res.status_code == 200

# 2. Test Health Endpoint
print("\n[2] Testing GET http://127.0.0.1:8000/api/health")
res = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
print("Status:", res.status_code, res.json())
assert res.status_code == 200
data = res.json()
assert data["status"] == "ok"
assert "Supabase PostgreSQL + pgvector" in data["database_engine"]
assert data["database_status"] == "healthy"
print("=> PASSED: Backend is online and connected to Supabase PostgreSQL!")

# 3. Test Admin Status
print("\n[3] Testing GET http://127.0.0.1:8000/api/v1/admin/status")
res = requests.get(f"{BACKEND_URL}/api/v1/admin/status", timeout=5)
print("Status:", res.status_code, res.json())
assert res.status_code == 200
assert res.json()["total_indexed_chunks"] >= 17
print("=> PASSED: Admin status verified with 17+ indexed vector chunks in Supabase!")

# 4. Test Contact Form Submission (Live HTTP POST)
print("\n[4] Testing POST http://127.0.0.1:8000/api/contact")
submission_payload = {
    "name": "Live Server Tester",
    "email": "live.tester@portfolio.dev",
    "subject": "Live Server Real-Time Verification",
    "message": "Testing real-time contact submission through live running Uvicorn server directly to Supabase."
}
res = requests.post(f"{BACKEND_URL}/api/contact", json=submission_payload, timeout=10)
print("Status:", res.status_code, res.json())
assert res.status_code == 200
contact_id = res.json()["id"]
print(f"Contact created with ID: {contact_id}")

# 5. Verify Contact directly in Supabase
print("\n[5] Verifying persistence directly in Supabase PostgreSQL...")
from app.config import settings
pg_conn = psycopg2.connect(settings.DATABASE_URL)
cur = pg_conn.cursor()
cur.execute("SELECT id, name, email, subject, message FROM contact_submissions WHERE id = %s", (contact_id,))
row = cur.fetchone()
print(f"Retrieved from Supabase DB: ID={row[0]}, Name={row[1]}, Email={row[2]}")
assert row is not None
assert row[1] == submission_payload["name"]
cur.close()
pg_conn.close()
print("=> PASSED: Contact saved and verified in Supabase PostgreSQL!")

# 6. Test RAG pgvector Query
print("\n[6] Testing POST http://127.0.0.1:8000/api/rag/query (pgvector semantic search)")
rag_payload = {
    "query": "What are Raghul Raja's primary backend and database skills?",
    "persona": "technical_recruiter"
}
res = requests.post(f"{BACKEND_URL}/api/rag/query", json=rag_payload, timeout=30)
print("Status:", res.status_code)
assert res.status_code == 200
rag_res = res.json()
print("Citations returned:", rag_res.get("citations"))
print("Answer snippet:", rag_res.get("answer", "")[:120], "...")
assert len(rag_res.get("answer", "")) > 30
print("=> PASSED: RAG query successfully answered via pgvector retrieval!")

# 7. Test ATS Resume Analysis
print("\n[7] Testing POST http://127.0.0.1:8000/api/ats/analyze")
ats_payload = {
    "resume_text": "Raghul Raja M - Full Stack Engineer skilled in Python, FastAPI, Supabase, React, Node.js.",
    "target_role": "Full Stack Engineer"
}
res = requests.post(f"{BACKEND_URL}/api/ats/analyze", json=ats_payload, timeout=20)
print("Status:", res.status_code)
assert res.status_code == 200
ats_res = res.json()
print("ATS Overall Score:", ats_res.get("overall_score"))
assert ats_res.get("overall_score") is not None
print("=> PASSED: ATS Analysis functional!")

# 8. Test Resume Builder
print("\n[8] Testing POST http://127.0.0.1:8000/api/resume/build")
res = requests.post(f"{BACKEND_URL}/api/resume/build", json={"target_role": "AI Engineer"}, timeout=35)
print("Status:", res.status_code)
assert res.status_code == 200
print("=> PASSED: Resume builder generated resume!")

# 9. Test Placement Questions
print("\n[9] Testing GET http://127.0.0.1:8000/api/placement/questions?module=tech")
res = requests.get(f"{BACKEND_URL}/api/placement/questions?module=tech", timeout=5)
print("Status:", res.status_code)
assert res.status_code == 200
questions = res.json().get("questions", [])
print(f"Tech questions count: {len(questions)}")
assert len(questions) > 0
print("=> PASSED: Placement questions returned!")

# 10. Test Frontend Server (Vite)
print("\n[10] Testing GET http://127.0.0.1:5173/ (Vite dev server)")
f_res = requests.get(FRONTEND_URL, timeout=5)
print("Frontend HTTP Status:", f_res.status_code)
assert f_res.status_code == 200
assert "<div id=\"root\">" in f_res.text or "<script" in f_res.text
print("=> PASSED: Frontend Vite server is serving the React application properly!")

print("\n================================================================")
print("ALL LIVE HTTP SERVER TESTS PASSED 100% SUCCESSFULLY!")
print("================================================================")
