# ABOUTME: CRUD operations for issues, including label assignment.
# ABOUTME: All issue database access goes through these functions.

import uuid

from sqlalchemy.orm import Session

from app.enums import IssuePriority, IssueStatus
from app.issues.models import Issue, IssueCreate, IssueStats, IssueUpdate
from app.labels import service as label_service


def list_issues(
    db: Session,
    status: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    label_id: uuid.UUID | None = None,
    search: str | None = None,
) -> list[Issue]:
    query = db.query(Issue)
    if status is not None:
        query = query.filter(Issue.status == status)
    if priority is not None:
        query = query.filter(Issue.priority == priority)
    if label_id is not None:
        query = query.filter(Issue.labels.any(id=label_id))
    if search is not None:
        query = query.filter(Issue.title.ilike(f"%{search}%"))
    return query.order_by(Issue.created_at.desc()).all()


def get_by_id(db: Session, issue_id: uuid.UUID) -> Issue | None:
    return db.query(Issue).filter(Issue.id == issue_id).first()


def create(db: Session, data: IssueCreate, creator_id: str) -> Issue:
    labels = [label_service.get_by_id(db, lid) for lid in data.label_ids]
    labels = [l for l in labels if l is not None]

    issue = Issue(
        title=data.title,
        description=data.description,
        status=data.status,
        priority=data.priority,
        due_date=data.due_date,
        creator_id=creator_id,
        labels=labels,
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue


def update(db: Session, issue_id: uuid.UUID, data: IssueUpdate) -> Issue | None:
    issue = get_by_id(db, issue_id)
    if issue is None:
        return None

    if data.title is not None:
        issue.title = data.title
    if data.description is not None:
        issue.description = data.description
    if data.status is not None:
        issue.status = data.status
    if data.priority is not None:
        issue.priority = data.priority
    if data.due_date is not None:
        issue.due_date = data.due_date
    if data.label_ids is not None:
        labels = [label_service.get_by_id(db, lid) for lid in data.label_ids]
        issue.labels = [l for l in labels if l is not None]

    db.commit()
    db.refresh(issue)
    return issue


def add_label(db: Session, issue_id: uuid.UUID, label_id: uuid.UUID) -> Issue | None:
    issue = get_by_id(db, issue_id)
    if issue is None:
        return None
    label = label_service.get_by_id(db, label_id)
    if label is None:
        return None
    if label not in issue.labels:
        issue.labels.append(label)
        db.commit()
        db.refresh(issue)
    return issue


def remove_label(db: Session, issue_id: uuid.UUID, label_id: uuid.UUID) -> Issue | None:
    issue = get_by_id(db, issue_id)
    if issue is None:
        return None
    issue.labels = [l for l in issue.labels if l.id != label_id]
    db.commit()
    db.refresh(issue)
    return issue


def get_stats(db: Session) -> IssueStats:
    from sqlalchemy import func as sa_func
    rows = db.query(Issue.status, sa_func.count()).group_by(Issue.status).all()
    counts = {str(s): c for s, c in rows}
    return IssueStats(
        open=counts.get("open", 0),
        in_progress=counts.get("in_progress", 0),
        closed=counts.get("closed", 0),
        total=sum(counts.values()),
    )


def delete(db: Session, issue_id: uuid.UUID) -> bool:
    issue = get_by_id(db, issue_id)
    if issue is None:
        return False
    db.delete(issue)
    db.commit()
    return True
