from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from fastapi import FastAPI

# 1. Load the variables from the .env file immediately
load_dotenv()

# 2. Initialize your FastAPI app
app = FastAPI()
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. ADD THIS IMPORT

# (Keep any other imports you already had here, like your routers)

load_dotenv()

app = FastAPI()

# <-- 2. ADD THIS ENTIRE BLOCK HERE -->
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# <-- 3. DO NOT TOUCH ANYTHING BELOW THIS LINE -->
# Keep all your existing code down here! 
# (e.g., app.include_router(user.router), app.include_router(admin.router), etc.)

# ... (The rest of your existing main.py code, like app.include_router, goes here) ...
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import user, admin

# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)

# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="Campus Grievance Redressal & Maintenance Tracker",
    version="1.0.0",
    description="Backend API for Hackathon Project"
)

# ==========================================
# ENABLE CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Later replace with React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# INCLUDE ROUTES
# ==========================================

app.include_router(user.router)
app.include_router(admin.router)

# ==========================================
# HOME PAGE
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Welcome to Campus Grievance Redressal API",
        "docs": "/docs"
    }