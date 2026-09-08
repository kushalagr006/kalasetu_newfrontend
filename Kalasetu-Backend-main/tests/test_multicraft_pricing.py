from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

crafts_to_test = [
    ("Madhubani Peacock Painting", 1500.0, "Kachni and Bharni handpainted artwork on handmade paper"),
    ("Channapatna Wooden Spinning Top Set", 450.0, "Lacquered vegetable-dyed wooden toy"),
    ("Sikki Grass Handwoven Storage Basket", 850.0, "Golden grass traditional bihar craft box"),
    ("Sujini Embroidered Cushion Cover Set", 1200.0, "Hand-stitched running thread cotton cover"),
    ("Bastar Dhokra Brass Nandi Statue", 2500.0, "Lost wax metal casting artifact")
]

for name, price, desc in crafts_to_test:
    res = client.post(
        "/api/v1/pricing/estimate",
        data={
            "selling_price": price,
            "product_name": name,
            "description": desc,
            "quantity": 1
        }
    )
    assert res.status_code == 200
    data = res.json()
    print(f"[{data['craft_category']}] '{name}' Quoted: ₹{price} -> Suggested: ₹{data['suggested_price']} (Range: ₹{data['recommended_min']}-₹{data['recommended_max']})")

print("All craft categories evaluated successfully!")
