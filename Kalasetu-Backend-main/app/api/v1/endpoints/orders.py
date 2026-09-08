from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.order import Order, OrderStatus, PaymentStatus, OrderStatusLog
from app.schemas.order import (
    OrderOut,
    OrderUpdateStatusRequest,
    RazorpayPaymentVerifyRequest
)
from app.services.razorpay_client import razorpay_service
from app.services.ondc_client import ondc_service

router = APIRouter()


@router.get("/ongoing", response_model=List[OrderOut])
async def get_ongoing_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Displays active ongoing orders for Artisan & Buyers.
    Excludes COMPLETED orders.
    """
    stmt = select(Order).where(
        or_(Order.artisan_id == current_user.id, Order.buyer_id == current_user.id),
        Order.status != OrderStatus.COMPLETED
    ).order_by(Order.created_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/completed", response_model=List[OrderOut])
async def get_completed_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Displays finished/delivered orders. Requires review submission.
    """
    stmt = select(Order).where(
        or_(Order.artisan_id == current_user.id, Order.buyer_id == current_user.id),
        or_(Order.status == OrderStatus.COMPLETED, Order.status == OrderStatus.PAYMENT_RECEIVED)
    ).order_by(Order.created_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderOut)
async def get_order_by_id(order_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.put("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    payload: OrderUpdateStatusRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan / Buyer status update action buttons:
    - IN_PRODUCTION
    - READY_FOR_DISPATCH
    - DISPATCHED (Triggers ONDC logistics tracking creation)
    - PAYMENT_RECEIVED (Order Closed)
    """
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    order.status = payload.status

    # If Dispatched, register ONDC tracking
    if payload.status == OrderStatus.DISPATCHED and not order.ondc_tracking_id:
        shipment = ondc_service.create_shipment(
            order_id=order.id,
            origin_address="Artisan Craft Hub",
            destination_address=order.shipping_address or "Buyer Destination Address"
        )
        order.ondc_tracking_id = shipment["ondc_tracking_id"]
        order.ondc_shipment_status = shipment["shipment_status"]

    if payload.status == OrderStatus.PAYMENT_RECEIVED or payload.status == OrderStatus.COMPLETED:
        order.status = OrderStatus.COMPLETED
        order.payment_status = PaymentStatus.RELEASED

    # Add audit log
    log = OrderStatusLog(
        order_id=order.id,
        status=payload.status,
        updated_by_id=current_user.id,
        note=payload.note or f"Order status updated to {payload.status}"
    )
    db.add(log)
    await db.commit()

    res = await db.execute(select(Order).where(Order.id == order.id))
    return res.scalar_one()


@router.post("/{order_id}/checkout-razorpay")
async def checkout_razorpay(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generates Razorpay Checkout Order ID for customer payment.
    """
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    rzp_order = razorpay_service.create_order(order.total_amount, receipt_id=order.id)
    order.razorpay_order_id = rzp_order["id"]
    await db.commit()

    return rzp_order


@router.post("/{order_id}/verify-razorpay-payment")
async def verify_razorpay_payment(
    order_id: str,
    payload: RazorpayPaymentVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Verifies Razorpay payment signature and updates payment status to ESCROW_HELD.
    """
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    is_valid = razorpay_service.verify_payment_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature.")

    order.razorpay_payment_id = payload.razorpay_payment_id
    order.payment_status = PaymentStatus.ESCROW_HELD
    await db.commit()

    return {"message": "Payment verified successfully and held in Escrow until delivery.", "order_id": order.id}


@router.get("/{order_id}/ondc-tracking")
async def get_ondc_tracking(order_id: str, db: AsyncSession = Depends(get_db)):
    """
    Queries live ONDC network tracking info.
    """
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    tracking_id = order.ondc_tracking_id or f"ONDC-LOG-{order.id[:8].upper()}"
    return ondc_service.get_tracking_status(tracking_id, order.status)
