from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id = Column(Integer, ForeignKey("documents.id"), unique=True, nullable=False)
    owner_name = Column(String, nullable=True)
    khasra_number = Column(String, nullable=True, index=True)
    khata_number = Column(String, nullable=True, index=True)
    area = Column(String, nullable=True)
    village = Column(String, nullable=True)
    tehsil = Column(String, nullable=True)
    district = Column(String, nullable=True, index=True)
    land_classification = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    document = relationship("Document", back_populates="land_record")
    field_results = relationship("FieldResult", back_populates="land_record", cascade="all, delete-orphan")
    validation_results = relationship("ValidationResult", back_populates="land_record", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="land_record", cascade="all, delete-orphan")