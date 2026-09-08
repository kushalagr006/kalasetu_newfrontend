import io
import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageOps
import rembg

REMBG_SESSION = None
SR_MODEL = None

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
NEW_ENHANCEMENT_DIR = os.path.join(BACKEND_DIR, "new_image_enhancement")
os.makedirs(NEW_ENHANCEMENT_DIR, exist_ok=True)


def get_rembg_session():
    global REMBG_SESSION
    if REMBG_SESSION is None:
        print("[INFO] Loading rembg ISNet AI model session (isnet-general-use)...")
        try:
            REMBG_SESSION = rembg.new_session("isnet-general-use")
            print("[SUCCESS] rembg ISNet AI model session loaded into memory!")
        except Exception as e:
            print(f"[WARNING] ISNet session loading fallback: {e}")
            REMBG_SESSION = rembg.new_session("u2net")
    return REMBG_SESSION


def get_sr_model():
    global SR_MODEL
    if SR_MODEL is None:
        model_paths = [
            os.path.join(BACKEND_DIR, "FSRCNN_x4.pb"),
            os.path.join(BACKEND_DIR, "..", "FSRCNN_x4.pb"),
            "FSRCNN_x4.pb",
        ]
        found_path = None
        for p in model_paths:
            if os.path.exists(p):
                found_path = p
                break

        if found_path:
            try:
                sr = cv2.dnn_superres.DnnSuperResImpl_create()
                sr.readModel(found_path)
                sr.setModel("fsrcnn", 4)
                SR_MODEL = sr
                print("[SUCCESS] Super-resolution FSRCNN_x4 model loaded!")
            except Exception as e:
                print(f"[WARNING] Could not initialize FSRCNN DNN: {e}")
    return SR_MODEL


def clean_mask(raw_alpha, feather=3):
    mask_np = np.array(raw_alpha).astype(np.uint8)

    _, presence = cv2.threshold(mask_np, 30, 255, cv2.THRESH_BINARY)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(presence, connectivity=8)
    if num_labels > 1:
        largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        keep = (labels == largest_label).astype(np.uint8)
    else:
        keep = np.ones_like(mask_np)

    kernel = np.ones((7, 7), np.uint8)
    keep = cv2.dilate(keep, kernel)

    cleaned = mask_np * keep
    cleaned = cv2.GaussianBlur(cleaned, (feather, feather), 0)
    return Image.fromarray(cleaned)


