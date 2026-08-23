import hmac
import hashlib
import json
import logging
from app.config import settings
from app.db import insert_document, insert_chunk
from app.services.embeddings import generate_embedding

logger = logging.getLogger("portfolio_ai_github_sync")

def verify_github_signature(payload_bytes: bytes, signature_header: str) -> bool:
    """Verifies HMAC SHA256 signature from GitHub webhook request."""
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected_hash = signature_header.split("sha256=")[1]
    mac = hmac.new(settings.GITHUB_WEBHOOK_SECRET.encode("utf-8"), payload_bytes, hashlib.sha256)
    return hmac.compare_digest(mac.hexdigest(), expected_hash)


def process_github_push_event(payload: dict) -> dict:
    """Processes commit diffs and re-indexes modified portfolio files."""
    repo_name = payload.get("repository", {}).get("full_name", "unknown/repo")
    commits = payload.get("commits", [])

    modified_files = set()
    added_files = set()

    for commit in commits:
        modified_files.update(commit.get("modified", []))
        added_files.update(commit.get("added", []))

    all_changed = list(modified_files.union(added_files))
    processed_count = 0

    for file_path in all_changed:
        # Check if file is a documentation/resume file
        if file_path.endswith((".md", ".ts", ".json", ".py")):
            doc_key = f"github_{file_path.replace('/', '_').replace('.', '_')}"
            title = f"GitHub Code: {file_path}"
            category = "codebase"
            content = f"Repository: {repo_name}\nFile: {file_path}\nLast Updated Commit: {payload.get('after', 'latest')}"
            
            doc_id = insert_document(
                doc_key=doc_key,
                title=title,
                category=category,
                content=content,
                metadata={"file_path": file_path, "repo": repo_name},
                source_type="github_repo"
            )

            # Insert chunk
            emb = generate_embedding(content)
            insert_chunk(doc_id=doc_id, chunk_index=0, chunk_text=content, embedding=emb)
            processed_count += 1

    return {
        "status": "success",
        "repository": repo_name,
        "commit_sha": payload.get("after"),
        "total_commits": len(commits),
        "changed_files_count": len(all_changed),
        "reindexed_documents": processed_count
    }
