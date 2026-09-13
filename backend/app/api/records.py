from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_verifier
from app.crud.audit import apply_manual_correction
from app.database import get_db
from app.models.user import User

router = APIRouter()


@router.patch("/{record_id}/fields/{field_name}")
def correct_field(
    record_id: int,
    field_name: str,
    corrected_value: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_verifier),
):
    audit_entry = apply_manual_correction(
        db,
        verifier_user_id=current_user.id,
        record_id=record_id,
        field_name=field_name,
        corrected_value=corrected_value,
    )
    if audit_entry is None:
        raise HTTPException(status_code=404, detail="Land record or field not found")
    return {
        "message": "Field corrected and audit entry created",
        "audit_log_id": audit_entry.id,
        "record_id": record_id,
        "field_name": field_name,
    }