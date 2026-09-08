from fastapi import APIRouter
from app.services.verification import verify_aadhaar_mock, verify_pan_mock, verify_gstin_mock

router = APIRouter()


@router.post("/aadhaar")
async def check_aadhaar(aadhaar_number: str):
    """
    Mock UIDAI API endpoint for Aadhaar verification.
    """
    return verify_aadhaar_mock(aadhaar_number)


@router.post("/pan")
async def check_pan(pan_number: str):
    """
    Mock NSDL API endpoint for PAN card verification.
    """
    return verify_pan_mock(pan_number)


@router.post("/gstin")
async def check_gstin(gstin: str):
    """
    Mock GSTN API endpoint for GSTIN taxpayer verification.
    """
    return verify_gstin_mock(gstin)
