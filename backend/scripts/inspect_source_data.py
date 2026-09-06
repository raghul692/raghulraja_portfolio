import os
import json
import sqlite3
import mysql.connector

# 1. MySQL contact_submissions
conn_mysql = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="portfolio"
)
cur_mysql = conn_mysql.cursor(dictionary=True)
cur_mysql.execute("SELECT * FROM contact_submissions ORDER BY id ASC")
mysql_contacts = cur_mysql.fetchall()
cur_mysql.close()
conn_mysql.close()

print(f"--- MYSQL CONTACT SUBMISSIONS ({len(mysql_contacts)} rows) ---")
for c in mysql_contacts:
    print(f"ID={c['id']}, Name={c['name']}, Email={c['email']}, CreatedAt={c['created_at']}, MsgLen={len(c['message'])}")

# 2. SQLite portfolio.db
root_portfolio_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "portfolio.db"))
conn_sqlite_contacts = sqlite3.connect(root_portfolio_db)
conn_sqlite_contacts.row_factory = sqlite3.Row
cur_sqlite_contacts = conn_sqlite_contacts.cursor()
sqlite_contacts = [dict(r) for r in cur_sqlite_contacts.execute("SELECT * FROM contact_submissions ORDER BY id ASC").fetchall()]
conn_sqlite_contacts.close()

print(f"\n--- SQLITE ROOT PORTFOLIO.DB CONTACT SUBMISSIONS ({len(sqlite_contacts)} rows) ---")
for c in sqlite_contacts:
    print(f"ID={c['id']}, Name={c['name']}, Email={c['email']}, CreatedAt={c['created_at']}, MsgLen={len(c['message'])}")

# Check for duplicate records between MySQL and SQLite
print("\n--- DUPLICATE CHECK BETWEEN MYSQL & SQLITE CONTACTS ---")
mysql_keys = {(c['name'].strip().lower(), c['email'].strip().lower(), c['message'].strip()): c['id'] for c in mysql_contacts}
for c in sqlite_contacts:
    key = (c['name'].strip().lower(), c['email'].strip().lower(), c['message'].strip())
    if key in mysql_keys:
        print(f"[DUPLICATE FOUND] SQLite row ID={c['id']} matches MySQL row ID={mysql_keys[key]}")
    else:
        print(f"[UNIQUE RECORD] SQLite row ID={c['id']} is UNIQUE (Email: {c['email']}, Name: {c['name']})")

# 3. SQLite portfolio_ai.db
root_ai_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "portfolio_ai.db"))
conn_ai = sqlite3.connect(root_ai_db)
conn_ai.row_factory = sqlite3.Row
cur_ai = conn_ai.cursor()

docs = [dict(r) for r in cur_ai.execute("SELECT * FROM portfolio_documents").fetchall()]
chunks = [dict(r) for r in cur_ai.execute("SELECT * FROM document_chunks").fetchall()]
ats = [dict(r) for r in cur_ai.execute("SELECT * FROM ats_analyses").fetchall()]
resumes = [dict(r) for r in cur_ai.execute("SELECT * FROM generated_resumes").fetchall()]
placements = [dict(r) for r in cur_ai.execute("SELECT * FROM placement_attempts").fetchall()]
conn_ai.close()

print(f"\n--- SQLITE PORTFOLIO_AI.DB INVENTORY ---")
print(f"portfolio_documents: {len(docs)} rows")
print(f"document_chunks:     {len(chunks)} rows")
print(f"ats_analyses:        {len(ats)} rows")
print(f"generated_resumes:   {len(resumes)} rows")
print(f"placement_attempts:  {len(placements)} rows")
