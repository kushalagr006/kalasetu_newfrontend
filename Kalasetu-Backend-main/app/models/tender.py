import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class TenderStatus:
    OPEN = "OPEN"
    IN_REVIEW = "IN_REVIEW"
    AWARDED = "AWARDED"
    CLOSED = "CLOSED"
    CANCELLED = "CANCELLED"

class QuotationStatus:
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class Tender(Base):
    __tablename__ = "tenders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    buyer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    quantity_required = Column(Integer, nullable=False)
    delivery_location = Column(String(255), nullable=False)
    delivery_address = Column(Text, nullable=False)
    buyer_type = Column(String(50), nullable=False)  # BULK, GOVT
    additional_requirements = Column(Text, nullable=True)
    reference_image_url = Column(String(500), nullable=True)
    status = Column(String(50), default=TenderStatus.OPEN)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=True)

    buyer = relationship("User", foreign_keys=[buyer_id], lazy="selectin")
    quotations = relationship("Quotation", back_populates="tender", cascade="all, delete-orphan", lazy="selectin")


class QuotationRequest(Base):
    __tablename__ = "quotation_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    requested_quantity = Column(Integer, default=1)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    customer = relationship("User", foreign_keys=[customer_id], lazy="selectin")
    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
    product = relationship("Product", lazy="selectin")
    quotation = relationship("Quotation", back_populates="quotation_request", uselist=False, lazy="selectin")


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("quotation_requests.id"), nullable=True)
    tender_id = Column(String(36), ForeignKey("tenders.id"), nullable=True)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    quantity_available = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    production_time_days = Column(Integer, nullable=False)
    additional_notes = Column(Text, nullable=True)
    status = Column(String(50), default=QuotationStatus.SUBMITTED)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    quotation_request = relationship("QuotationRequest", back_populates="quotation", lazy="selectin")
    tender = relationship("Tender", back_populates="quotations", lazy="selectin")
    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
