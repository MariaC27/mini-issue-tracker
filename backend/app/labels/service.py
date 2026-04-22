# ABOUTME: CRUD operations for labels.
# ABOUTME: All label database access goes through these functions.

import uuid

from sqlalchemy.orm import Session

from app.labels.models import Label, LabelCreate, LabelUpdate


def list_labels(db: Session) -> list[Label]:
    return db.query(Label).order_by(Label.name).all()


def get_by_id(db: Session, label_id: uuid.UUID) -> Label | None:
    return db.query(Label).filter(Label.id == label_id).first()


def create(db: Session, data: LabelCreate) -> Label:
    label = Label(name=data.name, color=data.color)
    db.add(label)
    db.commit()
    db.refresh(label)
    return label


def update(db: Session, label_id: uuid.UUID, data: LabelUpdate) -> Label | None:
    label = get_by_id(db, label_id)
    if label is None:
        return None
    if data.name is not None:
        label.name = data.name
    if data.color is not None:
        label.color = data.color
    db.commit()
    db.refresh(label)
    return label


def delete(db: Session, label_id: uuid.UUID) -> bool:
    label = get_by_id(db, label_id)
    if label is None:
        return False
    db.delete(label)
    db.commit()
    return True
