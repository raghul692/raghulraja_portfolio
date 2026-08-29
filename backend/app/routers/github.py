import time
import urllib.request
import json
import logging
from typing import Dict, Any
from fastapi import APIRouter, Request, Header, HTTPException
from app.services.github_sync import verify_github_signature, process_github_push_event

logger = logging.getLogger("portfolio_github")
router = APIRouter(prefix="/api/v1/github", tags=["GitHub Live Sync"])

GITHUB_USERNAME = "raghul692"
_CACHE: Dict[str, Any] = {"data": None, "timestamp": 0}
CACHE_TTL = 300  # 5 minutes in seconds

import ssl

def fetch_github_live_stats() -> dict:
    """Fetch live profile and repository stats from GitHub REST API with 5-min caching."""
    now = time.time()
    if _CACHE["data"] and (now - _CACHE["timestamp"]) < CACHE_TTL:
        return _CACHE["data"]

    headers = {
        "User-Agent": "Portfolio-AI-System/1.0",
        "Accept": "application/vnd.github.v3+json"
    }

    ctx = ssl._create_unverified_context()

    try:
        # 1. Fetch user profile
        user_req = urllib.request.Request(f"https://api.github.com/users/{GITHUB_USERNAME}", headers=headers)
        with urllib.request.urlopen(user_req, timeout=5, context=ctx) as resp:
            user_data = json.loads(resp.read().decode("utf-8"))

        # 2. Fetch user repositories
        repos_req = urllib.request.Request(f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=100", headers=headers)
        with urllib.request.urlopen(repos_req, timeout=5, context=ctx) as resp:
            repos_data = json.loads(resp.read().decode("utf-8"))

        total_stars = 0
        total_forks = 0
        lang_counts: Dict[str, int] = {}
        processed_repos = []

        for repo in repos_data:
            if repo.get("fork"):
                continue  # Skip external forks for primary stats
            stargazers = repo.get("stargazers_count", 0)
            forks = repo.get("forks_count", 0)
            total_stars += stargazers
            total_forks += forks

            lang = repo.get("language")
            if lang:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1

            processed_repos.append({
                "id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "html_url": repo.get("html_url"),
                "description": repo.get("description") or "Open source project repository.",
                "stars": stargazers,
                "forks": forks,
                "language": lang or "TypeScript",
                "updated_at": repo.get("updated_at"),
            })

        # Sort repos by stars desc, then updated_at desc
        processed_repos.sort(key=lambda r: (r["stars"], r["updated_at"]), reverse=True)
        top_repos = processed_repos[:6]

        # Calculate language percentages
        total_langs = sum(lang_counts.values()) or 1
        languages_percentage = [
            {"language": lang, "count": count, "percentage": round((count / total_langs) * 100, 1)}
            for lang, count in sorted(lang_counts.items(), key=lambda item: item[1], reverse=True)
        ]

        result = {
            "status": "online",
            "username": user_data.get("login", GITHUB_USERNAME),
            "name": user_data.get("name", "Raghul Raja M"),
            "avatar_url": user_data.get("avatar_url", f"https://github.com/{GITHUB_USERNAME}.png"),
            "html_url": user_data.get("html_url", f"https://github.com/{GITHUB_USERNAME}"),
            "bio": user_data.get("bio", "Full Stack & AI/ML Developer"),
            "public_repos": user_data.get("public_repos", len(processed_repos)),
            "followers": user_data.get("followers", 0),
            "following": user_data.get("following", 0),
            "total_stars": total_stars,
            "total_forks": total_forks,
            "languages": languages_percentage,
            "top_repos": top_repos,
            "cached_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(now)),
        }

        _CACHE["data"] = result
        _CACHE["timestamp"] = now
        return result

    except Exception as e:
        logger.warning("Failed to fetch live GitHub stats from API: %s. Using fallback.", e)
        if _CACHE["data"]:
            return _CACHE["data"]
        
        # Fallback dataset
        return {
            "status": "fallback",
            "username": GITHUB_USERNAME,
            "name": "Raghul Raja M",
            "avatar_url": f"https://github.com/{GITHUB_USERNAME}.png",
            "html_url": f"https://github.com/{GITHUB_USERNAME}",
            "bio": "Full Stack & AI/ML Developer | Crafting scalable web applications and intelligent systems.",
            "public_repos": 15,
            "followers": 14,
            "following": 18,
            "total_stars": 24,
            "total_forks": 8,
            "languages": [
                {"language": "TypeScript", "count": 8, "percentage": 53.3},
                {"language": "Python", "count": 5, "percentage": 33.3},
                {"language": "HTML/CSS", "count": 2, "percentage": 13.4},
            ],
            "top_repos": [
                {
                    "id": 1,
                    "name": "portfolio",
                    "full_name": f"{GITHUB_USERNAME}/portfolio",
                    "html_url": f"https://github.com/{GITHUB_USERNAME}/portfolio",
                    "description": "Award-winning personal portfolio & AI Intelligence Suite built with React, Three.js & FastAPI.",
                    "stars": 12,
                    "forks": 4,
                    "language": "TypeScript",
                    "updated_at": "2026-08-28T12:00:00Z"
                },
                {
                    "id": 2,
                    "name": "ResuMate-AI",
                    "full_name": f"{GITHUB_USERNAME}/ResuMate-AI",
                    "html_url": f"https://github.com/{GITHUB_USERNAME}",
                    "description": "Enterprise ATS resume analyzer and tailoring platform with AI heatmap scoring.",
                    "stars": 8,
                    "forks": 3,
                    "language": "Python",
                    "updated_at": "2026-08-27T10:00:00Z"
                }
            ],
            "cached_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(now)),
        }

@router.get("/stats")
def get_github_stats():
    """Get live GitHub profile metrics, language breakdowns, and featured repositories."""
    return fetch_github_live_stats()

@router.post("/webhook")
async def github_webhook_endpoint(
    request: Request,
    x_hub_signature_256: str = Header(None)
):
    body_bytes = await request.body()
    
    # Verify HMAC SHA256 Signature if header is provided
    if x_hub_signature_256 and not verify_github_signature(body_bytes, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="Invalid GitHub HMAC SHA256 signature.")

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload.")

    event_type = request.headers.get("X-GitHub-Event", "push")
    if event_type == "ping":
        return {"status": "pong", "message": "GitHub Webhook successfully configured!"}

    if event_type == "push":
        result = process_github_push_event(payload)
        return result

    return {"status": "ignored", "event": event_type}

