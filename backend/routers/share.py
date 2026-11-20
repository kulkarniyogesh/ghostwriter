import os
import json
import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
import redis
from models.schemas import ShareRequest, ShareResponse

router = APIRouter()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
TTL_SECONDS = 86400  # 24 hours
KEY_PREFIX = "gw:share:"

def get_redis():
    return redis.from_url(REDIS_URL, decode_responses=True)


@router.post("/share", response_model=ShareResponse)
async def create_share(request: ShareRequest):
    share_id = uuid.uuid4().hex[:10]
    key = f"{KEY_PREFIX}{share_id}"
    expires_at = (datetime.now(timezone.utc) + timedelta(seconds=TTL_SECONDS)).isoformat()

    try:
        r = get_redis()
        payload = json.dumps({
            "result": request.migration_result.model_dump(),
            "expires_at": expires_at,
        })
        r.setex(key, TTL_SECONDS, payload)
    except Exception as e:
        raise HTTPException(502, {"error": "Share storage unavailable. Try downloading instead.", "code": "STORAGE_ERROR"})

    base_url = os.getenv("APP_BASE_URL", "http://localhost:5173")
    return ShareResponse(
        share_id=share_id,
        expires_at=expires_at,
        share_url=f"{base_url}/share/{share_id}",
    )


@router.get("/share/{share_id}")
async def get_share(share_id: str):
    key = f"{KEY_PREFIX}{share_id}"
    try:
        r = get_redis()
        payload = r.get(key)
    except Exception:
        raise HTTPException(502, {"error": "Share storage unavailable.", "code": "STORAGE_ERROR"})

    if not payload:
        raise HTTPException(404, {"error": "Share link not found or has expired (24hr limit).", "code": "SHARE_NOT_FOUND"})

    return json.loads(payload)
