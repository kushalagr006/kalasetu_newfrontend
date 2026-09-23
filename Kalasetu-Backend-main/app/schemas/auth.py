from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: Optional[str] = None
    is_verified: bool
    artisan_profile: Optional[dict] = None


class PhoneCheckRequest(BaseModel):
    phone_number: str


class PhoneCheckResponse(BaseModel):
    is_registered: bool
    user_id: Optional[str] = None
    full_name: Optional[str] = None


class OTPRequestPayload(BaseModel):
    phone_number: str


class OTPRequestResponse(BaseModel):
    message: str
    phone_number: str
    demo_otp: Optional[str] = None


class OTPVerifyLoginPayload(BaseModel):
    phone_number: str
    otp_code: str


class ArtisanRegistrationRequest(BaseModel):
    phone_number: str
    full_name: str
    aadhaar_number: str = Field(..., min_length=12, max_length=12)
    pan_number: str = Field(..., min_length=10, max_length=10)
    gstin: Optional[str] = None
    state: str
    district: str
    city: str
    craft_category: str
    craft_type: str
    preferred_language: str = "hi"


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
