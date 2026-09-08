from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.user import User, UserRole
from app.models.tender import Tender, TenderStatus
from app.schemas.tender import TenderCreate, TenderOut

router = APIRouter()


@router.post("/", response_model=TenderOut)
async def post_tender(
    payload: TenderCreate,
    current_user: User = Depends(require_roles([UserRole.CUSTOMER_BULK, UserRole.CUSTOMER_GOVT, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Bulk Buyer / Government Buyer posts a procurement tender.
    (Individual B2C customers cannot post tenders.)
    """
    tender = Tender(
        buyer_id=current_user.id,
        product_name=payload.product_name,
        quantity_required=payload.quantity_required,
        delivery_location=payload.delivery_location,
        delivery_address=payload.delivery_address,
        buyer_type=payload.buyer_type,
        additional_requirements=payload.additional_requirements,
        reference_image_url=payload.reference_image_url,
        status=TenderStatus.OPEN
    )
    db.add(tender)
    await db.commit()

    result = await db.execute(select(Tender).where(Tender.id == tender.id))
    return result.scalar_one()


@router.get("/", response_model=List[TenderOut])
async def list_open_tenders(
    buyer_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Displays open procurement tenders for matching artisans.
    """
    stmt = select(Tender).where(Tender.status == TenderStatus.OPEN)
    if buyer_type:
        stmt = stmt.where(Tender.buyer_type == buyer_type)

    result = await db.execute(stmt.order_by(Tender.created_at.desc()))
    return result.scalars().all()


@router.get("/my-tenders", response_model=List[TenderOut])
async def get_my_posted_tenders(
    current_user: User = Depends(require_roles([UserRole.CUSTOMER_BULK, UserRole.CUSTOMER_GOVT])),
    db: AsyncSession = Depends(get_db)
):
    """
    Bulk Buyer / Government Buyer Dashboard: Tab 1 Posted Tenders list.
    """
    result = await db.execute(
        select(Tender).where(Tender.buyer_id == current_user.id).order_by(Tender.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{tender_id}", response_model=TenderOut)
async def get_tender_by_id(tender_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalar_one_or_none()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found.")
    return tender
