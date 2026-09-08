import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_pricing_estimate_endpoint():
    response = client.post(
        "/api/v1/pricing/estimate",
        data={
            "selling_price": 2200.0,
            "product_name": "Handcrafted Bastar Dhokra Brass Nandi Bull Figurine",
            "description": "Traditional tribal brass bell metal craft statue",
            "material_cost": 1200.0,
            "quantity": 1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "suggested_price" in data
    assert "recommended_min" in data
    assert "recommended_max" in data
    assert "guidance" in data
    assert data["suggested_price"] > 0

def test_multilingual_bhashini_translation_pricing():
    # Test Hindi input
    response = client.post(
        "/api/v1/pricing/estimate",
        data={
            "selling_price": 1800.0,
            "product_name": "हस्तनिर्मित बस्तर ढोकरा पीतल की नंदी बैल मूर्ति",
            "description": "पारंपरिक जनजातीय पीतल घंटी धातु मूर्तिकला",
            "source_language": "hi"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "translated_query_en" in data
    assert "source_query_raw" in data
    assert data["suggested_price"] > 0
    print(f"Hindi Raw Query: '{data['source_query_raw']}'")
    print(f"Bhashini Translated Query: '{data['translated_query_en']}'")
    print(f"Evaluated Craft: '{data['craft_category']}' -> Suggested: ₹{data['suggested_price']}")

if __name__ == "__main__":
    test_pricing_estimate_endpoint()
    test_multilingual_bhashini_translation_pricing()
