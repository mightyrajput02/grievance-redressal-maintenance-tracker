from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# ===============================
# DATABASE CONFIGURATION
# ===============================

# SQLite database file
DATABASE_URL = "sqlite:///./grievance_tracker.db"

# Create the database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create a database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all database models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()