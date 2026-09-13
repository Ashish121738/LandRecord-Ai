from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole:
    CITIZEN = "CITIZEN"
    VERIFIER = "VERIFIER"
    ADMIN = "ADMIN"

    @classmethod
    def values(cls):
        return (cls.CITIZEN, cls.VERIFIER, cls.ADMIN)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default=UserRole.CITIZEN, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    documents = relationship("Document", back_populates="uploader")