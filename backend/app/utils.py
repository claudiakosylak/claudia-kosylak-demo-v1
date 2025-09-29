import os
from typing import List
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_domain(email: str) -> bool:
    """Check if email domain is in allowed domains"""
    allowed_domains = os.getenv("ALLOWED_DOMAINS", "").split(",")
    allowed_domains = [domain.strip() for domain in allowed_domains if domain.strip()]
    
    if not allowed_domains:
        return True  # If no domains specified, allow all
    
    email_domain = email.split("@")[1].lower()
    return email_domain in [domain.lower() for domain in allowed_domains]

def is_admin_email(email: str) -> bool:
    """Check if email is in admin emails list"""
    admin_emails = os.getenv("ADMIN_EMAILS", "").split(",")
    admin_emails = [email.strip().lower() for email in admin_emails if email.strip()]
    return email.lower() in admin_emails