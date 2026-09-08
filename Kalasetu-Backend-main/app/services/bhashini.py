import httpx
from typing import Dict, Any, Optional
from app.core.config import settings


class BhashiniService:
    """
    BHASHINI API integration service for Speech-to-Text (STT) and
    multilingual NLP translation for Indian regional languages.
    """

    def __init__(self):
        self.api_key = settings.BHASHINI_API_KEY
        self.pipeline_id = settings.BHASHINI_PIPELINE_ID

    async def speech_to_text(self, audio_content: bytes, source_language: str = "hi") -> str:
        """
        Converts Indian language speech audio into structured written text in real-time using BHASHINI ASR.
        Supports regional Indian languages (Hindi, Bengali, Marathi, Gujarati, Kannada, Tamil, Telugu, English, etc.).
        """
        if not audio_content:
            return ""

        bhashini_lang_map = {
            "hi": "hi",
            "en": "en",
            "bn": "bn",
            "mr": "mr",
            "gu": "gu",
            "kn": "kn",
            "ta": "ta",
            "te": "te",
            "bho": "hi",
            "raj": "hi",
        }
        lang_code = bhashini_lang_map.get(source_language, "hi")

        # 1. Attempt official Bhashini ASR Dhruva API if API Key is set
        if self.api_key and self.api_key != "mock_bhashini_api_key_sih":
            try:
                import base64
                base64_audio = base64.b64encode(audio_content).decode("utf-8")
                headers = {
                    "Authorization": self.api_key,
                    "Content-Type": "application/json"
                }
                user_id = getattr(self, 'user_id', None) or getattr(settings, 'BHASHINI_USER_ID', '')
                if user_id:
                    headers["userID"] = user_id

                payload = {
                    "pipelineTasks": [
                        {
                            "taskType": "asr",
                            "config": {
                                "language": {"sourceLanguage": lang_code},
                                "audioFormat": "wav",
                                "samplingRate": 16000
                            }
                        }
                    ],
                    "inputData": {
                        "audio": [
                            {
                                "audioContent": base64_audio
                            }
                        ]
                    }
                }

                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                        headers=headers,
                        json=payload,
                        timeout=12.0
                    )
                    print(f"[Bhashini ASR] HTTP status: {response.status_code}")
                    if response.status_code == 200:
                        data = response.json()
                        out_text = data.get("pipelineResponse", [{}])[0].get("output", [{}])[0].get("source", "")
                        if out_text:
                            print(f"[Bhashini ASR] Output text: '{out_text}'")
                            return out_text
                    else:
                        print(f"[Bhashini ASR] Non-200 response: {response.text}")
            except Exception as e:
                print(f"[Bhashini ASR] Pipeline exception: {str(e)}")

        return ""

    async def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text between Indian languages and English.
        """
        if source_lang == target_lang:
            return text
        
        # Simple mock translation map for offline testing
        if self.api_key == "mock_bhashini_api_key_sih":
            return f"[{target_lang.upper()} Translation]: {text}"
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                    headers={"Authorization": self.api_key},
                    json={
                        "pipelineTasks": [
                            {
                                "taskType": "translation",
                                "config": {
                                    "language": {
                                        "sourceLanguage": source_lang,
                                        "targetLanguage": target_lang
                                    }
                                }
                            }
                        ],
                        "inputData": {"input": [{"source": text}]}
                    },
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["pipelineResponse"][0]["output"][0]["target"]
        except Exception:
            pass

        return text

    async def parse_catalog_from_speech(self, voice_text: str) -> Dict[str, Any]:
        """
        Extracts structured product metadata from raw voice input using NLP rules.
        """
        # Extract title
        title = "Handcrafted Artisan Product"
        if "बांस" in voice_text or "bamboo" in voice_text.lower():
            title = "Handmade Bamboo Craft Decor"
            category = "Bamboo Craft"
            material = "Bamboo"
        elif "कपड़ा" in voice_text or "textile" in voice_text.lower() or "साड़ी" in voice_text:
            title = "Traditional Handloom Textile Product"
            category = "Textile & Handloom"
            material = "Cotton / Silk"
        elif "मिट्टी" in voice_text or "pottery" in voice_text.lower() or "पात्र" in voice_text:
            title = "Terracotta Earthenware Pot"
            category = "Pottery & Clay"
            material = "Terracotta Clay"
        else:
            category = "Handicrafts"
            material = "Natural Eco Materials"

        # Price estimation
        import re
        price_match = re.search(r"₹?\s*(\d+)", voice_text)
        price = float(price_match.group(1)) if price_match else 450.0

        return {
            "title": title,
            "description": f"Refined AI-generated catalog from artisan voice note: '{voice_text}'",
            "category": category,
            "material_used": material,
            "price": price,
            "recommended_price": round(price * 1.15, 2)  # Fair trade market recommendation
        }


bhashini_service = BhashiniService()
