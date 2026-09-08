import base64
import io
import os
import re
import subprocess
from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel

import imageio_ffmpeg
import speech_recognition as sr

from app.services.bhashini import bhashini_service

# Locate FFmpeg executable provided by imageio_ffmpeg
try:
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
except Exception as ff_err:
    print(f"Warning locating FFmpeg executable: {ff_err}")
    ffmpeg_exe = "ffmpeg"

router = APIRouter()

class BhashiniSTTRequest(BaseModel):
    field_type: str  # 'name', 'phone', 'aadhaar', 'pan', 'gst', 'state', 'district', 'city', 'work'
    language: str = "hi"  # 'hi', 'en', 'bn', 'bho', 'mr', 'gu', 'raj', 'kn'
    voice_text: Optional[str] = None
    audio_base64: Optional[str] = None
    bhashini_api_key: Optional[str] = None
    user_id: Optional[str] = None

# Multilingual mock dictionary for Bhashini NLP extraction
BHASHINI_FIELD_LOCALIZATION: Dict[str, Dict[str, str]] = {
    "name": {
        "hi": "रमेश प्रजापति",
        "en": "Ramesh Prajapati",
        "bn": "রমেশ প্রজাপতি",
        "bho": "रमेश प्रजापति",
        "mr": "रमेश प्रजापती",
        "gu": "રમેશ પ્રજાપતિ",
        "raj": "रमेश प्रजापत",
        "kn": "ರಮೇಶ್ ಪ್ರಜಾಪತಿ",
    },
    "phone": {
        "hi": "9876543210",
        "en": "9876543210",
        "bn": "9876543210",
        "bho": "9876543210",
        "mr": "9876543210",
        "gu": "9876543210",
        "raj": "9876543210",
        "kn": "9876543210",
    },
    "aadhaar": {
        "hi": "987654321098",
        "en": "987654321098",
        "bn": "987654321098",
        "bho": "987654321098",
        "mr": "987654321098",
        "gu": "987654321098",
        "raj": "987654321098",
        "kn": "987654321098",
    },
    "pan": {
        "hi": "ABCDE1234F",
        "en": "ABCDE1234F",
        "bn": "ABCDE1234F",
        "bho": "ABCDE1234F",
        "mr": "ABCDE1234F",
        "gu": "ABCDE1234F",
        "raj": "ABCDE1234F",
        "kn": "ABCDE1234F",
    },
    "gst": {
        "hi": "22AAAAA0000A1Z5",
        "en": "22AAAAA0000A1Z5",
        "bn": "22AAAAA0000A1Z5",
        "bho": "22AAAAA0000A1Z5",
        "mr": "22AAAAA0000A1Z5",
        "gu": "22AAAAA0000A1Z5",
        "raj": "22AAAAA0000A1Z5",
        "kn": "22AAAAA0000A1Z5",
    },
    "state": {
        "hi": "राजस्थान",
        "en": "Rajasthan",
        "bn": "পশ্চিমবঙ্গ",
        "bho": "बिहार",
        "mr": "महाराष्ट्र",
        "gu": "ગુજરાત",
        "raj": "राजस्थान",
        "kn": "ಕರ್ನಾಟಕ",
    },
    "district": {
        "hi": "जयपुर",
        "en": "Jaipur",
        "bn": "কলকাতা",
        "bho": "पटना",
        "mr": "पुणे",
        "gu": "અમદાવાદ",
        "raj": "जोधपुर",
        "kn": "ಬೆಂಗಳೂರು",
    },
    "city": {
        "hi": "सांगानेर",
        "en": "Sanganer",
        "bn": "শান্তিপুর",
        "bho": "आरा",
        "mr": "पैठण",
        "gu": "પાટણ",
        "raj": "बगरू",
        "kn": "ಚನ್ನಪಟ್ಟಣ",
    },
    "work": {
        "hi": "मिट्टी के पारंपरिक बर्तन और हस्तशिल्प",
        "en": "Traditional Terracotta Clay Pottery & Handicrafts",
        "bn": "ঐতিহ্যবাহী মাটির পাত্র ও হস্তশিল্প",
        "bho": "माटी के बर्तन आ पारंपरिक कारीगरी",
        "mr": "पारंपारिक मातीची भांडी आणि हस्तकला",
        "gu": "પરંપરાગત માટીકામ અને હસ્તકળા",
        "raj": "माटी रा भांडा अर देसी कारीगरी",
        "kn": "ಸಾಂಪ್ರದಾಯಿಕ ಮಣ್ಣಿನ ಮಡಕೆಗಳು ಮತ್ತು ಕರಕುಶಲತೆ",
    },
}

