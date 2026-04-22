# ABOUTME: Shared enum types for issue status and priority.
# ABOUTME: Used by both ORM models and Pydantic schemas.

import enum


class IssueStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class IssuePriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
