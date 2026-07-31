# 1. Imports go at the very top
import os
import requests
import shutil
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session

# 2. Initialize the router
router = APIRouter()

# 3. Get the URL from your .env file
APEX_URL = os.getenv("APEX_ORDS_URL")

# 4. Define the route (Notice the @router.get directly above the function)
@router.get("/apex-data")
def get_data_from_apex():
    try:
        # Make the HTTP GET request to the APEX database
        response = requests.get(APEX_URL, timeout=10)
        
        # Raise an exception if APEX returns a 4xx or 5xx error code
        response.raise_for_status()
        
        # FastAPI automatically serializes this dictionary into a JSON response
        return response.json()

    except requests.exceptions.HTTPError as http_err:
        raise HTTPException(
            status_code=response.status_code, 
            detail=f"APEX Database Error: {str(http_err)}"
        )
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503, 
            detail="Could not connect to APEX. The database may be offline."
        )