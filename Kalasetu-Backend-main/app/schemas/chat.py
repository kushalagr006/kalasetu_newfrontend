from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserOut


class ChatMessageCreate(BaseModel):
    thread_id: str
    message_text: str
    attachment_url: Optional[str] = None


class ChatMessageOut(BaseModel):
    id: str
    thread_id: str
    sender_id: str
    message_text: str
    attachment_url: Optional[str] = None
    translated_text: Optional[str] = None
    is_read: bool
    created_at: datetime
    sender: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)


class ChatThreadOut(BaseModel):
    id: str
    artisan_id: str
    buyer_id: str
    context_type: str
    context_id: str
    allow_phone_exchange: bool
    created_at: datetime
    updated_at: datetime
    artisan: Optional[UserOut] = None
    buyer: Optional[UserOut] = None
    latest_message: Optional[ChatMessageOut] = None

    model_config = ConfigDict(from_attributes=True)
