from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import (
    verify_firebase_otp_token,
    create_access_token,
    get_password_hash,
    verify_password,
    get_current_user
)
from app.models.user import User, ArtisanProfile, BuyerProfile, UserRole, VerificationStatus
from app.schemas.auth import (
    Token,
    ArtisanSignupStep1,
    ArtisanSignupStep2,
    CustomerB2CSignup,
    BulkBuyerSignup,
    GovtBuyerSignup,
    LoginRequest,
    FirebaseOTPVerifyRequest
)
from app.schemas.user import UserOut
from app.services.verification import verify_aadhaar_mock, verify_pan_mock, verify_gstin_mock

router = APIRouter()


@router.post("/verify-otp", response_model=Token)
async def verify_otp(payload: FirebaseOTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Verifies Firebase OTP Token. If user exists, returns JWT; otherwise creates pending user session.
    """
    decoded = verify_firebase_otp_token(payload.id_token)
    phone = payload.phone_number

    result = await db.execute(select(User).where(User.phone_number == phone))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            firebase_uid=decoded.get("uid"),
            phone_number=phone,
            role=UserRole.ARTISAN,
            is_verified=False
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "is_verified": user.is_verified
    }


@router.post("/signup/artisan/step1")
async def artisan_signup_step1(
    payload: ArtisanSignupStep1,
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan Signup Page 1 – Identity Verification (Mobile OTP, Aadhaar, PAN, GSTIN optional)
    """
    # Aadhaar check
    aadhaar_res = verify_aadhaar_mock(payload.aadhaar_number)
    if not aadhaar_res["is_valid"]:
        raise HTTPException(status_code=400, detail=aadhaar_res["message"])

    # PAN check
    pan_res = verify_pan_mock(payload.pan_number)
    if not pan_res["is_valid"]:
        raise HTTPException(status_code=400, detail=pan_res["message"])

    # GSTIN check if provided
    if payload.gstin:
        gst_res = verify_gstin_mock(payload.gstin)
        if not gst_res["is_valid"]:
            raise HTTPException(status_code=400, detail=gst_res["message"])

    # Fetch or initialize user
    result = await db.execute(select(User).where(User.phone_number == payload.phone_number))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            phone_number=payload.phone_number,
            role=UserRole.ARTISAN,
            is_verified=False
        )
        db.add(user)
        await db.flush()

    # Create or update profile
    prof_res = await db.execute(select(ArtisanProfile).where(ArtisanProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()

    if not profile:
        profile = ArtisanProfile(
            user_id=user.id,
            aadhaar_number=payload.aadhaar_number,
            pan_number=payload.pan_number,
            gstin=payload.gstin,
            state="Pending",
            district="Pending",
            city="Pending",
            craft_category="Pending",
            craft_type="Pending"
        )
        db.add(profile)
    else:
        profile.aadhaar_number = payload.aadhaar_number
        profile.pan_number = payload.pan_number
        profile.gstin = payload.gstin

    await db.commit()
    return {"message": "Artisan Step 1 verification successful.", "user_id": user.id}


@router.post("/signup/artisan/step2", response_model=Token)
async def artisan_signup_step2(
    user_id: str,
    payload: ArtisanSignupStep2,
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan Signup Page 2 – Location & Craft Category Details
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.full_name = payload.full_name
    user.preferred_language = payload.preferred_language
    user.is_verified = True

    prof_res = await db.execute(select(ArtisanProfile).where(ArtisanProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()

    if not profile:
        raise HTTPException(status_code=400, detail="Please complete Step 1 verification first.")

    profile.state = payload.state
    profile.district = payload.district
    profile.city = payload.city
    profile.craft_category = payload.craft_category
    profile.craft_type = payload.craft_type
    profile.verification_status = VerificationStatus.VERIFIED

    await db.commit()

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "is_verified": user.is_verified
    }


@router.post("/signup/customer/b2c", response_model=Token)
async def customer_b2c_signup(
    payload: CustomerB2CSignup,
    db: AsyncSession = Depends(get_db)
):
    """
    Individual B2C Customer Signup
    """
    result = await db.execute(select(User).where(User.phone_number == payload.phone_number))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            phone_number=payload.phone_number,
            email=payload.email,
            full_name=payload.full_name,
            role=UserRole.CUSTOMER_INDIVIDUAL,
            preferred_language=payload.preferred_language,
            is_verified=True
        )
        db.add(user)
        await db.flush()
    else:
        user.full_name = payload.full_name
        user.email = payload.email
        user.role = UserRole.CUSTOMER_INDIVIDUAL
        user.is_verified = True

    prof_res = await db.execute(select(BuyerProfile).where(BuyerProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()
    if not profile:
        profile = BuyerProfile(
            user_id=user.id,
            buyer_category="INDIVIDUAL",
            address=payload.address,
            verification_status=VerificationStatus.VERIFIED
        )
        db.add(profile)

    await db.commit()

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "is_verified": user.is_verified
    }


@router.post("/signup/customer/bulk", response_model=Token)
async def customer_bulk_signup(
    payload: BulkBuyerSignup,
    db: AsyncSession = Depends(get_db)
):
    """
    Bulk Buyer (NGO / Retailer / Exporter / Corporate) Signup
    """
    # Validate identity documents
    aadhaar_res = verify_aadhaar_mock(payload.aadhaar_number)
    if not aadhaar_res["is_valid"]:
        raise HTTPException(status_code=400, detail=aadhaar_res["message"])

    pan_res = verify_pan_mock(payload.pan_number)
    if not pan_res["is_valid"]:
        raise HTTPException(status_code=400, detail=pan_res["message"])

    gst_res = verify_gstin_mock(payload.gstin)
    if not gst_res["is_valid"]:
        raise HTTPException(status_code=400, detail=gst_res["message"])

    result = await db.execute(select(User).where(User.phone_number == payload.phone_number))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            phone_number=payload.phone_number,
            email=payload.email,
            full_name=payload.full_name,
            role=UserRole.CUSTOMER_BULK,
            preferred_language=payload.preferred_language,
            is_verified=True
        )
        db.add(user)
        await db.flush()

    prof_res = await db.execute(select(BuyerProfile).where(BuyerProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()
    if not profile:
        profile = BuyerProfile(
            user_id=user.id,
            buyer_category="BULK",
            organization_name=payload.organization_name,
            aadhaar_number=payload.aadhaar_number,
            pan_number=payload.pan_number,
            gstin=payload.gstin,
            address=payload.address,
            verification_status=VerificationStatus.VERIFIED
        )
        db.add(profile)

    await db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "is_verified": user.is_verified
    }


@router.post("/signup/customer/govt", response_model=Token)
async def customer_govt_signup(
    payload: GovtBuyerSignup,
    db: AsyncSession = Depends(get_db)
):
    """
    Government Buyer Signup (Pending Admin Approval)
    """
    result = await db.execute(select(User).where(User.phone_number == payload.phone_number))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            phone_number=payload.phone_number,
            email=payload.govt_email,
            full_name=payload.full_name,
            role=UserRole.CUSTOMER_GOVT,
            preferred_language=payload.preferred_language,
            is_verified=False  # Requires Admin Approval
        )
        db.add(user)
        await db.flush()

    prof_res = await db.execute(select(BuyerProfile).where(BuyerProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()
    if not profile:
        profile = BuyerProfile(
            user_id=user.id,
            buyer_category="GOVT",
            department_name=payload.department_name,
            department_id=payload.department_id,
            pan_number=payload.pan_number,
            gstin=payload.gstin,
            address=payload.address,
            verification_status=VerificationStatus.PENDING
        )
        db.add(profile)

    await db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "is_verified": user.is_verified
    }


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user details and profile.
    """
    return current_user
