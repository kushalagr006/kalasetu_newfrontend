from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.tender import Tender, QuotationRequest, Quotation, QuotationStatus
from app.models.chat import ChatThread
from app.models.contract import Contract, ContractStatus
from app.schemas.tender import (
    QuotationRequestCreate,
    QuotationRequestOut,
    QuotationCreate,
    QuotationOut
)

router = APIRouter()


@router.post("/requests", response_model=QuotationRequestOut)
async def request_quotation(
    payload: QuotationRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Customer requests quotation for an artisan's product.
    """
    # Verify product
    prod_res = await db.execute(select(Product).where(Product.id == payload.product_id))
    product = prod_res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    req = QuotationRequest(
        customer_id=current_user.id,
        artisan_id=payload.artisan_id,
        product_id=payload.product_id,
        requested_quantity=payload.requested_quantity,
        notes=payload.notes,
        status="PENDING"
    )
    db.add(req)
    await db.commit()

    result = await db.execute(select(QuotationRequest).where(QuotationRequest.id == req.id))
    return result.scalar_one()


@router.get("/requests/received", response_model=List[QuotationRequestOut])
async def get_received_quotation_requests(
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan Orders Module: Tab 1 – Quotation Requests received from customers.
    """
    result = await db.execute(
        select(QuotationRequest).where(QuotationRequest.artisan_id == current_user.id).order_by(QuotationRequest.created_at.desc())
    )
    return result.scalars().all()


@router.post("/submit", response_model=QuotationOut)
async def submit_quotation(
    payload: QuotationCreate,
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan fills quotation form (Quantity Available, Price Per Unit, Production Time, Notes)
    and submits quotation to buyer or tender. Automatically creates chat thread!
    """
    buyer_id = None
    context_type = "QUOTATION"
    context_id = ""

    if payload.request_id:
        req_res = await db.execute(select(QuotationRequest).where(QuotationRequest.id == payload.request_id))
        req = req_res.scalar_one_or_none()
        if not req:
            raise HTTPException(status_code=404, detail="Quotation request not found.")
        buyer_id = req.customer_id
        context_id = req.id
        req.status = "QUOTED"

    elif payload.tender_id:
        ten_res = await db.execute(select(Tender).where(Tender.id == payload.tender_id))
        tender = ten_res.scalar_one_or_none()
        if not tender:
            raise HTTPException(status_code=404, detail="Tender not found.")
        buyer_id = tender.buyer_id
        context_type = "TENDER"
        context_id = tender.id

    else:
        raise HTTPException(status_code=400, detail="Must provide either request_id or tender_id.")

    total_price = payload.quantity_available * payload.price_per_unit

    quotation = Quotation(
        request_id=payload.request_id,
        tender_id=payload.tender_id,
        artisan_id=current_user.id,
        quantity_available=payload.quantity_available,
        price_per_unit=payload.price_per_unit,
        total_price=total_price,
        production_time_days=payload.production_time_days,
        additional_notes=payload.additional_notes,
        status=QuotationStatus.SUBMITTED
    )
    db.add(quotation)
    await db.flush()

    # Automatically create Chat Thread if not already existing
    chat_res = await db.execute(
        select(ChatThread).where(
            ChatThread.artisan_id == current_user.id,
            ChatThread.buyer_id == buyer_id,
            ChatThread.context_id == context_id
        )
    )
    chat_thread = chat_res.scalar_one_or_none()

    if not chat_thread:
        chat_thread = ChatThread(
            artisan_id=current_user.id,
            buyer_id=buyer_id,
            context_type=context_type,
            context_id=context_id
        )
        db.add(chat_thread)

    await db.commit()

    result = await db.execute(select(Quotation).where(Quotation.id == quotation.id))
    return result.scalar_one()


@router.post("/{quotation_id}/accept")
async def accept_quotation(
    quotation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Buyer accepts quotation. Automatically generates a digital legal contract!
    """
    result = await db.execute(select(Quotation).where(Quotation.id == quotation_id))
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quotation.status = QuotationStatus.ACCEPTED

    # Create Contract
    contract = Contract(
        quotation_id=quotation.id,
        artisan_id=quotation.artisan_id,
        buyer_id=current_user.id,
        contract_title=f"Legal Procurement Contract for Quote #{quotation.id[:8]}",
        terms_and_conditions=(
            f"1. Artisan agrees to produce {quotation.quantity_available} units within {quotation.production_time_days} days.\n"
            f"2. Total agreed cost: ₹{quotation.total_price} (Price per unit: ₹{quotation.price_per_unit}).\n"
            "3. Payments released upon verified ONDC delivery."
        ),
        status=ContractStatus.PENDING_SIGNATURES
    )
    db.add(contract)
    await db.commit()

    return {
        "message": "Quotation accepted successfully. Digital contract generated.",
        "contract_id": contract.id,
        "quotation_id": quotation.id
    }


@router.post("/{quotation_id}/reject")
async def reject_quotation(
    quotation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Quotation).where(Quotation.id == quotation_id))
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quotation.status = QuotationStatus.REJECTED
    await db.commit()
    return {"message": "Quotation rejected."}
