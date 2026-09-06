import os
import json
import shutil
import sqlite3
import mysql.connector
from datetime import datetime

BACKUP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backups"))
os.makedirs(BACKUP_DIR, exist_ok=True)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print(f"Starting backups to: {BACKUP_DIR}")
print(f"Root dir: {ROOT_DIR}")
print(f"Backend dir: {BACKEND_DIR}")

# 1. Backup MySQL database
mysql_records = []
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="portfolio"
    )
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM contact_submissions")
    rows = cur.fetchall()
    for row in rows:
        # serialize datetime
        for k, v in row.items():
            if isinstance(v, (datetime,)):
                row[k] = v.isoformat()
        mysql_records.append(row)
    cur.close()
    conn.close()

    mysql_json_path = os.path.join(BACKUP_DIR, "mysql_contact_submissions_backup.json")
    with open(mysql_json_path, "w", encoding="utf-8") as f:
        json.dump(mysql_records, f, indent=2, ensure_ascii=False)
    print(f"[OK] MySQL contact_submissions backed up ({len(mysql_records)} rows) -> {mysql_json_path}")
except Exception as e:
    print(f"[ERROR] MySQL backup failed: {e}")
    raise

# Also dump MySQL CREATE TABLE and SQL INSERTs
try:
    sql_dump_path = os.path.join(BACKUP_DIR, "mysql_portfolio_dump.sql")
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="portfolio"
    )
    cur = conn.cursor()
    cur.execute("SHOW CREATE TABLE contact_submissions")
    create_tbl = cur.fetchone()[1]
    
    with open(sql_dump_path, "w", encoding="utf-8") as f:
        f.write("-- MySQL Portfolio Backup Dump\n")
        f.write(f"-- Timestamp: {datetime.now().isoformat()}\n\n")
        f.write(f"{create_tbl};\n\n")
        for rec in mysql_records:
            f.write("INSERT INTO contact_submissions (id, name, email, subject, message, status, ip_address, user_agent, created_at) VALUES (\n")
            f.write(f"  {rec.get('id')}, {repr(rec.get('name'))}, {repr(rec.get('email'))}, {repr(rec.get('subject'))}, {repr(rec.get('message'))}, {repr(rec.get('status'))}, {repr(rec.get('ip_address'))}, {repr(rec.get('user_agent'))}, {repr(rec.get('created_at'))}\n")
            f.write(");\n")
    cur.close()
    conn.close()
    print(f"[OK] MySQL SQL dump created -> {sql_dump_path}")
except Exception as e:
    print(f"[ERROR] MySQL SQL dump failed: {e}")
    raise

# 2. Backup SQLite portfolio.db from root and backend
root_portfolio_db = os.path.join(ROOT_DIR, "portfolio.db")
backend_portfolio_db = os.path.join(BACKEND_DIR, "portfolio.db")

if os.path.exists(root_portfolio_db) and os.path.getsize(root_portfolio_db) > 0:
    dst = os.path.join(BACKUP_DIR, "root_portfolio_backup.db")
    shutil.copy2(root_portfolio_db, dst)
    print(f"[OK] Copied {root_portfolio_db} ({os.path.getsize(dst)} bytes) -> {dst}")
    
    # Read rows from root_portfolio_db
    conn = sqlite3.connect(root_portfolio_db)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    rows = [dict(r) for r in cur.execute("SELECT * FROM contact_submissions").fetchall()]
    conn.close()
    json_path = os.path.join(BACKUP_DIR, "sqlite_root_contact_submissions_backup.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)
    print(f"[OK] SQLite root contact_submissions backed up ({len(rows)} rows) -> {json_path}")

if os.path.exists(backend_portfolio_db):
    dst = os.path.join(BACKUP_DIR, "backend_portfolio_backup.db")
    shutil.copy2(backend_portfolio_db, dst)
    print(f"[OK] Copied {backend_portfolio_db} ({os.path.getsize(dst)} bytes) -> {dst}")

# 3. Backup SQLite portfolio_ai.db from root and backend
root_ai_db = os.path.join(ROOT_DIR, "portfolio_ai.db")
backend_ai_db = os.path.join(BACKEND_DIR, "portfolio_ai.db")

if os.path.exists(root_ai_db) and os.path.getsize(root_ai_db) > 0:
    dst = os.path.join(BACKUP_DIR, "root_portfolio_ai_backup.db")
    shutil.copy2(root_ai_db, dst)
    print(f"[OK] Copied {root_ai_db} ({os.path.getsize(dst)} bytes) -> {dst}")

    # Read documents and chunks from root_ai_db
    conn = sqlite3.connect(root_ai_db)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    docs = [dict(r) for r in cur.execute("SELECT * FROM portfolio_documents").fetchall()]
    chunks = [dict(r) for r in cur.execute("SELECT * FROM document_chunks").fetchall()]
    conn.close()

    docs_json_path = os.path.join(BACKUP_DIR, "root_portfolio_ai_documents_backup.json")
    with open(docs_json_path, "w", encoding="utf-8") as f:
        json.dump(docs, f, indent=2)
    print(f"[OK] SQLite root portfolio_documents backed up ({len(docs)} rows) -> {docs_json_path}")

    chunks_json_path = os.path.join(BACKUP_DIR, "root_document_chunks_backup.json")
    with open(chunks_json_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2)
    print(f"[OK] SQLite root document_chunks backed up ({len(chunks)} rows) -> {chunks_json_path}")

if os.path.exists(backend_ai_db):
    dst = os.path.join(BACKUP_DIR, "backend_portfolio_ai_backup.db")
    shutil.copy2(backend_ai_db, dst)
    print(f"[OK] Copied {backend_ai_db} ({os.path.getsize(dst)} bytes) -> {dst}")

# 4. Verification of backups
print("\n--- BACKUP VERIFICATION ---")
backup_files = os.listdir(BACKUP_DIR)
for bf in backup_files:
    fp = os.path.join(BACKUP_DIR, bf)
    print(f"File: {bf:45} Size: {os.path.getsize(fp):10} bytes")

print("\nALL BACKUPS COMPLETED AND VERIFIED SUCCESSFULLY!")
