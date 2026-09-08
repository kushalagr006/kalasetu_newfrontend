import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole:
    ARTISAN = "ARTISAN"
    CUSTOMER_INDIVIDUAL = "CUSTOMER_INDIVIDUAL"
    CUSTOMER_BULK = "CUSTOMER_BULK"
    CUSTOMER_GOVT = "CUSTOMER_GOVT"
    ADMIN = "ADMIN"

class VerificationStatus:
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    firebase_uid = Column(String(128), unique=True, index=True, nullable=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default=UserRole.ARTISAN)
    preferred_language = Column(String(10), default="hi")
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    artisan_profile = relationship("ArtisanProfile", back_populates="user", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    products = relationship("Product", back_populates="artisan", cascade="all, delete-orphan", lazy="selectin")


class ArtisanProfile(Base):
    __tablename__ = "artisan_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    aadhaar_number = Column(String(20), nullable=True)
    pan_number = Column(String(20), nullable=True)
    gstin = Column(String(30), nullable=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    craft_category = Column(String(100), nullable=False)
    craft_type = Column(String(100), nullable=False)
    verification_status = Column(String(50), default=VerificationStatus.PENDING)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="artisan_profile", lazy="selectin")


class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    buyer_category = Column(String(50), nullable=False)  # INDIVIDUAL, BULK, GOVT
    organization_name = Column(String(255), nullable=True)
    department_name = Column(String(255), nullable=True)
    department_id = Column(String(100), nullable=True)
    aadhaar_number = Column(String(20), nullable=True)
    pan_number = Column(String(20), nullable=True)
    gstin = Column(String(30), nullable=True)
    address = Column(Text, nullable=True)
    verification_status = Column(String(50), default=VerificationStatus.PENDING)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="buyer_profile", lazy="selectin")
