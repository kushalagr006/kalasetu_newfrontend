from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
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
    PhoneCheckRequest,
    PhoneCheckResponse,
    OTPRequestPayload,
    OTPRequestResponse,
    OTPVerifyLoginPayload,
    ArtisanRegistrationRequest,
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


def normalize_phone(phone: str) -> str:
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    return cleaned


@router.post("/check-phone", response_model=PhoneCheckResponse)
async def check_phone(payload: PhoneCheckRequest, db: AsyncSession = Depends(get_db)):
    """
    Optional UX endpoint to check if a phone number is registered.
    (Not used as the security/auth authority).
    """
    phone = normalize_phone(payload.phone_number)
    result = await db.execute(select(User).where(User.phone_number == phone))
    user = result.scalar_one_or_none()

    if not user:
        return {"is_registered": False, "user_id": None, "full_name": None}

    return {"is_registered": True, "user_id": user.id, "full_name": user.full_name}


@router.post("/request-otp", response_model=OTPRequestResponse)
async def request_otp(payload: OTPRequestPayload, db: AsyncSession = Depends(get_db)):
    """
    Independently checks database for registered user and issues OTP request.
    If unregistered: Returns HTTP 404 (No OTP generated/sent).
    In Dev Mode: Returns demo_otp "123456".
    In Prod Mode: Fails closed if real OTP provider is not configured.
    """
    phone = normalize_phone(payload.phone_number)
    result = await db.execute(select(User).where(User.phone_number == phone))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This mobile number is not registered. Please register first."
        )

    is_dev = settings.ENVIRONMENT.lower() != "production"

    if is_dev:
        return {
            "message": "OTP sent successfully.",
            "phone_number": phone,
            "demo_otp": "123456"
        }

    # Production mode check: Fail closed if real SMS provider is not configured
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="SMS service unavailable. Real OTP provider is not configured."
    )


@router.post("/verify-otp-login", response_model=Token)
async def verify_otp_login(payload: OTPVerifyLoginPayload, db: AsyncSession = Depends(get_db)):
    """
    Verifies login OTP, issues JWT access token, and returns user profile details.
    In Dev Mode: Validates fixed Mock OTP "123456".
    In Prod Mode: Validates via real OTP provider (fails closed if unconfigured).
    """
    phone = normalize_phone(payload.phone_number)
    result = await db.execute(select(User).where(User.phone_number == phone))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This mobile number is not registered. Please register first."
        )

    is_dev = settings.ENVIRONMENT.lower() != "production"

    if is_dev:
        if payload.otp_code.strip() != "123456":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP. Please try again."
            )
    else:
        # Production fail closed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SMS service unavailable. Real OTP provider is not configured."
        )

    token = create_access_token({"sub": user.id, "role": user.role})

    artisan_prof = None
    if user.role == UserRole.ARTISAN:
        prof_res = await db.execute(select(ArtisanProfile).where(ArtisanProfile.user_id == user.id))
        profile = prof_res.scalar_one_or_none()
        if profile:
            artisan_prof = {
                "id": profile.id,
                "state": profile.state,
                "district": profile.district,
                "city": profile.city,
                "craft_category": profile.craft_category,
                "craft_type": profile.craft_type,
                "verification_status": profile.verification_status
            }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "full_name": user.full_name,
        "is_verified": user.is_verified,
        "artisan_profile": artisan_prof
    }


@router.post("/signup/artisan/register")
async def register_artisan_complete(
    payload: ArtisanRegistrationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Registers a new Artisan in the database with is_verified=False and ArtisanProfile.
    """
    phone = normalize_phone(payload.phone_number)

    # Check if already registered
    existing_res = await db.execute(select(User).where(User.phone_number == phone))
    if existing_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number is already registered. Please login."
        )

    # Validate Aadhaar & PAN format/mock check
    aadhaar_res = verify_aadhaar_mock(payload.aadhaar_number)
    if not aadhaar_res["is_valid"]:
        raise HTTPException(status_code=400, detail=aadhaar_res["message"])

    pan_res = verify_pan_mock(payload.pan_number)
    if not pan_res["is_valid"]:
        raise HTTPException(status_code=400, detail=pan_res["message"])

    if payload.gstin:
        gst_res = verify_gstin_mock(payload.gstin)
        if not gst_res["is_valid"]:
            raise HTTPException(status_code=400, detail=gst_res["message"])

    # Create User record with is_verified=False (Registration does NOT mean KYC verification)
    user = User(
        phone_number=phone,
        full_name=payload.full_name,
        role=UserRole.ARTISAN,
        preferred_language=payload.preferred_language,
        is_verified=False
    )
    db.add(user)
    await db.flush()

    # Bhashini NMT Translation: Translate regional language registration details into English for database storage
    state_en = payload.state
    district_en = payload.district
    city_en = payload.city
    craft_category_en = payload.craft_category
    craft_type_en = payload.craft_type

    pref_lang = payload.preferred_language or "hi"
    if pref_lang != "en":
        try:
            if payload.state:
                state_en = await bhashini_service.translate_text(payload.state, source_lang=pref_lang, target_lang="en")
            if payload.district:
                district_en = await bhashini_service.translate_text(payload.district, source_lang=pref_lang, target_lang="en")
            if payload.city:
                city_en = await bhashini_service.translate_text(payload.city, source_lang=pref_lang, target_lang="en")
            if payload.craft_category:
                craft_category_en = await bhashini_service.translate_text(payload.craft_category, source_lang=pref_lang, target_lang="en")
            if payload.craft_type:
                craft_type_en = await bhashini_service.translate_text(payload.craft_type, source_lang=pref_lang, target_lang="en")
        except Exception as trans_err:
            print(f"[Bhashini Auth NMT Translation Warning]: {trans_err}")

    # Create ArtisanProfile record with PENDING verification
    profile = ArtisanProfile(
        user_id=user.id,
        aadhaar_number=payload.aadhaar_number,
        pan_number=payload.pan_number,
        gstin=payload.gstin,
        state=state_en,
        district=district_en,
        city=city_en,
        craft_category=craft_category_en,
        craft_type=craft_type_en,
        verification_status=VerificationStatus.PENDING
    )
    db.add(profile)
    await db.commit()

    return {"message": "Registration Successful. Please Login.", "user_id": user.id}


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
        "full_name": user.full_name,
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

    prof_res = await db.execute(select(ArtisanProfile).where(ArtisanProfile.user_id == user.id))
    profile = prof_res.scalar_one_or_none()

    if not profile:
        raise HTTPException(status_code=400, detail="Please complete Step 1 verification first.")

    profile.state = payload.state
    profile.district = payload.district
    profile.city = payload.city
    profile.craft_category = payload.craft_category
    profile.craft_type = payload.craft_type

    await db.commit()

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "full_name": user.full_name,
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
        "full_name": user.full_name,
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
        "full_name": user.full_name,
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
            is_verified=False
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
        "full_name": user.full_name,
        "is_verified": user.is_verified
    }


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user details and profile.
    """
    return current_user
