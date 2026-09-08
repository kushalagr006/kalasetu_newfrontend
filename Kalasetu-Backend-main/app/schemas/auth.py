from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    is_verified: bool


class FirebaseOTPVerifyRequest(BaseModel):
    id_token: str
    phone_number: str


# --- Artisan Signup ---
class ArtisanSignupStep1(BaseModel):
    phone_number: str
    aadhaar_number: str = Field(..., min_length=12, max_length=12)
    pan_number: str = Field(..., min_length=10, max_length=10)
    gstin: Optional[str] = None


class ArtisanSignupStep2(BaseModel):
    full_name: str
    state: str
    district: str
    city: str
    craft_category: str
    craft_type: str
    preferred_language: str = "hi"


# --- B2C Individual Customer Signup ---
class CustomerB2CSignup(BaseModel):
    full_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    preferred_language: str = "hi"


# --- Bulk Buyer Signup ---
class BulkBuyerSignup(BaseModel):
    organization_name: str
    full_name: str
    phone_number: str
    email: EmailStr
    aadhaar_number: str
    pan_number: str
    gstin: str
    address: str
    preferred_language: str = "en"


# --- Government Buyer Signup ---
class GovtBuyerSignup(BaseModel):
    department_name: str
    department_id: str
    full_name: str
    phone_number: str
    govt_email: EmailStr
    pan_number: Optional[str] = None
    gstin: Optional[str] = None
    address: str
    preferred_language: str = "en"


class LoginRequest(BaseModel):
    phone_number: str
    password: Optional[str] = None
    otp_code: Optional[str] = None
