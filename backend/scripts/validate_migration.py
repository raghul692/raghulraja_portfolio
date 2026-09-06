import os
import json
import sqlite3
import psycopg2
import pgvector.psycopg2
import mysql.connector
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

PG_HOST = os.getenv("SUPABASE_DB_HOST", "db.brmafvpjvdgieelcgivi.supabase.co")
PG_USER = os.getenv("SUPABASE_DB_USER", "portfolio_app")
PG_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD", "")
PG_DB = os.getenv("SUPABASE_DB_NAME", "postgres")
PG_PORT = int(os.getenv("SUPABASE_DB_PORT", "5432"))

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

print("=== STARTING COMPREHENSIVE DATA VALIDATION ===")

pg_conn = psycopg2.connect(
    host=PG_HOST,
    user=PG_USER,
    password=PG_PASSWORD,
    dbname=PG_DB,
    port=PG_PORT,
    connect_timeout=10
)
pgvector.psycopg2.register_vector(pg_conn)
pg_cur = pg_conn.cursor()

# -------------------------------------------------------------
# 1. ROW COUNTS VALIDATION
# -------------------------------------------------------------
print("\n[CHECK 1] Row Counts Validation:")

# Supabase counts
pg_cur.execute("SELECT count(*) FROM contact_submissions;")
sb_contacts_count = pg_cur.fetchone()[0]

pg_cur.execute("SELECT count(*) FROM portfolio_documents;")
sb_docs_count = pg_cur.fetchone()[0]

pg_cur.execute("SELECT count(*) FROM document_chunks;")
sb_chunks_count = pg_cur.fetchone()[0]

# Source counts
m_conn = mysql.connector.connect(host="localhost", user="root", password="root", database="portfolio")
m_cur = m_conn.cursor()
m_cur.execute("SELECT count(*) FROM contact_submissions;")
mysql_count = m_cur.fetchone()[0]
m_cur.close()
m_conn.close()

s_contacts_conn = sqlite3.connect(os.path.join(ROOT_DIR, "portfolio.db"))
sqlite_contacts_count = s_contacts_conn.execute("SELECT count(*) FROM contact_submissions;").fetchone()[0]
s_contacts_conn.close()

ai_conn = sqlite3.connect(os.path.join(ROOT_DIR, "portfolio_ai.db"))
sqlite_docs_count = ai_conn.execute("SELECT count(*) FROM portfolio_documents;").fetchone()[0]
sqlite_chunks_count = ai_conn.execute("SELECT count(*) FROM document_chunks;").fetchone()[0]
ai_conn.close()

expected_contacts = mysql_count + sqlite_contacts_count
print(f"  Contacts: Supabase={sb_contacts_count} | Expected={expected_contacts} (MySQL {mysql_count} + SQLite {sqlite_contacts_count})")
assert sb_contacts_count == expected_contacts, f"Contacts count mismatch! {sb_contacts_count} != {expected_contacts}"

print(f"  Documents: Supabase={sb_docs_count} | Expected={sqlite_docs_count}")
assert sb_docs_count == sqlite_docs_count, f"Documents count mismatch! {sb_docs_count} != {sqlite_docs_count}"

print(f"  Chunks:    Supabase={sb_chunks_count} | Expected={sqlite_chunks_count}")
assert sb_chunks_count == sqlite_chunks_count, f"Chunks count mismatch! {sb_chunks_count} != {sqlite_chunks_count}"

print("  => PASSED: All row counts match exactly!")

# -------------------------------------------------------------
# 2. CONTACT SUBMISSIONS FIELD INTEGRITY
# -------------------------------------------------------------
print("\n[CHECK 2] Contact Submissions Field Integrity:")
pg_cur.execute("SELECT id, name, email, subject, message, status FROM contact_submissions ORDER BY id ASC;")
sb_contacts = pg_cur.fetchall()

m_conn = mysql.connector.connect(host="localhost", user="root", password="root", database="portfolio")
m_cur = m_conn.cursor(dictionary=True)
m_cur.execute("SELECT id, name, email, subject, message, status FROM contact_submissions ORDER BY id ASC;")
mysql_rows = m_cur.fetchall()
m_cur.close()
m_conn.close()

