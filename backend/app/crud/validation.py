from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.models.field_result import FieldResult
from app.models.land_record import LandRecord
from app.models.reference_record import ReferenceRecord
from app.models.validation_result import ValidationResult

LAND_RECORD_FIELDS = (
    "owner_name",
    "khasra_number",
    "khata_number",
    "area",
    "village",
    "tehsil",
    "district",
    "land_classification",
)


def _normalized(value: Any) -> Optional[str]:
    if value is None:
        return None
    return " ".join(str(value).strip().casefold().split())


def find_reference_record(db: Session, extracted_fields: Dict[str, Any]) -> Optional[ReferenceRecord]:
    khasra_number = extracted_fields.get("khasra_number")
    khata_number = extracted_fields.get("khata_number")
    if khasra_number is None:
        return None

    query = db.query(ReferenceRecord).filter(
        ReferenceRecord.khasra_number == str(khasra_number)
    )
    candidates = []
    if khata_number is not None:
        candidates = query.filter(ReferenceRecord.khata_number == str(khata_number)).all()

    if not candidates:
        village = _normalized(extracted_fields.get("village"))
        district = _normalized(extracted_fields.get("district"))
        if village is None or district is None:
            return None
        candidates = [
            candidate
            for candidate in query.all()
            if _normalized(candidate.khata_number) is None
            and _normalized(candidate.village) == village
            and _normalized(candidate.district) == district
        ]
    return candidates[0] if len(candidates) == 1 else None


def compare_with_reference(
    db: Session, extracted_fields: Dict[str, Any]
) -> Tuple[List[Dict[str, Any]], str]:
    reference = find_reference_record(db, extracted_fields)
    if reference is None:
        return (
            [
                {
                    "field_name": field_name,
                    "extracted_value": extracted_fields.get(field_name),
                    "reference_value": None,
                    "status": "NEW_RECORD_CANDIDATE",
                    "reason": "No matching mock reference record was found",
                }
                for field_name in LAND_RECORD_FIELDS
            ],
            "VERIFICATION_REQUIRED",
        )

    results = []
    has_conflict = False
    for field_name in LAND_RECORD_FIELDS:
        extracted_value = extracted_fields.get(field_name)
        reference_value = getattr(reference, field_name)
        if field_name == "owner_name" and _normalized(extracted_value) != _normalized(reference_value):
            status = "OWNER_CONFLICT"
            reason = "Extracted owner differs from the mock reference record"
            has_conflict = True
        elif _normalized(extracted_value) == _normalized(reference_value):
            status = "MATCH"
            reason = "Extracted value matches the mock reference record"
        else:
            status = "MISMATCH"
            reason = "Extracted value differs from the mock reference record"
            has_conflict = True

        results.append(
            {
                "field_name": field_name,
                "extracted_value": extracted_value,
                "reference_value": reference_value,
                "status": status,
                "reason": reason,
            }
        )

    return results, "VERIFICATION_REQUIRED" if has_conflict else "VALIDATED"


def save_field_results(
    db: Session, record_id: int, field_extractions: List[Dict[str, Any]]
) -> List[FieldResult]:
    results = [
        FieldResult(
            record_id=record_id,
            field_name=item["field_name"],
            extracted_value=item.get("extracted_value"),
            confidence=item.get("confidence"),
            validation_status=item.get("validation_status"),
            corrected_value=item.get("corrected_value"),
            verified_by=item.get("verified_by"),
        )
        for item in field_extractions
    ]
    db.add_all(results)
    db.commit()
    for result in results:
        db.refresh(result)
    return results


def save_validation_results(
    db: Session, record_id: int, validation_list: List[Dict[str, Any]]
) -> List[ValidationResult]:
    results = [
        ValidationResult(
            record_id=record_id,
            field_name=item["field_name"],
            extracted_value=item.get("extracted_value"),
            reference_value=item.get("reference_value"),
            status=item["status"],
            reason=item.get("reason"),
        )
        for item in validation_list
    ]
    db.add_all(results)
    db.commit()
    for result in results:
        db.refresh(result)
    return results