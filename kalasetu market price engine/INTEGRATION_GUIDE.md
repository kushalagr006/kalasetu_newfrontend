# KalaSetu V2 Pricing Engine — Integration Guide

Welcome! This package contains the complete, empirically validated **KalaSetu V2 Dynamic Pricing Engine** for Indian handicrafts (Bastar Dhokra, Channapatna Toys, Madhubani Painting, Sikki Grass, and Sujini Embroidery).

---

## 1. Package Contents

```
kalasetu_v2_validated_engine/
├── kalasetu_engine_v2.py                 # Core pricing engine logic & evaluation function
├── data/
│   └── processed/
│       └── kalasetu_canonical_v2.csv     # 2,359-item benchmark dataset
├── kalasetu_evaluation_summary.json      # Benchmark validation results & accuracy metrics
├── test_integration.py                   # 5-second test script to verify setup
└── INTEGRATION_GUIDE.md                  # This file
```

---

## 2. Dependencies

Install required Python libraries:
```bash
pip install pandas numpy fastapi uvicorn python-multipart
```

---

## 3. Quick Verification (Run in 5 Seconds)

From the unzipped directory, run:
```bash
python test_integration.py
```
If you see the outputs with suggested price, market reference, and Hindi guidance, the engine is fully working!

---

## 4. Python API Usage

```python
from kalasetu_engine_v2 import evaluate_artisan_product

result = evaluate_artisan_product(
    title_or_desc="Handcrafted Bastar Dhokra Brass Nandi Bull Figurine",
    artisan_wanted_price=2200.0,
    material_cost=1200.0,   # OPTIONAL: Pass None or omit if unknown
    quantity=1              # 1 for retail, 5+ triggers wholesale volume discounts
)

# Key fields returned:
# result["suggested_price"]            -> Recommended fair selling target (e.g. 3300.0)
# result["recommended_min"]            -> Lower bound of fair range (e.g. 2800.0)
# result["recommended_max"]            -> Upper bound of fair range (e.g. 4600.0)
# result["pricing"]["cost_floor"]      -> Loss-prevention floor (e.g. 1700.0)
# result["guidance"]["hindi"]          -> Bilingual advice with profit calculation
```

---

## 5. FastAPI Endpoint Implementation

Copy `kalasetu_engine_v2.py` into your backend folder and add this endpoint to your FastAPI router:

```python
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from typing import Optional
from kalasetu_engine_v2 import evaluate_artisan_product

router = APIRouter(prefix="/api/v1/pricing", tags=["Pricing"])

@router.post("/estimate")
async def estimate_price(
    selling_price: float = Form(..., description="Artisan intended selling price"),
    product_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    material_cost: Optional[float] = Form(None),  # Optional
    quantity: Optional[int] = Form(1),
    image: Optional[UploadFile] = File(None)
):
    query = f"{product_name or ''} {description or ''}".strip()
    if not query and not image:
        raise HTTPException(status_code=400, detail="Provide product name, description, or image.")
    
    result = evaluate_artisan_product(
        title_or_desc=query or (image.filename if image else "Handicraft item"),
        artisan_wanted_price=selling_price,
        material_cost=material_cost,
        quantity=quantity or 1
    )
    return result
```

---

## 6. React Frontend Call

```javascript
import axios from 'axios';

export async function fetchPriceEstimate({ imageFile, sellingPrice, productName, description, materialCost, quantity = 1 }) {
  const formData = new FormData();
  if (imageFile) formData.append('image', imageFile);
  formData.append('selling_price', sellingPrice);
  if (productName) formData.append('product_name', productName);
  if (description) formData.append('description', description);
  if (materialCost) formData.append('material_cost', materialCost);
  formData.append('quantity', quantity);

  const res = await axios.post('http://127.0.0.1:8000/api/v1/pricing/estimate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}
```

---

## 7. Key Engineering Principles

1. **Decoupled Range**: `recommended_min` (P25/Floor) < `suggested_price` (Growth sweet spot) < `recommended_max` (P75/Boutique).
2. **Optional Material Cost**: If provided, guarantees artisan craft margins (35%-50%). If omitted, smoothly derives an 85% safety baseline.
3. **Sub-20ms Latency**: Dataset is loaded into RAM on startup; zero network delays or external API rate limits.
