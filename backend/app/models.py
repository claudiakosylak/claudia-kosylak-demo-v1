from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(30), nullable=True)
    last_name = Column(String(30), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"