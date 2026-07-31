from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ==========================================
# VIEW ALL COMPLAINTS
# ==========================================

@router.get(
    "/complaints",
    response_model=list[schemas.ComplaintResponse]
)
def get_all_complaints(
    db: Session = Depends(get_db)
):

    return crud.get_all_complaints(db)


# ==========================================
# UPDATE COMPLAINT
# ==========================================

@router.put(
    "/complaints/{complaint_id}",
    response_model=schemas.ComplaintResponse
)
def update_complaint(
    complaint_id: int,
    update: schemas.ComplaintUpdate,
    db: Session = Depends(get_db)
):

    complaint = crud.update_complaint(
        db,
        complaint_id,
        update
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint


# ==========================================
# DASHBOARD STATISTICS
# ==========================================

@router.get(
    "/dashboard",
    response_model=schemas.DashboardStats
)
def dashboard(
    db: Session = Depends(get_db)
):

    return crud.dashboard_stats(db)
# ==========================================
# SEARCH / FILTER
# ==========================================

@router.get(
    "/search",
    response_model=list[schemas.ComplaintResponse]
)
def search_complaints(
    status: str = None,
    category: str = None,
    priority: str = None,
    db: Session = Depends(get_db)
):

    return crud.filter_complaints(
        db,
        status,
        category,
        priority
    )