def clean_field_value(raw_text: str, field_type: str, language: str) -> str:
    """Format transcribed voice into valid field text according to field type and language"""
    if not raw_text or not raw_text.strip():
        return ""

    text = raw_text.strip()
    
    if field_type == "aadhaar":
        digits = re.sub(r"\D", "", text)
        return digits[:12] if digits else text
        
    elif field_type == "pan":
        clean = re.sub(r"[^a-zA-Z0-9]", "", text).upper()
        return clean[:10] if clean else text
        
    elif field_type == "gst":
        clean = re.sub(r"[^a-zA-Z0-9]", "", text).upper()
        return clean[:15] if clean else text
        
    elif field_type == "phone":
        digits = re.sub(r"\D", "", text)
        return digits[-10:] if digits else text
        
    return text

def convert_audio_to_wav_16k(raw_audio_bytes: bytes) -> bytes:
    """Converts any audio input bytes (m4a, 3gp, webm, wav, mp3, aac) to 16kHz mono 16-bit PCM WAV bytes via FFmpeg pipe."""
    if not raw_audio_bytes:
        return b""
    try:
        cmd = [
            ffmpeg_exe,
            "-y",
            "-i", "pipe:0",
            "-f", "wav",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            "pipe:1"
        ]
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        out_wav, err = process.communicate(input=raw_audio_bytes)
        if process.returncode == 0 and len(out_wav) > 0:
            return out_wav
        else:
            print(f"FFmpeg conversion pipe error: {err.decode('utf-8', errors='ignore')}")
            return raw_audio_bytes
    except Exception as e:
        print(f"FFmpeg conversion exception: {e}")
        return raw_audio_bytes

@router.post("/speech-to-text")
async def speech_to_text(payload: BhashiniSTTRequest):
    """
    BHASHINI Speech-to-Text & Regional Field Extraction Endpoint
    Converts speech or raw voice transcript to structured input field in the requested language.
    """
    raw_text = payload.voice_text
    lang = payload.language or "hi"
    field = payload.field_type

    if payload.bhashini_api_key:
        bhashini_service.api_key = payload.bhashini_api_key
    if payload.user_id:
        bhashini_service.user_id = payload.user_id

    if not raw_text and payload.audio_base64:
        try:
            raw_bytes = base64.b64decode(payload.audio_base64)
            print(f"[STT Endpoint] Received audio base64 payload size: {len(raw_bytes)} bytes")

            # 1. Standardize audio to 16kHz Mono PCM WAV
            wav_bytes = convert_audio_to_wav_16k(raw_bytes)
            print(f"[STT Endpoint] Converted WAV 16kHz size: {len(wav_bytes)} bytes")

            # 2. Attempt Bhashini ASR Pipeline first
            try:
                bhashini_text = await bhashini_service.speech_to_text(wav_bytes, source_language=lang)
                if bhashini_text and bhashini_text.strip():
                    raw_text = bhashini_text.strip()
                    print(f"[STT Endpoint] Transcribed using Bhashini ASR: '{raw_text}'")
            except Exception as bh_err:
                print(f"[STT Endpoint] Bhashini ASR pipeline error: {bh_err}")

            # 3. Fallback to Multi-regional ASR engine if Bhashini API returns empty
            if not raw_text:
                google_lang_map = {
                    "hi": "hi-IN",
                    "en": "en-IN",
                    "bn": "bn-IN",
                    "mr": "mr-IN",
                    "gu": "gu-IN",
                    "kn": "kn-IN",
                    "ta": "ta-IN",
                    "te": "te-IN",
                    "bho": "hi-IN",
                    "raj": "hi-IN",
                }
                google_locale = google_lang_map.get(lang, "en-IN")

                recognizer = sr.Recognizer()
                try:
                    with sr.AudioFile(io.BytesIO(wav_bytes)) as source:
                        audio_data = recognizer.record(source)
                    raw_text = recognizer.recognize_google(audio_data, language=google_locale)
                    print(f"[STT Endpoint] Transcribed using Primary Fallback ASR ({google_locale}): '{raw_text}'")
                except Exception as sr_err:
                    print(f"[STT Endpoint] SpeechRecognition error for {google_locale}: {sr_err}")
                    # Try English as secondary fallback locale if primary locale failed
                    if google_locale != "en-IN":
                        try:
                            with sr.AudioFile(io.BytesIO(wav_bytes)) as source:
                                audio_data = recognizer.record(source)
                            raw_text = recognizer.recognize_google(audio_data, language="en-IN")
                            print(f"[STT Endpoint] Transcribed using Secondary Fallback ASR (en-IN): '{raw_text}'")
                        except Exception as sr_err2:
                            print(f"[STT Endpoint] Secondary SpeechRecognition error: {sr_err2}")
        except Exception as e:
            print(f"[STT Endpoint] Audio processing error: {e}")
            raw_text = None

    result_text = clean_field_value(raw_text, field, lang)

    return {
        "success": True,
        "field_type": field,
        "language": lang,
        "text": result_text,
        "provider": "BHASHINI_AI" if raw_text else "NONE"
    }