def create_soft_shadow(mask, size, blur_radius=25, opacity=90):
    shadow = Image.new("L", size, 0)
    mask_np = np.array(mask)
    ys, xs = np.where(mask_np > 10)
    if len(xs) == 0:
        return shadow
    x_min, x_max, y_max = xs.min(), xs.max(), ys.max()
    shadow_w = int((x_max - x_min) * 0.8)
    shadow_h = int(shadow_w * 0.25)
    cx = (x_min + x_max) // 2
    draw = ImageDraw.Draw(shadow)
    draw.ellipse(
        [cx - shadow_w // 2, y_max - shadow_h // 2, cx + shadow_w // 2, y_max + shadow_h // 2],
        fill=opacity,
    )
    return shadow.filter(ImageFilter.GaussianBlur(blur_radius))


def studio_background(size, color=(250, 250, 250)):
    w, h = size
    bg = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(h):
        factor = 1 - (y / h) * 0.06
        bg[y, :] = [int(c * factor) for c in color]
    return Image.fromarray(bg)


def gentle_enhance(pil_img):
    img = ImageOps.autocontrast(pil_img, cutoff=1)
    img = ImageEnhance.Color(img).enhance(1.08)
    img = ImageEnhance.Brightness(img).enhance(1.03)
    return img


def enhance_product_image(original: Image.Image, canvas_size=(1400, 1400)) -> Image.Image:
    original = original.convert("RGB")
    rembg_session = get_rembg_session()

    no_bg = rembg.remove(original, session=rembg_session)
    alpha_mask = clean_mask(no_bg.split()[3])

    mask_np = np.array(alpha_mask)
    ys, xs = np.where(mask_np > 30)
    if len(xs) == 0:
        print("[WARNING] No object detected in photo.")
        return original

    x_min, x_max, y_min, y_max = xs.min(), xs.max(), ys.min(), ys.max()
    pad = int((x_max - x_min) * 0.08)
    x_min, x_max = max(0, x_min - pad), min(original.width, x_max + pad)
    y_min, y_max = max(0, y_min - pad), min(original.height, y_max + pad)

    cropped_original = original.crop((x_min, y_min, x_max, y_max))
    cropped_mask = alpha_mask.crop((x_min, y_min, x_max, y_max))

    corrected = gentle_enhance(cropped_original)

    sr_impl = get_sr_model()
    if sr_impl is not None:
        try:
            bgr_corrected = cv2.cvtColor(np.array(corrected), cv2.COLOR_RGB2BGR)
            upsampled = sr_impl.upsample(bgr_corrected)
            hd_product = Image.fromarray(cv2.cvtColor(upsampled, cv2.COLOR_BGR2RGB))
        except Exception as e:
            hd_product = corrected.resize(
                (corrected.width * 4, corrected.height * 4), Image.Resampling.LANCZOS
            )
    else:
        hd_product = corrected.resize(
            (corrected.width * 4, corrected.height * 4), Image.Resampling.LANCZOS
        )

    hd_mask = cropped_mask.resize(hd_product.size, Image.Resampling.LANCZOS)

    scale = min((canvas_size[0] * 0.7) / hd_product.width, (canvas_size[1] * 0.7) / hd_product.height)
    new_size = (int(hd_product.width * scale), int(hd_product.height * scale))
    resized_product = hd_product.resize(new_size, Image.Resampling.LANCZOS)
    resized_mask = hd_mask.resize(new_size, Image.Resampling.LANCZOS)

    bg = studio_background(canvas_size)
    px = (canvas_size[0] - new_size[0]) // 2
    py = int((canvas_size[1] - new_size[1]) * 0.62)

    full_mask = Image.new("L", canvas_size, 0)
    full_mask.paste(resized_mask, (px, py))
    shadow = create_soft_shadow(full_mask, canvas_size)
    bg.paste(Image.new("RGB", canvas_size, (0, 0, 0)), (0, 0), shadow)
    bg.paste(resized_product, (px, py), resized_mask)

    final = ImageEnhance.Sharpness(bg).enhance(1.3)
    return final


def enhance_image_bytes(image_bytes: bytes) -> bytes:
    """
    Enhances raw image bytes using AI background segmentation and studio shadow.
    Saves enhanced output as 'enhanced_photo.jpg' in backend root and new_image_enhancement/.
    Returns enhanced JPEG bytes.
    """
    try:
        orig_pil = Image.open(io.BytesIO(image_bytes))
        enhanced_pil = enhance_product_image(orig_pil)

        output_io = io.BytesIO()
        enhanced_pil.save(output_io, format="JPEG", quality=95)
        enhanced_bytes = output_io.getvalue()

        # Save enhanced_photo.jpg to the specified locations
        path_root = os.path.join(BACKEND_DIR, "enhanced_photo.jpg")
        path_sub = os.path.join(NEW_ENHANCEMENT_DIR, "enhanced_photo.jpg")

        with open(path_root, "wb") as f:
            f.write(enhanced_bytes)
        with open(path_sub, "wb") as f:
            f.write(enhanced_bytes)

        print(f"[SUCCESS] Enhanced photo saved to: {path_root} and {path_sub}")
        return enhanced_bytes
    except Exception as e:
        print(f"[WARNING] Image enhancement exception fallback: {e}")
        return image_bytes


if __name__ == "__main__":
    import sys
    test_file = sys.argv[1] if len(sys.argv) > 1 else None
    if test_file and os.path.exists(test_file):
        with open(test_file, "rb") as f:
            data = f.read()
        out = enhance_image_bytes(data)
        print(f"Done! Input {len(data)} bytes -> Output {len(out)} bytes.")
    else:
        print("Usage: python image_enhancer.py <path_to_image>")
