from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class GovernmentSchemeCreate(BaseModel):
    title: str
    description: str
    eligibility_criteria: str
    benefits: str
    target_craft_categories: Optional[str] = None
    target_states: Optional[str] = None
    apply_link: Optional[str] = None


class GovernmentSchemeOut(BaseModel):
    id: str
    title: str
    description: str
    eligibility_criteria: str
    benefits: str
    target_craft_categories: Optional[str] = None
    target_states: Optional[str] = None
    apply_link: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    notification_type: str
    reference_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    order_id: str
    rating: int
    review_text: str


class ReviewOut(BaseModel):
    id: str
    order_id: str
    customer_id: str
    artisan_id: str
    rating: int
    review_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
