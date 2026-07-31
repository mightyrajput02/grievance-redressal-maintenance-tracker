from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from app.database import Base


# ============================
# COMPLAINT TABLE
# ============================

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String, nullable=False)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    category = Column(String, default="General")

    priority = Column(String, default="Low")

    status = Column(String, default="Pending")

    assigned_staff = Column(String, default="Not Assigned")

    attachment = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    sla_deadline = Column(
        DateTime,
        default=lambda: datetime.utcnow() + timedelta(days=2)
    )

    escalated = Column(Boolean, default=False)

    history = relationship(
        "ComplaintHistory",
        back_populates="complaint",
        cascade="all, delete"
    )


# ============================
# COMPLAINT HISTORY TABLE
# ============================

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Integer, primary_key=True, index=True)

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id")
    )

    action = Column(String)

    updated_by = Column(String)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    complaint = relationship(
        "Complaint",
        back_populates="history"
    )