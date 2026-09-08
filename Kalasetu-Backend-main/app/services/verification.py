import re
from typing import Dict, Any


def verify_aadhaar_mock(aadhaar_number: str) -> Dict[str, Any]:
    """
    Simulates UIDAI Aadhaar OTP & KYC Verification API.
    Validates 12-digit format and returns verified status payload.
    """
    clean_num = re.sub(r"\D", "", aadhaar_number)
    if len(clean_num) != 12:
        return {
            "is_valid": False,
            "status": "INVALID_FORMAT",
            "message": "Aadhaar number must contain exactly 12 digits."
        }
    return {
        "is_valid": True,
        "status": "VERIFIED",
        "aadhaar_last4": clean_num[-4:],
        "message": "Aadhaar verified successfully via UIDAI Mock API."
    }


def verify_pan_mock(pan_number: str) -> Dict[str, Any]:
    """
    Simulates NSDL PAN Card Verification API.
    Validates 10-character alphanumeric pattern (ABCDE1234F).
    """
    clean_pan = pan_number.upper().strip()
    pattern = r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    if not re.match(pattern, clean_pan):
        return {
            "is_valid": False,
            "status": "INVALID_FORMAT",
            "message": "PAN number format must match ABCDE1234F."
        }
    return {
        "is_valid": True,
        "status": "VERIFIED",
        "pan_number": clean_pan,
        "message": "PAN card verified successfully via NSDL Mock API."
    }


def verify_gstin_mock(gstin: str) -> Dict[str, Any]:
    """
    Simulates GSTN Taxpayer Verification API.
    Validates 15-character GSTIN pattern.
    """
    clean_gst = gstin.upper().strip()
    pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
    if not re.match(pattern, clean_gst):
        return {
            "is_valid": False,
            "status": "INVALID_FORMAT",
            "message": "Invalid GSTIN format."
        }
    return {
        "is_valid": True,
        "status": "VERIFIED",
        "gstin": clean_gst,
        "taxpayer_name": "KalaSetu Verified Enterprise",
        "state_code": clean_gst[:2]
    }
