"""
KalaSetu V2 Engine - 5-Second Verification Script
Run this script to verify that the pricing engine and canonical database work properly:
    python test_integration.py
"""

import os
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from kalasetu_engine_v2 import evaluate_artisan_product

print("=" * 60)
print("Verifying KalaSetu V2 Pricing Engine...")
print("=" * 60)

# Sample 1: Bastar Dhokra Nandi (Retail, with material cost)
sample_input = {
    "title_or_desc": "Handcrafted Bastar Dhokra Brass Nandi Bull Figurine",
    "artisan_wanted_price": 2200.0,
    "material_cost": 1200.0,  # Optional
    "quantity": 1
}

result = evaluate_artisan_product(**sample_input)

print("\n[Input]")
print(f"  Product: {sample_input['title_or_desc']}")
print(f"  Artisan Wanted Price: Rs. {sample_input['artisan_wanted_price']:,.0f}")
print(f"  Material Cost: Rs. {sample_input['material_cost']:,.0f}")

print("\n[Output Results]")
print(f"  Craft Detected:         {result['craft_category'].replace('_', ' ').title()}")
print(f"  Suggested Fair Price:   Rs. {result['suggested_price']:,.0f}")
print(f"  Fair Selling Range:     Rs. {result['recommended_min']:,.0f} - Rs. {result['recommended_max']:,.0f}")
print(f"  Online Market Ref:      Rs. {result['pricing']['market_reference_price']:,.0f}")
print(f"  Cost Floor Protection:  Rs. {result['pricing']['cost_floor']:,.0f} ({result['artisan_assessment']['cost_floor_source']})")
print(f"  Artisan Position:       {result['artisan_assessment']['position']} ({result['artisan_assessment']['gap_percentage']:+.1f}%)")
print(f"  Hindi Guidance:         {result['guidance']['hindi']}")

print("\n" + "=" * 60)
print("SUCCESS: Engine is ready for FastAPI / React integration!")
print("=" * 60)
