# ABOUTME: HTTP routes for label CRUD operations.
# ABOUTME: All routes require authentication except none (labels are auth-protected).

import uuid

from fastapi import APIRouter, HTTPException, status

from app.dependencies import CurrentUser, DbSession
from app.labels import service
from app.labels.models import LabelCreate, LabelRead, LabelUpdate

router = APIRouter(prefix="/labels", tags=["labels"])


@router.get("", response_model=list[LabelRead])
def list_labels(db: DbSession, _: CurrentUser) -> list[LabelRead]:
    return service.list_labels(db)


@router.post("", response_model=LabelRead, status_code=status.HTTP_201_CREATED)
def create_label(data: LabelCreate, db: DbSession, _: CurrentUser) -> LabelRead:
    return service.create(db, data)


@router.get("/{label_id}", response_model=LabelRead)
def get_label(label_id: uuid.UUID, db: DbSession, _: CurrentUser) -> LabelRead:
    label = service.get_by_id(db, label_id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")
    return label


@router.patch("/{label_id}", response_model=LabelRead)
def update_label(label_id: uuid.UUID, data: LabelUpdate, db: DbSession, _: CurrentUser) -> LabelRead:
    label = service.update(db, label_id, data)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")
    return label


@router.delete("/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_label(label_id: uuid.UUID, db: DbSession, _: CurrentUser) -> None:
    deleted = service.delete(db, label_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")
