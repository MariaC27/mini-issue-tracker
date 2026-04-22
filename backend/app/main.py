# ABOUTME: FastAPI application entry point with CORS and router registration.
# ABOUTME: Also exposes a public /api/v1/healthcheck endpoint.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router

app = FastAPI(title="Mini Issue Tracker", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/api/v1/healthcheck", tags=["health"])
def healthcheck() -> dict:
    return {"status": "ok"}
