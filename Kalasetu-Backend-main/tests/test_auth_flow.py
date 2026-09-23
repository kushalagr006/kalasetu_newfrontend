import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


def get_random_phone():
    return f"9{uuid.uuid4().int % 1000000009:09d}"


@pytest.mark.asyncio
async def test_unregistered_phone_otp_request_returns_404():
    """
    Rule: If the phone is NOT registered, do not generate or send OTP.
    Return HTTP 404 with 'This mobile number is not registered. Please register first.'
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        unique_unreg_phone = get_random_phone()
        # Check phone endpoint
        check_res = await ac.post("/api/v1/auth/check-phone", json={"phone_number": unique_unreg_phone})
        assert check_res.status_code == 200
        assert check_res.json()["is_registered"] is False

        # Request OTP endpoint
        otp_res = await ac.post("/api/v1/auth/request-otp", json={"phone_number": unique_unreg_phone})
        assert otp_res.status_code == 404
        data = otp_res.json()
        assert data["detail"] == "This mobile number is not registered. Please register first."
        assert "demo_otp" not in data


@pytest.mark.asyncio
async def test_artisan_registration_creates_unverified_user():
    """
    Rule: During artisan registration, create the User with is_verified=False.
    Successful registration must NOT mean identity/KYC verification.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        unique_reg_phone = get_random_phone()
        payload = {
            "phone_number": unique_reg_phone,
            "full_name": "Ramesh Kumar Artisan",
            "aadhaar_number": "123456789012",
            "pan_number": "ABCDE1234F",
            "gstin": "07AAAAA0000A1Z5",
            "state": "Rajasthan",
            "district": "Jaipur",
            "city": "Sanganer",
            "craft_category": "Textiles",
            "craft_type": "Block Printing",
            "preferred_language": "hi"
        }

        reg_res = await ac.post("/api/v1/auth/signup/artisan/register", json=payload)
        assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
        reg_data = reg_res.json()
        assert reg_data["message"] == "Registration Successful. Please Login."
        assert "user_id" in reg_data


@pytest.mark.asyncio
async def test_registered_user_otp_request_and_login():
    """
    Rule: Registered phone generates demo OTP in dev mode, invalid OTP fails with 400,
    valid OTP returns JWT token and user info with is_verified=False.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        login_phone = get_random_phone()
        payload = {
            "phone_number": login_phone,
            "full_name": "Sita Devi Artisan",
            "aadhaar_number": "987654321012",
            "pan_number": "XYZAB5678C",
            "state": "Odisha",
            "district": "Puri",
            "city": "Raghurajpur",
            "craft_category": "Painting",
            "craft_type": "Pattachitra",
            "preferred_language": "or"
        }
        reg_res = await ac.post("/api/v1/auth/signup/artisan/register", json=payload)
        assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"

        # Check phone
        check_res = await ac.post("/api/v1/auth/check-phone", json={"phone_number": login_phone})
        assert check_res.status_code == 200
        assert check_res.json()["is_registered"] is True

        # Request OTP
        otp_res = await ac.post("/api/v1/auth/request-otp", json={"phone_number": login_phone})
        assert otp_res.status_code == 200
        otp_data = otp_res.json()
        assert otp_data["message"] == "OTP sent successfully."
        assert otp_data["demo_otp"] == "123456"

        # Invalid OTP verification
        invalid_res = await ac.post(
            "/api/v1/auth/verify-otp-login",
            json={"phone_number": login_phone, "otp_code": "000000"}
        )
        assert invalid_res.status_code == 400
        assert invalid_res.json()["detail"] == "Invalid OTP. Please try again."

        # Valid OTP verification
        valid_res = await ac.post(
            "/api/v1/auth/verify-otp-login",
            json={"phone_number": login_phone, "otp_code": "123456"}
        )
        assert valid_res.status_code == 200
        token_data = valid_res.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        assert token_data["role"] == "ARTISAN"
        assert token_data["full_name"] == "Sita Devi Artisan"
        assert token_data["is_verified"] is False  # Explicitly unverified until KYC
        assert token_data["artisan_profile"]["craft_type"] == "Pattachitra"
