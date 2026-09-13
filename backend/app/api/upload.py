import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document, DocumentStatus
from app.models.user import User
from app.api.deps import get_current_user
from app.core.ai import extract_land_record_data 
from app.crud.records import create_land_record
from app.crud.validation import compare_with_reference, save_field_results, save_validation_results

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _normalize_extracted_data(extracted_data):
    confidence_map = extracted_data.get("field_confidence")
    if not isinstance(confidence_map, dict):
        confidence_map = extracted_data.get("confidence", {})
    if not isinstance(confidence_map, dict):
        confidence_map = {}
    normalized = {}
    confidences = {}

    for field_name, raw_value in extracted_data.items():
        if field_name in {"error", "status", "confidence", "field_confidence"}:
            continue

        confidence = confidence_map.get(field_name)
        value = raw_value
        if isinstance(raw_value, dict):
            value = raw_value.get("value", raw_value.get("extracted_value"))
            confidence = raw_value.get("confidence", confidence)

        if field_name == "total_area":
            field_name = "area"
        normalized[field_name] = value
        confidences[field_name] = confidence

    return normalized, confidences

@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    allowed_extensions = [".pdf", ".png", ".jpg", ".jpeg"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF or Image files are allowed")

    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    new_doc = Document(
        filename=file.filename,
        file_path=file_path,
        file_type=file_ext.lstrip("."),
        uploaded_by=current_user.id,
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "message": "File successfully uploaded and linked to your account!",
        "document_id": new_doc.id,
        "owner_name": current_user.name
    }

@router.get("/my-documents")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.uploaded_by == current_user.id).all()
    
    return {
        "total": len(documents),
        "documents": [
            {
                "id": doc.id,
                "original_filename": doc.filename,
                "saved_filename": os.path.basename(doc.file_path),
                "status": doc.status,
                "created_at": str(doc.created_at),
            }
            for doc in documents
        ]
    }

@router.post("/{document_id}/extract")
def extract_document_data(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == document_id, 
        Document.uploaded_by == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    extracted_data = extract_land_record_data(document.file_path)
    
    validation_results = []
    validation_status = DocumentStatus.EXTRACTION_COMPLETED
    if "error" not in extracted_data:
        normalized_data, confidences = _normalize_extracted_data(extracted_data)
        record = document.land_record
        if record is None:
            record = create_land_record(db, document.id, normalized_data)
            validation_results, validation_status = compare_with_reference(db, normalized_data)
            field_results = [
                {
                    "field_name": field_name,
                    "extracted_value": value,
                    "confidence": confidences.get(field_name),
                    "validation_status": next(
                        result["status"]
                        for result in validation_results
                        if result["field_name"] == field_name
                    ),
                }
                for field_name, value in normalized_data.items()
                if value is not None
            ]
            save_field_results(db, record.id, field_results)
            save_validation_results(db, record.id, validation_results)
        document.status = validation_status
        document.ocr_text = str(extracted_data)
        db.commit()
        
    return {
        "message": "AI Extraction Complete",
        "document_id": document.id,
        "record_id": document.land_record.id if document.land_record else None,
        "status": document.status,
        "validation_results": validation_results,
        "extracted_info": extracted_data,
    }