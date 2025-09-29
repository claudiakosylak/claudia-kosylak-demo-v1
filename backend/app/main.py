import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import create_tables
from .routers import auth, users
from .models import User
from .database import SessionLocal

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Claudia Kosylak Demo API",
    description="FastAPI backend with Google OAuth and user management",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "https://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and seed admin users"""
    # Create tables
    create_tables()

    # Seed admin users
    admin_emails = os.getenv("ADMIN_EMAILS", "").split(",")
    admin_emails = [email.strip() for email in admin_emails if email.strip()]

    if admin_emails:
        db = SessionLocal()
        try:
            for email in admin_emails:
                # Check if user already exists
                existing_user = db.query(User).filter(User.email == email).first()
                if not existing_user:
                    # Create admin user
                    admin_user = User(
                        email=email,
                        role="admin",
                        first_name=None,  # Will be set when user logs in
                        last_name=None
                    )
                    db.add(admin_user)
                else:
                    # Update existing user to admin if not already
                    if existing_user.role != "admin":
                        existing_user.role = "admin"

            db.commit()
            print(f"Seeded {len(admin_emails)} admin users")
        except Exception as e:
            print(f"Error seeding admin users: {e}")
            db.rollback()
        finally:
            db.close()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Claudia Kosylak Demo API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
