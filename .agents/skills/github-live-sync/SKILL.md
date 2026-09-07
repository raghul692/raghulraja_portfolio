---
name: github-live-sync
description: >
  Audits, verifies, and tests real-time synchronization between GitHub repositories
  and the portfolio live stats engine. Use when checking GitHub REST API health,
  rate limits, webhook delivery, or frontend cache consistency.
---

# GitHub Live Sync & Telemetry Skill

Provides automated workflows to verify, diagnose, and audit real-time GitHub telemetry for Raghul Raja's portfolio.

## When to Use
Activate this skill when:
- Verifying whether new commits or repositories are appearing on the portfolio.
- Diagnosing rate limit errors (`HTTP 403 API rate limit exceeded`).
- Testing the Render backend endpoint `/api/v1/github/stats`.
- Simulating GitHub webhook events (`push` or `ping`) to `/api/v1/github/webhook`.
- Validating client-side `localStorage` cache integrity.

---

## 1. Quick Health Check Workflow

To verify GitHub API sync health from the terminal:

```bash
# 1. Direct GitHub REST API check
python -c "
import urllib.request, json
req = urllib.request.Request('https://api.github.com/users/raghul692', headers={'User-Agent': 'SyncAudit'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print('GitHub Status:', resp.getcode())
    print('Rate Limit Remaining:', resp.headers.get('x-ratelimit-remaining'))
    print('Public Repos:', data.get('public_repos'))
"

# 2. Render Cloud Backend check
python -c "
import urllib.request, json
req = urllib.request.Request('https://raghulraja-portfolio.onrender.com/api/v1/github/stats')
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print('Backend Status:', data.get('status'))
    print('Repos Synced:', data.get('public_repos'))
    print('Total Stars:', data.get('total_stars'))
    print('Top Repos:', [r['name'] for r in data.get('top_repos', [])[:4]])
"
```

---

## 2. GitHub Webhook Setup Guide

To enable real-time cache invalidation and AI knowledge re-indexing on every commit:

1. Open your repository on GitHub:
   `https://github.com/raghul692/raghulraja_portfolio/settings/hooks`
2. Click **"Add webhook"**.
3. Fill in the configuration:
   * **Payload URL**: `https://raghulraja-portfolio.onrender.com/api/v1/github/webhook`
   * **Content type**: `application/json`
   * **Secret**: `portfolio_ai_secret_key` (or matching `GITHUB_WEBHOOK_SECRET` in `.env`)
   * **Which events would you like to trigger this webhook?**: Select **"Just the push event"**.
   * **Active**: Checked.
4. Click **"Add webhook"**.
5. GitHub will immediately send a `ping` event. The backend will reply with:
   `{"status": "pong", "message": "GitHub Webhook successfully configured!"}`

---

## 3. Four-Tier Fallback Architecture Reference

| Tier | Source | Latency | Fallback Condition |
|---|---|---|---|
| **Tier 1** | LocalStorage Micro-Cache (`raghul_github_stats_v3`) | ~0ms | Cache older than 5 minutes or user clicked 'Sync Live' |
| **Tier 2** | Direct GitHub REST API (`api.github.com`) | ~300ms | Rate limit HTTP 403 or network failure |
| **Tier 3** | Render Cloud Proxy (`/api/v1/github/stats`) | ~1-2s (or cold start) | Backend timeout or server down |
| **Tier 4** | Verified Offline Snapshot | ~0ms | Complete offline state |