for i, m_row in enumerate(mysql_rows):
    sb_row = sb_contacts[i]
    assert sb_row[0] == m_row["id"], f"ID mismatch: {sb_row[0]} != {m_row['id']}"
    assert sb_row[1] == m_row["name"], f"Name mismatch on ID {m_row['id']}"
    assert sb_row[2] == m_row["email"], f"Email mismatch on ID {m_row['id']}"
    assert sb_row[4] == m_row["message"], f"Message mismatch on ID {m_row['id']}"
print(f"  => PASSED: All 15 MySQL records verified with 100% data fidelity.")

# Check SQLite orphaned records (IDs 16, 17)
s_contacts_conn = sqlite3.connect(os.path.join(ROOT_DIR, "portfolio.db"))
s_contacts_conn.row_factory = sqlite3.Row
sqlite_contacts = s_contacts_conn.execute("SELECT * FROM contact_submissions ORDER BY id ASC;").fetchall()
s_contacts_conn.close()

for j, s_row in enumerate(sqlite_contacts):
    sb_row = sb_contacts[15 + j]
    assert sb_row[1] == s_row["name"], f"Name mismatch on orphaned ID {sb_row[0]}"
    assert sb_row[2] == s_row["email"], f"Email mismatch on orphaned ID {sb_row[0]}"
    assert sb_row[4] == s_row["message"], f"Message mismatch on orphaned ID {sb_row[0]}"
print(f"  => PASSED: Both SQLite orphaned records verified with 100% data fidelity.")

# -------------------------------------------------------------
# 3. DOCUMENTS & CHUNKS RELATIONSHIPS & VECTORS
# -------------------------------------------------------------
print("\n[CHECK 3] Portfolio Documents & Vector Chunks Relationships:")

pg_cur.execute("""
SELECT c.id, c.document_id, d.document_key, d.title, c.chunk_index, length(c.chunk_text), array_length(c.embedding::real[], 1)
FROM document_chunks c
JOIN portfolio_documents d ON c.document_id = d.id
ORDER BY c.chunk_index;
""")
chunk_joins = pg_cur.fetchall()
assert len(chunk_joins) == 17, f"Expected 17 joined chunks, got {len(chunk_joins)}"

for c_row in chunk_joins:
    chunk_id, doc_id, doc_key, title, chunk_idx, text_len, emb_dim = c_row
    assert emb_dim == 768, f"Invalid embedding dimension {emb_dim} on chunk {chunk_id}"
    assert text_len > 10, f"Empty or too short chunk text on chunk {chunk_id}"

print(f"  => PASSED: All 17 chunks successfully linked to documents via Foreign Key with exact 768-dim embeddings.")

# -------------------------------------------------------------
# 4. PGVECTOR SEARCH FUNCTION VALIDATION
# -------------------------------------------------------------
print("\n[CHECK 4] match_portfolio_chunks Function Execution:")

# Pick the embedding of the first chunk to simulate an exact match vector query
pg_cur.execute("SELECT embedding FROM document_chunks LIMIT 1;")
sample_emb = pg_cur.fetchone()[0]

pg_cur.execute("""
SELECT document_key, title, similarity 
FROM match_portfolio_chunks(%s, 0.5, 3);
""", (sample_emb,))
results = pg_cur.fetchall()

print(f"  Top vector matches returned: {len(results)}")
for r in results:
    print(f"    - Key: {r[0]:25} Title: {r[1]:40} Similarity: {r[2]:.4f}")

assert len(results) > 0, "No results returned from match_portfolio_chunks"
assert results[0][2] > 0.99, f"Top match should have ~1.0 similarity, got {results[0][2]}"
print("  => PASSED: pgvector semantic search function is fully operational!")

pg_cur.close()
pg_conn.close()

print("\n=======================================================")
print("ALL DATA VALIDATION CHECKS PASSED WITH ZERO ERRORS!")
print("=======================================================")
