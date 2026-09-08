from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.user import User, UserRole, ArtisanProfile
from app.models.product import Product
from app.models.order import Order, OrderStatus
from app.schemas.user import UserOut

router = APIRouter()


@router.get("/dashboard-stats")
async def get_artisan_dashboard_stats(
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns summary statistics for the 7 primary Artisan Dashboard modules:
    - Active Published Products count
    - Total Orders count
    - Pending Quotations count
    - Total Sales & Earnings (Order-wise breakdown)
    """
    # Products count
    prod_res = await db.execute(
        select(func.count(Product.id)).where(Product.artisan_id == current_user.id)
    )
    total_products = prod_res.scalar() or 0

    # Orders summary
    orders_res = await db.execute(
        select(Order).where(Order.artisan_id == current_user.id)
    )
    orders = orders_res.scalars().all()

    total_orders = len(orders)
    completed_orders = [o for o in orders if o.status == OrderStatus.COMPLETED or o.status == OrderStatus.PAYMENT_RECEIVED]
    total_earnings = sum(o.total_amount for o in completed_orders)

    return {
        "artisan_id": current_user.id,
        "full_name": current_user.full_name,
        "is_verified": current_user.is_verified,
        "total_published_products": total_products,
        "total_orders_received": total_orders,
        "completed_orders": len(completed_orders),
        "total_earnings_inr": total_earnings
    }


@router.get("/sales-history")
async def get_artisan_sales_history(
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Displays Artisan Module 7: Sales History breakdown including total sales,
    earnings per order, and customer details.
    """
    result = await db.execute(
        select(Order).where(Order.artisan_id == current_user.id).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    history = []
    total_revenue = 0.0

    for order in orders:
        total_revenue += order.total_amount
        history.append({
            "order_id": order.id,
            "order_type": order.order_type,
            "total_amount": order.total_amount,
            "status": order.status,
            "payment_status": order.payment_status,
            "date": order.created_at,
            "buyer_id": order.buyer_id
        })

    return {
        "total_revenue_inr": total_revenue,
        "total_sales_count": len(orders),
        "order_history": history
    }
