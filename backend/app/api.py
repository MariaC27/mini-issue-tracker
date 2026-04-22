# ABOUTME: Aggregates all routers under the /api/v1 prefix.
# ABOUTME: Import this and include in main.py.

from fastapi import APIRouter

from app.issues.router import router as issues_router
from app.labels.router import router as labels_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(issues_router)
api_router.include_router(labels_router)
