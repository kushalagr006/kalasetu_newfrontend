from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    verifications,
    artisans,
    products,
    tenders,
    quotations,
    contracts,
    orders,
    chat,
    schemes,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth & Registration"])
api_router.include_router(verifications.router, prefix="/verifications", tags=["Mock Verification APIs"])
api_router.include_router(artisans.router, prefix="/artisans", tags=["Artisan Dashboard & Sales"])
api_router.include_router(products.router, prefix="/products", tags=["Products & AI Camera/Speech Catalog"])
api_router.include_router(tenders.router, prefix="/tenders", tags=["Bulk & Govt Tenders"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["Quotation Requests & Bids"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["Digital Legal Contracts"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders, Razorpay & ONDC Shipping"])
api_router.include_router(chat.router, prefix="/chat", tags=["Multilingual Chat & WebSockets"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["Govt Schemes, Notifications & Reviews"])
api_router.include_router(admin.router, prefix="/admin", tags=["Government Admin Web Dashboard"])
