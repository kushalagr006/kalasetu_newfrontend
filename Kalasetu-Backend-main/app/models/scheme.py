import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    eligibility_criteria = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    target_craft_categories = Column(Text, nullable=True)  # Comma-separated or JSON string
    target_states = Column(Text, nullable=True)            # Comma-separated or JSON string
    apply_link = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False)  # SCHEME, QUOTATION, TENDER, ORDER, REVIEW
    reference_id = Column(String(36), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", lazy="selectin")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), unique=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    review_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    order = relationship("Order", back_populates="review", lazy="selectin")
    customer = relationship("User", foreign_keys=[customer_id], lazy="selectin")
    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
