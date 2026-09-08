import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())


class ChatThread(Base):
    __tablename__ = "chat_threads"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    artisan_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    buyer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    context_type = Column(String(50), nullable=False)  # QUOTATION, TENDER, ORDER
    context_id = Column(String(36), nullable=False)
    allow_phone_exchange = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    artisan = relationship("User", foreign_keys=[artisan_id], lazy="selectin")
    buyer = relationship("User", foreign_keys=[buyer_id], lazy="selectin")
    messages = relationship("ChatMessage", back_populates="thread", cascade="all, delete-orphan", lazy="selectin")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    thread_id = Column(String(36), ForeignKey("chat_threads.id"), nullable=False)
    sender_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    message_text = Column(Text, nullable=False)
    attachment_url = Column(String(500), nullable=True)
    translated_text = Column(Text, nullable=True)  # JSON string of translations
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    thread = relationship("ChatThread", back_populates="messages", lazy="selectin")
    sender = relationship("User", foreign_keys=[sender_id], lazy="selectin")
