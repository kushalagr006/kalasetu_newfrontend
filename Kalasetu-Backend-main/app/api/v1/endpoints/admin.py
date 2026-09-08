from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import require_roles
from app.models.user import User, UserRole, ArtisanProfile, BuyerProfile, VerificationStatus
from app.models.tender import Tender
from app.models.order import Order
from app.models.scheme import GovernmentScheme
from app.schemas.user import UserOut
from app.schemas.scheme import GovernmentSchemeCreate, GovernmentSchemeOut

router = APIRouter()


@router.get("/pending-verifications", response_model=List[UserOut])
async def get_pending_verifications(
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Lists all artisans, bulk buyers, and government buyers awaiting admin approval.
    """
    result = await db.execute(
        select(User).where(User.is_verified == False).order_by(User.created_at.desc())
    )
    return result.scalars().all()


@router.post("/approve-user/{user_id}")
async def approve_user_verification(
    user_id: str,
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin approves artisan or buyer verification.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.is_verified = True

    if user.artisan_profile:
        user.artisan_profile.verification_status = VerificationStatus.VERIFIED
    if user.buyer_profile:
        user.buyer_profile.verification_status = VerificationStatus.VERIFIED

    await db.commit()
    return {"message": f"User '{user.full_name or user.phone_number}' verified and approved successfully."}


@router.post("/reject-user/{user_id}")
async def reject_user_verification(
    user_id: str,
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.is_verified = False
    if user.artisan_profile:
        user.artisan_profile.verification_status = VerificationStatus.REJECTED
    if user.buyer_profile:
        user.buyer_profile.verification_status = VerificationStatus.REJECTED

    await db.commit()
    return {"message": "User verification rejected."}


@router.post("/schemes", response_model=GovernmentSchemeOut)
async def publish_government_scheme(
    payload: GovernmentSchemeCreate,
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin publishes new Government Scheme for artisans.
    """
    scheme = GovernmentScheme(
        title=payload.title,
        description=payload.description,
        eligibility_criteria=payload.eligibility_criteria,
        benefits=payload.benefits,
        target_craft_categories=payload.target_craft_categories,
        target_states=payload.target_states,
        apply_link=payload.apply_link,
        is_active=True
    )
    db.add(scheme)
    await db.commit()

    res = await db.execute(select(GovernmentScheme).where(GovernmentScheme.id == scheme.id))
    return res.scalar_one()


@router.get("/platform-metrics")
async def get_platform_metrics(
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin Analytics Dashboard: Platform overview metrics.
    """
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_artisans = (await db.execute(select(func.count(User.id)).where(User.role == UserRole.ARTISAN))).scalar() or 0
    total_buyers = (await db.execute(select(func.count(User.id)).where(User.role != UserRole.ARTISAN, User.role != UserRole.ADMIN))).scalar() or 0
    total_tenders = (await db.execute(select(func.count(Tender.id)))).scalar() or 0
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar() or 0

    return {
        "total_users": total_users,
        "total_artisans": total_artisans,
        "total_buyers": total_buyers,
        "total_tenders_posted": total_tenders,
        "total_orders_executed": total_orders
    }
