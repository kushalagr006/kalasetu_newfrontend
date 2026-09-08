import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class OrderStatus:
    CONTRACT_SIGNED = "CONTRACT_SIGNED"
    IN_PRODUCTION = "IN_PRODUCTION"
    READY_FOR_DISPATCH = "READY_FOR_DISPATCH"
    DISPATCHED = "DISPATCHED"
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PaymentStatus:
    PENDING = "PENDING"
    ESCROW_HELD = "ESCROW_HELD"
    RELEASED = "RELEASED"
    REFUNDED = "REFUNDED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contract_id = Column(String(36), ForeignKey("contracts.id"), nullable=True)
    quotation_id = Column(String(36), ForeignKey("quotations.id"), nullable=True)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    buyer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    order_type = Column(String(50), nullable=False, default="B2C_DIRECT")  # B2C_DIRECT, BULK_TENDER, GOVT_PROCUREMENT
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default=OrderStatus.CONTRACT_SIGNED)
    payment_status = Column(String(50), default=PaymentStatus.PENDING)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    ondc_tracking_id = Column(String(100), nullable=True)
    ondc_shipment_status = Column(String(100), default="CREATED")
    shipping_address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
    buyer = relationship("User", foreign_keys=[buyer_id], lazy="selectin")
    status_logs = relationship("OrderStatusLog", back_populates="order", cascade="all, delete-orphan", lazy="selectin")
    review = relationship("Review", back_populates="order", uselist=False, lazy="selectin")


class OrderStatusLog(Base):
    __tablename__ = "order_status_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    status = Column(String(50), nullable=False)
    updated_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    order = relationship("Order", back_populates="status_logs", lazy="selectin")
