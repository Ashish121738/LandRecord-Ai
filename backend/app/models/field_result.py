from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class FieldResult(Base):
    __tablename__ = "field_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    record_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    field_name = Column(String, nullable=False)
    extracted_value = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    validation_status = Column(String, nullable=True)
    corrected_value = Column(String, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    land_record = relationship("LandRecord", back_populates="field_results")
    verifier = relationship("User", foreign_keys=[verified_by])