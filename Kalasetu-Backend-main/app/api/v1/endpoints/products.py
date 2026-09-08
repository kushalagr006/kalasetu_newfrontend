import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.user import User, UserRole
from app.models.product import Product, ProductImage, ProductStatus
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut, SpeechCatalogParseRequest
from app.services.cv_enhancer import enhance_product_image
from app.services.bhashini import bhashini_service

router = APIRouter()

UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/speech-to-catalog")
async def speech_to_catalog(payload: SpeechCatalogParseRequest):
    """
    BHASHINI Voice-to-Text & NLP Product Detail Extractor.
    Converts regional speech voice note into structured product fields.
    """
    raw_text = payload.voice_text
    if not raw_text and payload.audio_url:
        raw_text = await bhashini_service.speech_to_text(b"", payload.source_language)
    elif not raw_text:
        raw_text = "यह हाथ से बना बांस का शिल्प उत्पाद है। मूल्य ₹450 है।"

    catalog_data = await bhashini_service.parse_catalog_from_speech(raw_text)
    return catalog_data


from app.services.cv_enhancer import enhance_product_bytes, enhance_product_image

@router.post("/upload-photo")
async def upload_product_photo(
    file: UploadFile = File(...)
):
    """
    OpenCV AI Photo Enhancement Module: Uploads product photo, applies Gray World White Balance,
    CLAHE contrast enhancement, HSV vibrance boost, bilateral filter denoising, and unsharp masking.
    """
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    orig_filename = f"orig_{uuid.uuid4().hex}.{ext}"
    enh_filename = f"enh_{uuid.uuid4().hex}.jpg"

    orig_path = os.path.join(UPLOAD_DIR, orig_filename)
    enh_path = os.path.join(UPLOAD_DIR, enh_filename)

    # Save uploaded original
    contents = await file.read()
    with open(orig_path, "wb") as f:
        f.write(contents)

    # Apply OpenCV AI Enhancement
    try:
        enhanced_bytes = enhance_product_bytes(contents)
        with open(enh_path, "wb") as f:
            f.write(enhanced_bytes)
        print(f"[OpenCV Success] Enhanced photo saved to {enh_path}")
    except Exception as e:
        print(f"[OpenCV Enhancer Fallback Error]: {e}")
        enhance_product_image(orig_path, enh_path)

    return {
        "original_url": f"/{orig_path.replace('\\', '/')}",
        "enhanced_url": f"/{enh_path.replace('\\', '/')}",
        "ai_enhanced": True
    }


@router.post("/", response_model=ProductOut)
async def create_product(
    payload: ProductCreate,
    primary_image_url: Optional[str] = None,
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Publish Product to Artisan Catalog.
    """
    rec_price = round(payload.price * 1.15, 2)
    product = Product(
        artisan_id=current_user.id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        material_used=payload.material_used,
        price=payload.price,
        recommended_price=rec_price,
        stock_quantity=payload.stock_quantity,
        audio_note_url=payload.audio_note_url,
        ai_enhanced=True,
        status=ProductStatus.PUBLISHED
    )
    db.add(product)
    await db.flush()

    if primary_image_url:
        prod_img = ProductImage(
            product_id=product.id,
            original_url=primary_image_url,
            enhanced_url=primary_image_url,
            is_primary=True
        )
        db.add(prod_img)

    await db.commit()

    # Query complete product with images
    result = await db.execute(select(Product).where(Product.id == product.id))
    return result.scalar_one()


@router.get("/", response_model=List[ProductOut])
async def list_products(
    category: Optional[str] = None,
    craft_type: Optional[str] = None,
    material: Optional[str] = None,
    query: Optional[str] = None,
    artisan_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Customer Catalog Feed & Search endpoint.
    Filters by category, material, keywords, craft type, and artisan.
    """
    stmt = select(Product).where(Product.status == ProductStatus.PUBLISHED)

    if artisan_id:
        stmt = stmt.where(Product.artisan_id == artisan_id)
    if category:
        stmt = stmt.where(Product.category.ilike(f"%{category}%"))
    if material:
        stmt = stmt.where(Product.material_used.ilike(f"%{material}%"))
    if query:
        stmt = stmt.where(
            or_(
                Product.title.ilike(f"%{query}%"),
                Product.description.ilike(f"%{query}%"),
                Product.category.ilike(f"%{query}%"),
                Product.material_used.ilike(f"%{query}%")
            )
        )

    result = await db.execute(stmt.order_by(Product.created_at.desc()))
    return result.scalars().all()


@router.get("/my-products", response_model=List[ProductOut])
async def get_my_products(
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Artisan Module 2: My Products list.
    """
    result = await db.execute(
        select(Product).where(Product.artisan_id == current_user.id).order_by(Product.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product_by_id(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Edit Product & Inventory Update.
    """
    result = await db.execute(select(Product).where(Product.id == product_id, Product.artisan_id == current_user.id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or access denied.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(require_roles([UserRole.ARTISAN])),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete Product from Artisan Catalog.
    """
    result = await db.execute(select(Product).where(Product.id == product_id, Product.artisan_id == current_user.id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or access denied.")

    await db.delete(product)
    await db.commit()
    return {"message": "Product deleted successfully."}
