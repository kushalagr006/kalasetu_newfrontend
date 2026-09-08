from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ArtisanProfileOut(BaseModel):
    id: str
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    gstin: Optional[str] = None
    state: str
    district: str
    city: str
    craft_category: str
    craft_type: str
    verification_status: str

    model_config = ConfigDict(from_attributes=True)


class BuyerProfileOut(BaseModel):
    id: str
    buyer_category: str
    organization_name: Optional[str] = None
    department_name: Optional[str] = None
    department_id: Optional[str] = None
    verification_status: str
    address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserOut(BaseModel):
    id: str
    phone_number: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    preferred_language: str
    is_verified: bool
    created_at: datetime
    artisan_profile: Optional[ArtisanProfileOut] = None
    buyer_profile: Optional[BuyerProfileOut] = None

    model_config = ConfigDict(from_attributes=True)
