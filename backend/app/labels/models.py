# ABOUTME: Label ORM model and Pydantic schemas for tag-style issue categorization.
# ABOUTME: Labels have a name, a hex color string, and an optional description.

import uuid

from pydantic import BaseModel, ConfigDict
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Label(Base):
    __tablename__ = "labels"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    color: Mapped[str] = mapped_column(String(7), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


# --- Pydantic schemas ---

class LabelCreate(BaseModel):
    name: str
    color: str
    description: str | None = None


class LabelUpdate(BaseModel):
    name: str | None = None
    color: str | None = None
    description: str | None = None


class LabelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    color: str
    description: str | None
