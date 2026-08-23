from fastapi import APIRouter, Request, Header, HTTPException
from app.services.github_sync import verify_github_signature, process_github_push_event

router = APIRouter(prefix="/api/v1/github", tags=["GitHub Webhook Sync"])

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
