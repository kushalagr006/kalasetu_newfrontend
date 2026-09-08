from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserOut
from app.schemas.product import ProductOut


class TenderCreate(BaseModel):
    product_name: str
    quantity_required: int
    delivery_location: str
    delivery_address: str
    buyer_type: str  # BULK, GOVT
    additional_requirements: Optional[str] = None
    reference_image_url: Optional[str] = None


class TenderOut(BaseModel):
    id: str
    buyer_id: str
    product_name: str
    quantity_required: int
    delivery_location: str
    delivery_address: str
    buyer_type: str
    additional_requirements: Optional[str] = None
    reference_image_url: Optional[str] = None
    status: str
    created_at: datetime
    buyer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)


class QuotationRequestCreate(BaseModel):
    artisan_id: str
    product_id: str
    requested_quantity: int = 1
    notes: Optional[str] = None


class QuotationRequestOut(BaseModel):
    id: str
    customer_id: str
    artisan_id: str
    product_id: str
    requested_quantity: int
    notes: Optional[str] = None
    status: str
    created_at: datetime
    product: Optional[ProductOut] = None
    customer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)


class QuotationCreate(BaseModel):
    request_id: Optional[str] = None
    tender_id: Optional[str] = None
    quantity_available: int
    price_per_unit: float
    production_time_days: int
    additional_notes: Optional[str] = None


class QuotationOut(BaseModel):
    id: str
    request_id: Optional[str] = None
    tender_id: Optional[str] = None
    artisan_id: str
    quantity_available: int
    price_per_unit: float
    total_price: float
    production_time_days: int
    additional_notes: Optional[str] = None
    status: str
    created_at: datetime
    artisan: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
