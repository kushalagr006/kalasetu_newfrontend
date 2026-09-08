import io
import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import rembg

# Global model session cache for 1-3s fast inference
REMBG_SESSION = None

def get_rembg_session():
    global REMBG_SESSION
    if REMBG_SESSION is None:
        print("[INFO] Pre-loading rembg ISNet AI model session (~179MB)...")
        try:
            REMBG_SESSION = rembg.new_session("isnet-general-use")
            print("[SUCCESS] rembg ISNet AI model session loaded into memory!")
        except Exception as e:
            print(f"[WARNING] ISNet session loading fallback to default: {e}")
            REMBG_SESSION = rembg.new_session("u2net")
    return REMBG_SESSION


def soften_alpha_mask(alpha_mask_np: np.ndarray) -> np.ndarray:
    """
    Applies connected components filtering, dilation, and Gaussian blur
    for smooth anti-aliased foreground edges.
    """
    # 1. Connected components filtering to remove isolated noise spots
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(alpha_mask_np)
    cleaned_mask = np.zeros_like(alpha_mask_np)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= 50:  # Remove small noise blobs
            cleaned_mask[labels == i] = 255

    # 2. Dilation to smooth sharp cuts
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated_mask = cv2.dilate(cleaned_mask, kernel, iterations=1)

    # 3. Gaussian blur for anti-aliasing edge softening
    softened_mask = cv2.GaussianBlur(dilated_mask, (5, 5), 0)
    return softened_mask


def generate_studio_background(width: int = 1400, height: int = 1400) -> Image.Image:
    """
    Creates a clean 1400x1400 professional studio radial gradient background.
    """
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    radius = np.sqrt(xx**2 + yy**2)

    # Gradient from center (248, 246, 242) to edges (228, 224, 218)
    center_color = np.array([248, 246, 242], dtype=np.float32)
    edge_color = np.array([228, 224, 218], dtype=np.float32)

    norm_radius = np.clip(radius / 1.4, 0, 1)[:, :, np.newaxis]
    gradient = (center_color * (1 - norm_radius) + edge_color * norm_radius).astype(np.uint8)

    return Image.fromarray(gradient, mode="RGB")


from app.services.cv_enhancer import enhance_product_bytes

def process_enhance_camera_photo(image_bytes: bytes) -> bytes:
    """
    Executes notebook image enhancement pipeline (rembg ISNet + clean_mask + FSRCNN + soft shadow + studio bg).
    """
    return enhance_product_bytes(image_bytes)
