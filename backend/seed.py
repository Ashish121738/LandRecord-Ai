import csv
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.security import get_password_hash
from app.crud.documents import create_document, update_document_ocr
from app.crud.records import create_land_record
from app.crud.users import create_user
from app.crud.validation import save_field_results, save_validation_results
from app.database import Base, SessionLocal, engine
from app.models import Document, ReferenceRecord, User, UserRole


REFERENCE_CSV = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "mock_reference_data"
    / "synthetic_land_records.csv"
)


FIELDS = (
    "owner_name",
    "khasra_number",
    "khata_number",
    "area",
    "village",
    "tehsil",
    "district",
    "land_classification",
)


def add_case(db, user_id, filename, values, status, reference, validation_status, reason):
    existing_document = db.query(Document).filter(Document.filename == filename).first()
    if existing_document:
        return existing_document.land_record
    document = create_document(
        db,
        filename=filename,
        file_path=f"uploads/{filename}",
        file_type="pdf",
        uploaded_by=user_id,
    )
    record = create_land_record(db, document.id, values)
    save_field_results(
        db,
        record.id,
        [
            {
                "field_name": field_name,
                "extracted_value": values.get(field_name),
                "confidence": 0.95,
                "validation_status": validation_status.get(field_name, "MATCH"),
            }
            for field_name in FIELDS
        ],
    )
    save_validation_results(
        db,
        record.id,
        [
            {
                "field_name": field_name,
                "extracted_value": values.get(field_name),
                "reference_value": (
                    reference.get(field_name)
                    if isinstance(reference, dict)
                    else getattr(reference, field_name, None)
                ) if reference else None,
                "status": validation_status.get(field_name, "MATCH"),
                "reason": reason.get(field_name),
            }
            for field_name in FIELDS
        ],
    )
    update_document_ocr(
        db,
        document.id,
        ocr_text=str(values),
        ocr_confidence=0.95,
        status=status,
    )
    return record


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        users = {
            "citizen@example.com": ("Demo Citizen", UserRole.CITIZEN, "citizen-password"),
            "verifier@example.com": ("Demo Verifier", UserRole.VERIFIER, "verifier-password"),
            "admin@example.com": ("Demo Admin", UserRole.ADMIN, "admin-password"),
        }
        seeded_users = {}
        for email, (name, role, password) in users.items():
            user = db.query(User).filter(User.email == email).first()
            seeded_users[email] = user or create_user(
                db, name, email, get_password_hash(password), role
            )
        citizen = seeded_users["citizen@example.com"]

        matched = {
            "owner_name": "Ramesh Kumar", "khasra_number": "125/2", "khata_number": "451",
            "area": "2.50 Acre", "village": "Rampur", "tehsil": "Sadar", "district": "Meerut",
            "land_classification": "Agricultural",
        }
        area_mismatch = {**matched, "owner_name": "Suresh Kumar", "khasra_number": "200/1", "khata_number": "320", "area": "25 Acre", "village": "Daurala", "tehsil": "Sardhana"}
        owner_conflict = {**matched, "owner_name": "Anita Devi", "khasra_number": "300/4", "khata_number": "900"}
        new_candidate = {**matched, "owner_name": "Mohan Singh", "khasra_number": "999/9", "khata_number": "999", "village": "Naya Gaon"}

        references = []
        with REFERENCE_CSV.open(newline="", encoding="utf-8") as csv_file:
            for row in csv.DictReader(csv_file):
                values = {
                    "owner_name": row["owner_name_english"].strip(),
                    "khasra_number": row["khasra_number"].strip(),
                    "area": row["total_area_hectares"].strip(),
                    "village": row["village"].strip(),
                    "district": row["district"].strip(),
                    "land_classification": row["land_type"].strip(),
                }
                reference = db.query(ReferenceRecord).filter(
                    ReferenceRecord.khasra_number == values["khasra_number"],
                    ReferenceRecord.village == values["village"],
                    ReferenceRecord.district == values["district"],
                    ReferenceRecord.khata_number.is_(None),
                ).first()
                if reference is None:
                    reference = ReferenceRecord(**values)
                    db.add(reference)
                    db.flush()
                else:
                    for field_name, value in values.items():
                        setattr(reference, field_name, value)
                references.append(reference)

        demo_references = [
            ReferenceRecord(**matched),
            ReferenceRecord(**{**area_mismatch, "area": "2.50 Acre", "owner_name": "Suresh Kumar"}),
            ReferenceRecord(**{**owner_conflict, "owner_name": "Ramesh Kumar"}),
        ]
        for reference in demo_references:
            existing = db.query(ReferenceRecord).filter(
                ReferenceRecord.khasra_number == reference.khasra_number,
                ReferenceRecord.khata_number == reference.khata_number,
            ).first()
            if existing is None:
                db.add(reference)
        db.commit()

        ref_area = db.query(ReferenceRecord).filter_by(
            khasra_number=area_mismatch["khasra_number"], khata_number=area_mismatch["khata_number"]
        ).first()
        ref_owner = db.query(ReferenceRecord).filter_by(
            khasra_number=owner_conflict["khasra_number"], khata_number=owner_conflict["khata_number"]
        ).first()

        add_case(db, citizen.id, "case-1-match.pdf", matched, "VALIDATED", matched, {}, {})
        add_case(
            db, citizen.id, "case-2-area-mismatch.pdf", area_mismatch, "VERIFICATION_REQUIRED", ref_area,
            {"area": "MISMATCH"}, {"area": "Extracted area differs from mock reference area"},
        )
        add_case(
            db, citizen.id, "case-3-new-candidate.pdf", new_candidate, "VERIFICATION_REQUIRED", None,
            {field: "NEW_RECORD_CANDIDATE" for field in FIELDS},
            {field: "No matching mock reference record" for field in FIELDS},
        )
        add_case(
            db, citizen.id, "case-4-owner-conflict.pdf", owner_conflict, "VERIFICATION_REQUIRED", ref_owner,
            {"owner_name": "OWNER_CONFLICT"}, {"owner_name": "Owner differs from mock reference record"},
        )
        print("Seeded CITIZEN, VERIFIER, ADMIN users and four demo validation cases.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()