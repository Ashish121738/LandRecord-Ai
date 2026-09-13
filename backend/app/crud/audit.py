from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.field_result import FieldResult
from app.models.land_record import LandRecord


def apply_manual_correction(
    db: Session,
    verifier_user_id: int,
    record_id: int,
    field_name: str,
    corrected_value: str,
) -> Optional[AuditLog]:
    record = db.query(LandRecord).filter(LandRecord.id == record_id).first()
    if record is None or not hasattr(record, field_name):
        return None

    old_value = getattr(record, field_name)
    setattr(record, field_name, corrected_value)
    record.updated_at = datetime.now(timezone.utc)

    field_result = (
        db.query(FieldResult)
        .filter(FieldResult.record_id == record_id, FieldResult.field_name == field_name)
        .first()
    )
    if field_result:
        field_result.corrected_value = corrected_value
        field_result.verified_by = verifier_user_id
        field_result.validation_status = "CORRECTED"
        field_result.updated_at = datetime.now(timezone.utc)

    audit_entry = AuditLog(
        user_id=verifier_user_id,
        record_id=record_id,
        field_name=field_name,
        action="FIELD_CORRECTED",
        old_value=str(old_value) if old_value is not None else None,
        new_value=corrected_value,
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry