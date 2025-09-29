from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional, List
from .models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    
    @validator('first_name', 'last_name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v) > 30:
            raise ValueError('Name must not exceed 30 characters')
        if not v.replace(' ', '').isalpha():
            raise ValueError('Name must contain only alphabetical characters')
        return v.strip()

class User(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[User]
    total: int
    page: int
    page_size: int
    total_pages: int

# Auth schemas
class GoogleLoginRequest(BaseModel):
    token: str

class LoginResponse(BaseModel):
    user: User
    message: str

class LogoutResponse(BaseModel):
    message: str