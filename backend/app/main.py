from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.api import auth, records, upload
from app import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Land Record AI Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes ko clean prefix aur tags ke saath include karein
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(upload.router, prefix="/upload", tags=["Upload & Process"])
app.include_router(records.router, prefix="/records", tags=["Verification"])

@app.get("/")
def root():
    return {"message": "Land Record AI API is running!"}