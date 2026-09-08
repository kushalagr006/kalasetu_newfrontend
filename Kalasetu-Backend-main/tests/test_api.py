import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root_and_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/")
        assert res.status_code == 200
        assert res.json()["status"] == "ONLINE"

        health = await ac.get("/health")
        assert health.status_code == 200
        assert health.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_identity_verifications():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Aadhaar test
        aadhaar_res = await ac.post("/api/v1/verifications/aadhaar?aadhaar_number=123456789012")
        assert aadhaar_res.status_code == 200
        assert aadhaar_res.json()["is_valid"] is True

        # PAN test
        pan_res = await ac.post("/api/v1/verifications/pan?pan_number=ABCDE1234F")
        assert pan_res.status_code == 200
        assert pan_res.json()["is_valid"] is True

        # GSTIN test
        gst_res = await ac.post("/api/v1/verifications/gstin?gstin=07AAAAA0000A1Z5")
        assert gst_res.status_code == 200
        assert gst_res.json()["is_valid"] is True


@pytest.mark.asyncio
async def test_speech_to_catalog():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "voice_text": "यह हाथ से बना बांस का दीया स्टैंड है। मूल्य ₹450 है।",
            "source_language": "hi"
        }
        res = await ac.post("/api/v1/products/speech-to-catalog", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "Handmade Bamboo" in data["title"]
        assert data["price"] == 450.0
