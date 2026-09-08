from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class ProductImageOut(BaseModel):
    id: str
    original_url: str
    enhanced_url: Optional[str] = None
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    title: str
    description: str
    category: str
    material_used: str
    price: float
    stock_quantity: int = 1
    audio_note_url: Optional[str] = None
    primary_image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    material_used: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    status: Optional[str] = None


class ProductOut(BaseModel):
    id: str
    artisan_id: str
    title: str
    description: str
    category: str
    material_used: str
    price: float
    recommended_price: Optional[float] = None
    stock_quantity: int
    status: str
    audio_note_url: Optional[str] = None
    ai_enhanced: bool
    created_at: datetime
    images: List[ProductImageOut] = []

    model_config = ConfigDict(from_attributes=True)


class SpeechCatalogParseRequest(BaseModel):
    audio_url: Optional[str] = None
    voice_text: Optional[str] = None
    source_language: str = "hi"
