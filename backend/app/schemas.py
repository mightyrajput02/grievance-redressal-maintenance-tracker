from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ==========================================
# STUDENT CREATES A COMPLAINT
# ==========================================

class ComplaintCreate(BaseModel):
    student_id: str = Field(..., example="22CS101")
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=10)


# ==========================================
# ADMIN UPDATES A COMPLAINT
# ==========================================

class ComplaintUpdate(BaseModel):
    status: str
    assigned_staff: str


# ==========================================
# COMPLAINT RESPONSE
# ==========================================

class ComplaintResponse(BaseModel):
    id: int
    student_id: str
    title: str
    description: str
    category: str
    priority: str
    status: str
    assigned_staff: str
    attachment: Optional[str]
    created_at: datetime
    updated_at: datetime
    sla_deadline: datetime
    escalated: bool

    class Config:
        from_attributes = True


# ==========================================
# DASHBOARD RESPONSE
# ==========================================

class DashboardStats(BaseModel):
    total_complaints: int
    pending: int
    in_progress: int
    resolved: int
    escalated: int