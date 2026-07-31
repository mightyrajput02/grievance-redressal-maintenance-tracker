from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import uvicorn

# ==========================================
# 1. DATABASE SETUP
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./grievance_tracker.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# 2. DATABASE MODELS
# ==========================================
class ComplaintDB(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True) # Identifies which student logged it
    title = Column(String)
    description = Column(String)
    category = Column(String) 
    status = Column(String, default="Pending")
    assigned_staff = Column(String, default="Unassigned")

Base.metadata.create_all(bind=engine)

# ==========================================
# 3. PYDANTIC SCHEMAS (Data Validation)
# ==========================================
class ComplaintCreate(BaseModel):
    student_id: str
    title: str
    description: str

class ComplaintUpdateAdmin(BaseModel):
    status: str
    assigned_staff: str

class ComplaintResponse(BaseModel):
    id: int
    student_id: str
    title: str
    description: str
    category: str
    status: str
    assigned_staff: str

    class Config:
        from_attributes = True

# ==========================================
# 4. MOCK NLP FUNCTION
# ==========================================
def categorize_nlp(text: str) -> str:
    text = text.lower()
    if any(word in text for word in ["power", "light", "fan", "electricity"]):
        return "Electrical"
    elif any(word in text for word in ["water", "leak", "plumbing", "washroom"]):
        return "Plumbing"
    elif any(word in text for word in ["wifi", "internet", "network"]):
        return "IT"
    return "General Maintenance"

# ==========================================
# 5. FASTAPI APP & CORS SETUP
# ==========================================
app = FastAPI(title="Grievance Tracker API")

# Allow the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 6. USER PORTAL ROUTES
# ==========================================
@app.post("/user/complaints/", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    """User Portal: Register a new complaint"""
    category = categorize_nlp(complaint.description)
    
    db_complaint = ComplaintDB(
        student_id=complaint.student_id,
        title=complaint.title, 
        description=complaint.description,
        category=category
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/user/complaints/{student_id}", response_model=list[ComplaintResponse])
def get_user_complaints(student_id: str, db: Session = Depends(get_db)):
    """User Portal: Get only the complaints for a specific student"""
    return db.query(ComplaintDB).filter(ComplaintDB.student_id == student_id).all()

# ==========================================
# 7. ADMIN PORTAL ROUTES
# ==========================================
@app.get("/admin/complaints/", response_model=list[ComplaintResponse])
def get_all_complaints(db: Session = Depends(get_db)):
    """Admin Portal: View all complaints from all students"""
    return db.query(ComplaintDB).all()

@app.put("/admin/complaints/{complaint_id}", response_model=ComplaintResponse)
def update_complaint_status(complaint_id: int, update_data: ComplaintUpdateAdmin, db: Session = Depends(get_db)):
    """Admin Portal: Assign staff and update ticket status"""
    db_complaint = db.query(ComplaintDB).filter(ComplaintDB.id == complaint_id).first()
    
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    db_complaint.status = update_data.status
    db_complaint.assigned_staff = update_data.assigned_staff
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)