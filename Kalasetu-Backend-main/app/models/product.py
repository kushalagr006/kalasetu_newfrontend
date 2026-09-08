import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ProductStatus:
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    UNAVAILABLE = "UNAVAILABLE"


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    material_used = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False)
    recommended_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=1)
    status = Column(String(50), default=ProductStatus.PUBLISHED)
    audio_note_url = Column(String(500), nullable=True)
    ai_enhanced = Column(Boolean, default=False)
    title_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)
    category_en = Column(String(100), nullable=True)
    material_used_en = Column(String(100), nullable=True)
    source_language = Column(String(10), default="hi")
    translations_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    artisan = relationship("User", back_populates="products", lazy="selectin")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", lazy="selectin")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    original_url = Column(String(500), nullable=False)
    enhanced_url = Column(String(500), nullable=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="images", lazy="selectin")
