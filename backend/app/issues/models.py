# ABOUTME: Issue ORM model, association table, and Pydantic schemas.
# ABOUTME: Issues track title, description, status, priority, creator, and labels.

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.enums import IssuePriority, IssueStatus
from app.labels.models import Label, LabelRead

issue_labels = Table(
    "issue_labels",
    Base.metadata,
    Column("issue_id", UUID(as_uuid=True), ForeignKey("issues.id", ondelete="CASCADE"), primary_key=True),
    Column("label_id", UUID(as_uuid=True), ForeignKey("labels.id", ondelete="CASCADE"), primary_key=True),
)


class Issue(Base):
    __tablename__ = "issues"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[IssueStatus] = mapped_column(default=IssueStatus.open)
    priority: Mapped[IssuePriority] = mapped_column(default=IssuePriority.medium)
    creator_id: Mapped[str] = mapped_column(String(255), nullable=False)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    labels: Mapped[list[Label]] = relationship("Label", secondary=issue_labels, lazy="selectin")


# --- Pydantic schemas ---

class IssueCreate(BaseModel):
    title: str
    description: str | None = None
    status: IssueStatus = IssueStatus.open
    priority: IssuePriority = IssuePriority.medium
    due_date: datetime | None = None
    label_ids: list[uuid.UUID] = []


class IssueUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: IssueStatus | None = None
    priority: IssuePriority | None = None
    due_date: datetime | None = None
    label_ids: list[uuid.UUID] | None = None


class IssueRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None
    status: IssueStatus
    priority: IssuePriority
    creator_id: str
    due_date: datetime | None
    created_at: datetime
    updated_at: datetime
    labels: list[LabelRead] = []


class IssueStats(BaseModel):
    open: int
    in_progress: int
    closed: int
    total: int
