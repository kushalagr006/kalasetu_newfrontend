from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.contract import Contract, ContractStatus
from app.models.order import Order, OrderStatus, PaymentStatus, OrderStatusLog
from app.schemas.contract import ContractSignRequest, ContractOut

router = APIRouter()


@router.get("/{contract_id}", response_model=ContractOut)
async def get_contract_by_id(contract_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")
    return contract


@router.post("/{contract_id}/sign", response_model=ContractOut)
async def sign_contract(
    contract_id: str,
    payload: ContractSignRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Digitally signs legal procurement contract.
    When both Artisan & Buyer sign, the contract becomes EXECUTED, and an active Order is created!
    """
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")

    is_artisan = (current_user.id == contract.artisan_id)
    is_buyer = (current_user.id == contract.buyer_id)

    if not is_artisan and not is_buyer:
        raise HTTPException(status_code=403, detail="You are not a party to this contract.")

    now = datetime.now(timezone.utc)
    sig_hash = f"SIG_{current_user.id[:8]}_{now.timestamp()}"

    if is_artisan:
        contract.artisan_signed = payload.digital_signature or sig_hash
        contract.artisan_signed_at = now
    if is_buyer:
        contract.buyer_signed = payload.digital_signature or sig_hash
        contract.buyer_signed_at = now

    # If both signed, execute contract & create active order
    if contract.artisan_signed and contract.buyer_signed:
        contract.status = ContractStatus.EXECUTED

        # Create active Order if not already existing
        order_res = await db.execute(select(Order).where(Order.contract_id == contract.id))
        order = order_res.scalar_one_or_none()

        if not order:
            from app.models.tender import Quotation
            q_res = await db.execute(select(Quotation).where(Quotation.id == contract.quotation_id))
            quotation = q_res.scalar_one()

            order = Order(
                contract_id=contract.id,
                quotation_id=contract.quotation_id,
                artisan_id=contract.artisan_id,
                buyer_id=contract.buyer_id,
                order_type="BULK_TENDER" if quotation.tender_id else "B2C_DIRECT",
                total_amount=quotation.total_price,
                status=OrderStatus.CONTRACT_SIGNED,
                payment_status=PaymentStatus.PENDING
            )
            db.add(order)
            await db.flush()

            # Add log entry
            log = OrderStatusLog(
                order_id=order.id,
                status=OrderStatus.CONTRACT_SIGNED,
                updated_by_id=current_user.id,
                note="Contract digitally executed by both parties. Order activated."
            )
            db.add(log)

    await db.commit()

    res = await db.execute(select(Contract).where(Contract.id == contract.id))
    return res.scalar_one()
