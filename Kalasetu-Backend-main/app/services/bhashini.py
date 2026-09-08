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

    async def translate_text(self, text: str, source_lang: str = "auto", target_lang: str = "en") -> str:
        """
        Translates text between Indian languages and English using BHASHINI NMT / Deep Translator.
        """
        if not text or not text.strip():
            return ""
        if source_lang == target_lang:
            return text.strip()

        # 1. Attempt official Bhashini NMT Dhruva API if API Key is set
        if self.api_key and self.api_key != "mock_bhashini_api_key_sih":
            try:
                headers = {"Authorization": self.api_key, "Content-Type": "application/json"}
                src = source_lang if source_lang != "auto" else "hi"
                payload = {
                    "pipelineTasks": [
                        {
                            "taskType": "translation",
                            "config": {
                                "language": {
                                    "sourceLanguage": src,
                                    "targetLanguage": target_lang
                                }
                            }
                        }
                    ],
                    "inputData": {"input": [{"source": text}]}
                }
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                        headers=headers,
                        json=payload,
                        timeout=10.0
                    )
                    if response.status_code == 200:
                        data = response.json()
                        translated = data.get("pipelineResponse", [{}])[0].get("output", [{}])[0].get("target", "")
                        if translated and translated.strip():
                            return translated.strip()
            except Exception as e:
                print(f"[Bhashini NMT API Error]: {e}")

        # 2. Deep Translator Engine Fallback
        try:
            from deep_translator import GoogleTranslator
            s_lang = source_lang if source_lang in ["hi", "en", "bn", "mr", "gu", "kn", "ta", "te"] else "auto"
            t_lang = target_lang if target_lang in ["hi", "en", "bn", "mr", "gu", "kn", "ta", "te"] else "en"
            try:
                translated = GoogleTranslator(source=s_lang, target=t_lang).translate(text)
            except Exception:
                translated = GoogleTranslator(source="auto", target=t_lang).translate(text)
            if translated:
                return translated.strip()
        except Exception as dt_err:
            print(f"[NMT Fallback Error]: {repr(dt_err)}")

        return text.strip()

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

    async def generate_multilingual_product_dict(
        self,
        title: str,
        description: str,
        category: str,
        material: str,
        source_lang: str = "hi"
    ) -> Dict[str, Any]:
        """
        Translates product metadata into English (for Website/Buyers) and pre-generates 
        regional language dictionary for all 8 Indian languages (hi, en, bn, bho, mr, gu, raj, kn).
        """
        import json

        # 1. Translate to English for global catalog & buyer website view
        if source_lang == "en":
            title_en = title
            description_en = description
            category_en = category
            material_en = material
        else:
            title_en = await self.translate_text(title, source_lang=source_lang, target_lang="en")
            description_en = await self.translate_text(description, source_lang=source_lang, target_lang="en")
            category_en = await self.translate_text(category, source_lang=source_lang, target_lang="en")
            material_en = await self.translate_text(material, source_lang=source_lang, target_lang="en")

        # 2. Build multilingual names dictionary for regional frontend switching
        lang_codes = ["hi", "en", "bn", "mr", "gu", "kn", "bho", "raj"]
        names_dict: Dict[str, str] = {}
        
        for code in lang_codes:
            if code == source_lang:
                names_dict[code] = title
            elif code == "en":
                names_dict[code] = title_en or title
            elif code in ["bho", "raj"]:
                hi_trans = await self.translate_text(title_en or title, source_lang="en", target_lang="hi")
                names_dict[code] = hi_trans or title
            else:
                reg_trans = await self.translate_text(title_en or title, source_lang="en", target_lang=code)
                names_dict[code] = reg_trans or title

        return {
            "title_en": title_en or title,
            "description_en": description_en or description,
            "category_en": category_en or category,
            "material_used_en": material_en or material,
            "translations_json": json.dumps(names_dict, ensure_ascii=False)
        }


bhashini_service = BhashiniService()
