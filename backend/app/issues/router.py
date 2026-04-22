# ABOUTME: HTTP routes for issue CRUD operations with optional filtering.
# ABOUTME: All routes require authentication.

import uuid

from fastapi import APIRouter, HTTPException, status

from app.dependencies import CurrentUser, DbSession
from app.enums import IssuePriority, IssueStatus
from app.issues import service
from app.issues.models import IssueCreate, IssueRead, IssueUpdate

router = APIRouter(prefix="/issues", tags=["issues"])


@router.get("", response_model=list[IssueRead])
def list_issues(
    db: DbSession,
    _: CurrentUser,
    status_filter: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    label_id: uuid.UUID | None = None,
) -> list[IssueRead]:
    return service.list_issues(db, status=status_filter, priority=priority, label_id=label_id)


@router.post("", response_model=IssueRead, status_code=status.HTTP_201_CREATED)
def create_issue(data: IssueCreate, db: DbSession, current_user: CurrentUser) -> IssueRead:
    return service.create(db, data, creator_id=current_user.user_id)


@router.get("/{issue_id}", response_model=IssueRead)
def get_issue(issue_id: uuid.UUID, db: DbSession, _: CurrentUser) -> IssueRead:
    issue = service.get_by_id(db, issue_id)
    if issue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    return issue


@router.patch("/{issue_id}", response_model=IssueRead)
def update_issue(issue_id: uuid.UUID, data: IssueUpdate, db: DbSession, _: CurrentUser) -> IssueRead:
    issue = service.update(db, issue_id, data)
    if issue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    return issue


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(issue_id: uuid.UUID, db: DbSession, _: CurrentUser) -> None:
    deleted = service.delete(db, issue_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
