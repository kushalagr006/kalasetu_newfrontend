import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ContractStatus:
    DRAFT = "DRAFT"
    PENDING_SIGNATURES = "PENDING_SIGNATURES"
    EXECUTED = "EXECUTED"
    CANCELLED = "CANCELLED"


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    quotation_id = Column(String(36), ForeignKey("quotations.id"), unique=True, nullable=False)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    buyer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    contract_title = Column(String(255), nullable=False)
    terms_and_conditions = Column(Text, nullable=False)
    artisan_signed = Column(String(128), nullable=True)  # Hash / Timestamp signature
    artisan_signed_at = Column(DateTime(timezone=True), nullable=True)
    buyer_signed = Column(String(128), nullable=True)  # Hash / Timestamp signature
    buyer_signed_at = Column(DateTime(timezone=True), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    status = Column(String(50), default=ContractStatus.PENDING_SIGNATURES)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    quotation = relationship("Quotation", lazy="selectin")
    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
    buyer = relationship("User", foreign_keys=[buyer_id], lazy="selectin")
