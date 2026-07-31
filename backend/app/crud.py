from sqlalchemy.orm import Session
from app import models, schemas
from app.utils import (
    detect_category,
    detect_priority,
    calculate_sla,
    should_escalate
)


# ==========================================
# CREATE COMPLAINT
# ==========================================

def create_complaint(db: Session, complaint: schemas.ComplaintCreate):

    text = complaint.title + " " + complaint.description

    category = detect_category(text)
    priority = detect_priority(text)
    sla = calculate_sla(priority)

    db_complaint = models.Complaint(
        student_id=complaint.student_id,
        title=complaint.title,
        description=complaint.description,
        category=category,
        priority=priority,
        sla_deadline=sla
    )

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    history = models.ComplaintHistory(
        complaint_id=db_complaint.id,
        action="Complaint Created",
        updated_by=complaint.student_id
    )

    db.add(history)
    db.commit()

    return db_complaint


# ==========================================
# GET ALL COMPLAINTS
# ==========================================

def get_all_complaints(db: Session):

    complaints = db.query(models.Complaint).all()

    for complaint in complaints:

        if should_escalate(complaint.sla_deadline):

            complaint.escalated = True

    db.commit()

    return complaints


# ==========================================
# GET STUDENT COMPLAINTS
# ==========================================

def get_student_complaints(
    db: Session,
    student_id: str
):

    return db.query(
        models.Complaint
    ).filter(
        models.Complaint.student_id == student_id
    ).all()


# ==========================================
# UPDATE COMPLAINT
# ==========================================

def update_complaint(
    db: Session,
    complaint_id: int,
    update: schemas.ComplaintUpdate
):

    complaint = db.query(
        models.Complaint
    ).filter(
        models.Complaint.id == complaint_id
    ).first()

    if not complaint:
        return None

    complaint.status = update.status
    complaint.assigned_staff = update.assigned_staff

    history = models.ComplaintHistory(
        complaint_id=complaint.id,
        action=f"Status changed to {update.status}",
        updated_by=update.assigned_staff
    )

    db.add(history)

    db.commit()

    db.refresh(complaint)

    return complaint


# ==========================================
# DASHBOARD STATISTICS
# ==========================================

def dashboard_stats(db: Session):

    complaints = db.query(models.Complaint).all()

    return {

        "total_complaints": len(complaints),

        "pending": len(
            [c for c in complaints if c.status == "Pending"]
        ),

        "in_progress": len(
            [c for c in complaints if c.status == "In Progress"]
        ),

        "resolved": len(
            [c for c in complaints if c.status == "Resolved"]
        ),

        "escalated": len(
            [c for c in complaints if c.escalated]
        )

    }
    # ==========================================
# SEARCH / FILTER COMPLAINTS
# ==========================================

def filter_complaints(
    db: Session,
    status: str = None,
    category: str = None,
    priority: str = None
):

    query = db.query(models.Complaint)

    if status:
        query = query.filter(
            models.Complaint.status == status
        )

    if category:
        query = query.filter(
            models.Complaint.category == category
        )

    if priority:
        query = query.filter(
            models.Complaint.priority == priority
        )

    return query.all()