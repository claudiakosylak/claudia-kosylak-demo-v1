from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from .database import get_db
from .auth import verify_token
from .models import User, UserRole

def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current user from JWT token in HTTP-only cookie"""
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    user_id = verify_token(token)
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

def get_admin_user(current_user: User = Depends(get_current_user)):
    """Ensure current user is an admin"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user