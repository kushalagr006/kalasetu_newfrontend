from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserOut


class OrderStatusLogOut(BaseModel):
    id: str
    status: str
    updated_by_id: str
    note: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderUpdateStatusRequest(BaseModel):
    status: str
    note: Optional[str] = None


class RazorpayPaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class OrderOut(BaseModel):
    id: str
    contract_id: Optional[str] = None
    quotation_id: Optional[str] = None
    artisan_id: str
    buyer_id: str
    order_type: str
    total_amount: float
    status: str
    payment_status: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    ondc_tracking_id: Optional[str] = None
    ondc_shipment_status: Optional[str] = None
    shipping_address: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    artisan: Optional[UserOut] = None
    buyer: Optional[UserOut] = None
    status_logs: List[OrderStatusLogOut] = []

    model_config = ConfigDict(from_attributes=True)
