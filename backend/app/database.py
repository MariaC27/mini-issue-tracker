# ABOUTME: SQLAlchemy engine, declarative base, and session factory.
# ABOUTME: All models import Base from here to share the same metadata.

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass
