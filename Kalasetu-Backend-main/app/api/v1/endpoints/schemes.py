from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.scheme import GovernmentScheme, Notification, Review
from app.models.order import Order, OrderStatus
from app.schemas.scheme import (
    GovernmentSchemeOut,
    NotificationOut,
    ReviewCreate,
    ReviewOut
)

router = APIRouter()


@router.get("/government-schemes", response_model=List[GovernmentSchemeOut])
async def list_government_schemes(db: AsyncSession = Depends(get_db)):
    """
    Displays Government scheme recommendations (PM Vishwakarma, SFURTI, Mudra Yojana, etc.)
    for marginalized artisans.
    """
    result = await db.execute(
        select(GovernmentScheme).where(GovernmentScheme.is_active == True).order_by(GovernmentScheme.created_at.desc())
    )
    return result.scalars().all()


@router.get("/notifications", response_model=List[NotificationOut])
async def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Displays user notifications (quotation updates, tender alerts, scheme updates).
    """
    result = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    )
    return result.scalars().all()


@router.post("/reviews", response_model=ReviewOut)
async def submit_order_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Customer submits mandatory rating & review after order delivery.
    """
    order_res = await db.execute(select(Order).where(Order.id == payload.order_id))
    order = order_res.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the buyer of this order can submit a review.")

    # Check if review already exists
    rev_res = await db.execute(select(Review).where(Review.order_id == payload.order_id))
    existing_rev = rev_res.scalar_one_or_none()
    if existing_rev:
        raise HTTPException(status_code=400, detail="Review already submitted for this order.")

    review = Review(
        order_id=payload.order_id,
        customer_id=current_user.id,
        artisan_id=order.artisan_id,
        rating=payload.rating,
        review_text=payload.review_text
    )
    db.add(review)
    await db.commit()

    res = await db.execute(select(Review).where(Review.id == review.id))
    return res.scalar_one()
