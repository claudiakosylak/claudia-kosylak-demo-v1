from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, asc, desc
from typing import Optional
from ..database import get_db
from ..schemas import User, UserUpdate, UserListResponse
from ..models import User as UserModel
from ..dependencies import get_current_user, get_admin_user
import math

router = APIRouter()

# Define allowed sort fields
ALLOWED_SORT_FIELDS = ['id', 'email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at']

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user by ID - users can only access their own profile"""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's profile"
        )

    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user

@router.patch("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile - users can only update their own profile"""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's profile"
        )

    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update user fields
    user.first_name = user_update.first_name
    user.last_name = user_update.last_name

    db.commit()
    db.refresh(user)

    return user

@router.get("/", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("first_name", description="Sort field"),
    sort_direction: str = Query("asc", regex="^(asc|desc)$", description="Sort direction"),
    current_user: UserModel = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users with pagination - admin only"""

    # Validate sort_by field
    if sort_by not in ALLOWED_SORT_FIELDS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid sort field. Allowed fields: {', '.join(ALLOWED_SORT_FIELDS)}"
        )

    # Build query
    query = db.query(UserModel)

    # Apply sorting
    sort_column = getattr(UserModel, sort_by)

    if sort_direction == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    # Get total count
    total = query.count()

    # Apply pagination
    offset = (page - 1) * page_size
    users = query.offset(offset).limit(page_size).all()

    # Calculate total pages
    total_pages = math.ceil(total / page_size)

    return UserListResponse(
        users=users,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
