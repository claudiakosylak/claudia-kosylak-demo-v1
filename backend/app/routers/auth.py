import os
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import GoogleLoginRequest, LoginResponse, LogoutResponse
from ..models import User, UserRole
from ..auth import verify_google_token, create_access_token
from ..utils import verify_domain, is_admin_email
from ..dependencies import get_current_user

router = APIRouter()
security = HTTPBearer()

@router.post("/login", response_model=LoginResponse)
async def login(
    login_request: GoogleLoginRequest, 
    response: Response,
    db: Session = Depends(get_db)
):
    """Login with Google OAuth token"""
    try:
        # Verify Google token
        user_info = verify_google_token(login_request.token)
        email = user_info['email']
        
        # Check if email domain is allowed
        if not verify_domain(email):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email domain not allowed. Please contact an administrator."
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            role = UserRole.ADMIN if is_admin_email(email) else UserRole.CLIENT
            user = User(
                email=email,
                first_name=user_info.get('first_name'),
                last_name=user_info.get('last_name'),
                role=role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            message = "Account created successfully! Welcome!"
        else:
            # Update existing user info if needed
            updated = False
            if user_info.get('first_name') and not user.first_name:
                user.first_name = user_info['first_name']
                updated = True
            if user_info.get('last_name') and not user.last_name:
                user.last_name = user_info['last_name']
                updated = True
            
            # Ensure admin emails have admin role
            if is_admin_email(email) and user.role != UserRole.ADMIN:
                user.role = UserRole.ADMIN
                updated = True
            
            if updated:
                db.commit()
                db.refresh(user)
            
            message = "Welcome back!"
        
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        # Set HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            secure=os.getenv("ENVIRONMENT") == "production",  # HTTPS in production
            samesite="lax",
            max_age=24 * 60 * 60  # 24 hours
        )
        
        return LoginResponse(user=user, message=message)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/logout", response_model=LogoutResponse)
async def logout(response: Response):
    """Logout user and clear cookie"""
    response.delete_cookie(key="access_token")
    return LogoutResponse(message="Successfully logged out")

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user