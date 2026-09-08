from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from typing import Optional
from app.services.kalasetu_engine_v2 import evaluate_artisan_product
from app.services.bhashini import bhashini_service

router = APIRouter()

@router.post("/estimate")
async def estimate_price(
    selling_price: float = Form(..., description="Artisan intended selling price"),
    product_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    material_cost: Optional[float] = Form(None),
    quantity: Optional[int] = Form(1),
    source_language: Optional[str] = Form("auto"),
    image: Optional[UploadFile] = File(None)
):
    raw_query = f"{product_name or ''} {description or ''}".strip()
    if not raw_query and image and image.filename:
        raw_query = image.filename
    if not raw_query:
        raw_query = "Handicraft item"
    
    # Bhashini NMT Text Translation: Translate local language input (Hindi, Bengali, Bhojpuri, Marathi, Gujarati, Kannada, etc.) to English for accurate pricing engine analysis
    query_en = raw_query
    if raw_query and source_language != "en":
        try:
            translated = await bhashini_service.translate_text(
                text=raw_query,
                source_lang=source_language or "auto",
                target_lang="en"
            )
            if translated and translated.strip():
                query_en = translated.strip()
        except Exception as err:
            print(f"[Bhashini Pricing NMT Translation Warning]: {err}")
            query_en = raw_query

    try:
        result = evaluate_artisan_product(
            title_or_desc=query_en,
            artisan_wanted_price=selling_price,
            material_cost=material_cost,
            quantity=quantity or 1
        )
        result["source_query_raw"] = raw_query
        result["translated_query_en"] = query_en
        result["source_language"] = source_language
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
