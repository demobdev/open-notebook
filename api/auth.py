"""
Clerk JWT authentication middleware for the Audioprism API.
Verifies JWTs issued by Clerk using the JWKS endpoint,
extracts the user_id, and sets request.state.user_id.
"""

import base64
import os
import time
from typing import Optional

import httpx
import jwt
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

_jwks_cache: dict = {}
_jwks_cache_expiry: float = 0
JWKS_CACHE_TTL = 3600  # 1 hour


def _get_clerk_domain() -> str:
    """Derive the Clerk issuer domain from the publishable key or env var."""
    explicit = os.getenv("CLERK_DOMAIN")
    if explicit:
        return explicit.rstrip("/")

    pk = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "")
    if pk:
        try:
            payload = pk.split("_")[-1]
            padding = 4 - len(payload) % 4
            if padding != 4:
                payload += "=" * padding
            decoded = base64.b64decode(payload).decode("utf-8").rstrip("$")
            return decoded
        except Exception:
            pass

    return ""


def _get_clerk_issuer() -> str:
    domain = _get_clerk_domain()
    if domain:
        return f"https://{domain}"
    return ""


async def _fetch_jwks() -> dict:
    global _jwks_cache, _jwks_cache_expiry

    now = time.time()
    if _jwks_cache and now < _jwks_cache_expiry:
        return _jwks_cache

    domain = _get_clerk_domain()
    if not domain:
        raise RuntimeError("Clerk domain not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_DOMAIN.")

    jwks_url = f"https://{domain}/.well-known/jwks.json"
    logger.debug(f"Fetching JWKS from {jwks_url}")

    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_expiry = now + JWKS_CACHE_TTL
        return _jwks_cache


async def verify_clerk_token(token: str) -> dict:
    """Verify a Clerk-issued JWT and return the decoded claims."""
    jwks_data = await _fetch_jwks()

    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    if not kid:
        raise jwt.InvalidTokenError("Token header missing kid")

    matching_key = None
    for key in jwks_data.get("keys", []):
        if key.get("kid") == kid:
            matching_key = key
            break

    if not matching_key:
        # Invalidate cache and retry once in case keys rotated
        global _jwks_cache_expiry
        _jwks_cache_expiry = 0
        jwks_data = await _fetch_jwks()
        for key in jwks_data.get("keys", []):
            if key.get("kid") == kid:
                matching_key = key
                break

    if not matching_key:
        raise jwt.InvalidTokenError(f"No matching key found for kid={kid}")

    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(matching_key)

    issuer = _get_clerk_issuer()
    decode_options = {"verify_aud": False}

    claims = jwt.decode(
        token,
        public_key,
        algorithms=["RS256"],
        issuer=issuer if issuer else None,
        options=decode_options,
    )
    return claims


class ClerkJWTMiddleware(BaseHTTPMiddleware):
    """
    Starlette middleware that verifies Clerk JWTs on incoming requests.
    Sets request.state.user_id from the JWT 'sub' claim.
    """

    def __init__(self, app, excluded_paths: Optional[list] = None):
        super().__init__(app)
        self.excluded_paths = excluded_paths or [
            "/",
            "/health",
            "/docs",
            "/openapi.json",
            "/redoc",
        ]

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.excluded_paths:
            return await call_next(request)

        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing authorization header"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            scheme, token = auth_header.split(" ", 1)
            if scheme.lower() != "bearer":
                raise ValueError("Invalid scheme")
        except ValueError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authorization header format"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            claims = await verify_clerk_token(token)
            request.state.user_id = claims.get("sub", "")
        except jwt.ExpiredSignatureError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Token has expired"},
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid Clerk JWT: {e}")
            return JSONResponse(
                status_code=401,
                content={"detail": f"Invalid token: {e}"},
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.error(f"Unexpected error verifying token: {e}")
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication failed"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        return await call_next(request)


security = HTTPBearer(auto_error=False)


def get_current_user_id(request: Request) -> str:
    """FastAPI dependency: extracts user_id from request.state (set by ClerkJWTMiddleware)."""
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id
