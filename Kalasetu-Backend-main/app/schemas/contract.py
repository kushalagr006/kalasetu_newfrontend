from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserOut
from app.schemas.tender import QuotationOut


class ContractSignRequest(BaseModel):
    digital_signature: str


class ContractOut(BaseModel):
    id: str
    quotation_id: str
    artisan_id: str
    buyer_id: str
    contract_title: str
    terms_and_conditions: str
    artisan_signed: Optional[str] = None
    artisan_signed_at: Optional[datetime] = None
    buyer_signed: Optional[str] = None
    buyer_signed_at: Optional[datetime] = None
    pdf_url: Optional[str] = None
    status: str
    created_at: datetime
    quotation: Optional[QuotationOut] = None
    artisan: Optional[UserOut] = None
    buyer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
