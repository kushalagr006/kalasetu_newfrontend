import os
import sys
from contextlib import asynccontextmanager

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.services.ai_studio_enhancer import get_rembg_session, process_enhance_camera_photo
from app.services.cv_enhancer import enhance_product_bytes

# Ensure upload directory exists
os.makedirs("uploads/products", exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup DB initialization & Global AI Model Pre-Loading in Memory
    await init_db()
    try:
        print("[INFO] Lifespan: Pre-loading rembg ISNet & AI Enhancement Models globally...")
        get_rembg_session()
    except Exception as e:
        print(f"[WARNING] Model preloading exception during lifespan: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Multilingual E-Commerce & Procurement Platform for Marginalized Artisans (SIH PS 26090)",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


from pydantic import BaseModel
import base64

try:
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from image_enhancer import enhance_image_bytes
except Exception as e:
    from app.services.cv_enhancer import enhance_product_bytes as enhance_image_bytes

class ImageBase64Payload(BaseModel):
    image_base64: str

@app.post("/api/enhance-camera-photo-base64", tags=["AI Photo Studio"])
async def enhance_camera_photo_base64(payload: ImageBase64Payload):
    raw_b64 = payload.image_base64
    if "," in raw_b64:
        raw_b64 = raw_b64.split(",")[1]
    
    image_bytes = base64.b64decode(raw_b64)
    print(f"[API SERVER BASE64] Received photo ({len(image_bytes)} bytes) for AI Enhancement...")
    enhanced_jpeg_bytes = enhance_image_bytes(image_bytes)
    enhanced_b64 = base64.b64encode(enhanced_jpeg_bytes).decode('utf-8')
    print(f"[API SERVER BASE64] Enhancement complete! Saved enhanced_photo.jpg. Returning base64 payload.")
    return {
        "enhanced_base64": f"data:image/jpeg;base64,{enhanced_b64}",
        "ai_enhanced": True,
        "saved_as": "enhanced_photo.jpg",
    }

@app.get("/enhanced_photo.jpg", tags=["AI Photo Studio"])
async def get_enhanced_photo_file():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(backend_dir, "enhanced_photo.jpg")
    if os.path.exists(path):
        from fastapi.responses import FileResponse
        return FileResponse(path, media_type="image/jpeg")
    return Response(content=b"Photo not found", status_code=404)

@app.post("/api/enhance-camera-photo", tags=["AI Photo Studio"])
async def enhance_camera_photo(file: UploadFile = File(...)):
    """
    AI Photo Enhancement Endpoint:
    Uses image_enhancer.py from new_image_enhancement to segment background,
    apply soft shadow, color balance, and save enhanced_photo.jpg.
    """
    contents = await file.read()
    print(f"[API SERVER] Received photo ({len(contents)} bytes) for AI Enhancement...")
    enhanced_jpeg_bytes = enhance_image_bytes(contents)
    print(f"[API SERVER] AI Enhancement complete! Returning {len(enhanced_jpeg_bytes)} bytes.")
    return Response(content=enhanced_jpeg_bytes, media_type="image/jpeg")


@app.get("/", tags=["System"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "sih_ps": "26090 - Ministry of Social Justice & Empowerment",
        "docs_url": "/docs",
        "status": "ONLINE"
    }


@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy"}
