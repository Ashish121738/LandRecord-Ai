from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session, joinedload

from app.models.document import Document
from app.models.land_record import LandRecord


def create_land_record(db: Session, document_id: int, extracted_fields: Dict[str, Any]) -> LandRecord:
    record = LandRecord(
        document_id=document_id,
        owner_name=extracted_fields.get("owner_name"),
        khasra_number=extracted_fields.get("khasra_number"),
        khata_number=extracted_fields.get("khata_number"),
        area=extracted_fields.get("area") or extracted_fields.get("total_area"),
        village=extracted_fields.get("village"),
        tehsil=extracted_fields.get("tehsil"),
        district=extracted_fields.get("district"),
        land_classification=extracted_fields.get("land_classification"),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_all_records(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[Dict[str, Any]] = None,
) -> List[LandRecord]:
    query = db.query(LandRecord)
    if filters:
        if filters.get("district"):
            query = query.filter(LandRecord.district == filters["district"])
        if filters.get("village"):
            query = query.filter(LandRecord.village == filters["village"])
        if filters.get("khasra_number"):
            query = query.filter(LandRecord.khasra_number == filters["khasra_number"])
        if filters.get("status"):
            query = query.join(Document).filter(Document.status == filters["status"])
    return query.offset(skip).limit(limit).all()


def get_record_by_id(db: Session, record_id: int) -> Optional[LandRecord]:
    return (
        db.query(LandRecord)
        .options(
            joinedload(LandRecord.field_results),
            joinedload(LandRecord.validation_results),
            joinedload(LandRecord.audit_logs),
            joinedload(LandRecord.document),
        )
        .filter(LandRecord.id == record_id)
        .first()
    )