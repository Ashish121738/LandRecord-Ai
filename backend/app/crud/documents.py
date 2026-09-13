from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.document import Document


def create_document(
    db: Session,
    filename: str,
    file_path: str,
    file_type: str,
    uploaded_by: int,
) -> Document:
    document = Document(
        filename=filename,
        file_path=file_path,
        file_type=file_type,
        uploaded_by=uploaded_by,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def update_document_ocr(
    db: Session,
    document_id: int,
    ocr_text: str,
    ocr_confidence: Optional[float],
    status: str,
) -> Optional[Document]:
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        return None
    document.ocr_text = ocr_text
    document.ocr_confidence = ocr_confidence
    document.status = status
    document.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(document)
    return document


def update_document_status(db: Session, document_id: int, status: str) -> Optional[Document]:
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        return None
    document.status = status
    document.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(document)
    return document