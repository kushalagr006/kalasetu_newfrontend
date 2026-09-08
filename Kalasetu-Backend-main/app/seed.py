import asyncio
from app.core.database import AsyncSessionLocal, init_db
from app.models.user import User, ArtisanProfile, BuyerProfile, UserRole, VerificationStatus
from app.models.product import Product, ProductImage, ProductStatus
from app.models.tender import Tender, TenderStatus
from app.models.scheme import GovernmentScheme


async def seed_database():
    print("[INFO] Initializing Database Schema & Seeding Initial SIH Data...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        res = await session.execute(select(User))
        if res.scalars().first():
            print("⚡ Database already seeded!")
            return

        # 1. Admin User
        admin = User(
            phone_number="+919999999999",
            email="admin@kalasetu.gov.in",
            full_name="Ministry Admin",
            role=UserRole.ADMIN,
            is_verified=True
        )
        session.add(admin)

        # 2. Artisan 1 (Bamboo Craft)
        artisan1 = User(
            phone_number="+919876543210",
            full_name="Rameshwar Vishwakarma",
            role=UserRole.ARTISAN,
            preferred_language="hi",
            is_verified=True
        )
        session.add(artisan1)
        await session.flush()

        prof1 = ArtisanProfile(
            user_id=artisan1.id,
            aadhaar_number="123456789012",
            pan_number="ABCDE1234F",
            gstin="07AAAAA0000A1Z5",
            state="Madhya Pradesh",
            district="Rewa",
            city="Rewa",
            craft_category="Bamboo Craft",
            craft_type="Woven Bamboo Decor & Utensils",
            verification_status=VerificationStatus.VERIFIED
        )
        session.add(prof1)

        # Artisan 1 Product
        p1 = Product(
            artisan_id=artisan1.id,
            title="Handwoven Bamboo Lamp & Diya Stand",
            description="Traditional eco-friendly bamboo desk lamp handcrafted by rural MP artisans.",
            category="Bamboo Craft",
            material_used="Natural Bamboo & Cane",
            price=450.0,
            recommended_price=520.0,
            stock_quantity=50,
            ai_enhanced=True,
            status=ProductStatus.PUBLISHED
        )
        session.add(p1)
        await session.flush()

        p1_img = ProductImage(
            product_id=p1.id,
            original_url="/uploads/products/sample_bamboo.jpg",
            enhanced_url="/uploads/products/sample_bamboo.jpg",
            is_primary=True
        )
        session.add(p1_img)

        # 3. Artisan 2 (Terracotta Pottery)
        artisan2 = User(
            phone_number="+919876543211",
            full_name="Sunita Devi",
            role=UserRole.ARTISAN,
            preferred_language="hi",
            is_verified=True
        )
        session.add(artisan2)
        await session.flush()

        prof2 = ArtisanProfile(
            user_id=artisan2.id,
            aadhaar_number="987654321098",
            pan_number="XYZPD9876K",
            state="Rajasthan",
            district="Jaipur",
            city="Jaipur",
            craft_category="Pottery & Clay",
            craft_type="Terracotta Handicrafts",
            verification_status=VerificationStatus.VERIFIED
        )
        session.add(prof2)

        p2 = Product(
            artisan_id=artisan2.id,
            title="Handpainted Terracotta Earthenware Pot Set",
            description="Set of 3 handpainted Jaipur terracotta pots with natural organic clay finish.",
            category="Pottery & Clay",
            material_used="Terracotta Clay",
            price=850.0,
            recommended_price=980.0,
            stock_quantity=25,
            ai_enhanced=True,
            status=ProductStatus.PUBLISHED
        )
        session.add(p2)

        # 4. Bulk Buyer (NGO Enterprise)
        bulk_buyer = User(
            phone_number="+919555555555",
            email="procurement@craftempower.org",
            full_name="CraftEmpower NGO Foundation",
            role=UserRole.CUSTOMER_BULK,
            is_verified=True
        )
        session.add(bulk_buyer)
        await session.flush()

        buyer_prof1 = BuyerProfile(
            user_id=bulk_buyer.id,
            buyer_category="BULK",
            organization_name="CraftEmpower NGO",
            aadhaar_number="555566667777",
            pan_number="NGOPR1122M",
            gstin="08NGOEX1234A1Z0",
            address="Plot 45, NGO Hub, New Delhi",
            verification_status=VerificationStatus.VERIFIED
        )
        session.add(buyer_prof1)

        # Open Tender posted by Bulk Buyer
        tender1 = Tender(
            buyer_id=bulk_buyer.id,
            product_name="Eco-friendly Handcrafted Bamboo Gift Boxes",
            quantity_required=500,
            delivery_location="New Delhi",
            delivery_address="CraftEmpower HQ, Connaught Place, New Delhi",
            buyer_type="BULK",
            additional_requirements="Must be 100% biodegradable bamboo with natural polish finish.",
            status=TenderStatus.OPEN
        )
        session.add(tender1)

        # 5. Government Buyer
        govt_buyer = User(
            phone_number="+919111111111",
            email="procurement@socialjustice.gov.in",
            full_name="Ministry Procurement Officer",
            role=UserRole.CUSTOMER_GOVT,
            is_verified=True
        )
        session.add(govt_buyer)
        await session.flush()

        buyer_prof2 = BuyerProfile(
            user_id=govt_buyer.id,
            buyer_category="GOVT",
            department_name="Ministry of Social Justice & Empowerment",
            department_id="MSJE-PROC-2026",
            address="Shastri Bhawan, New Delhi",
            verification_status=VerificationStatus.VERIFIED
        )
        session.add(buyer_prof2)

        # Govt Tender
        tender2 = Tender(
            buyer_id=govt_buyer.id,
            product_name="Handloom Cotton Shawls for Official Delegations",
            quantity_required=1000,
            delivery_location="New Delhi",
            delivery_address="Shastri Bhawan, New Delhi",
            buyer_type="GOVT",
            additional_requirements="Handloomed by certified artisan clusters under Ministry scheme.",
            status=TenderStatus.OPEN
        )
        session.add(tender2)

        # 6. Government Schemes
        scheme1 = GovernmentScheme(
            title="PM Vishwakarma Scheme",
            description="Financial support, skill upgrading, and digital marketing support for traditional artisans and craftspeople.",
            eligibility_criteria="Artisans working in 18 traditional trades with Aadhaar verification.",
            benefits="Collateral-free credit support up to ₹3 Lakh at 5% interest rate + ₹15,000 toolkit incentive.",
            target_craft_categories="Bamboo Craft, Pottery, Textile, Woodwork, Metalcraft",
            apply_link="https://pmvishwakarma.gov.in"
        )
        scheme2 = GovernmentScheme(
            title="SFURTI (Scheme of Fund for Regeneration of Traditional Industries)",
            description="Ministry of MSME scheme to organize traditional industries into clusters for sustainability.",
            eligibility_criteria="Artisan clusters and Self Help Groups (SHGs).",
            benefits="Up to ₹5 Crore cluster development grant for modern machinery, testing labs, and export support.",
            target_craft_categories="Textile, Pottery, Metalwork, Bamboo",
            apply_link="https://sfurti.msme.gov.in"
        )
        session.add(scheme1)
        session.add(scheme2)

        await session.commit()
        print("[SUCCESS] Initial SIH Test Data Seeded Successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
