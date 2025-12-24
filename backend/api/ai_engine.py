import cv2
import numpy as np
import os
from django.conf import settings
try:
    from rembg import remove
except ImportError:
    remove = None

from PIL import Image
import io

class AIEngine:
    @staticmethod
    def _read_image(source):
        """Helper to ensure we have a CV2 image (numpy array)."""
        if isinstance(source, str):
            img = cv2.imread(source)
            if img is None:
                raise ValueError(f"Could not read image from {source}")
            return img
        elif isinstance(source, np.ndarray):
            return source
        raise ValueError("Unknown image source type")

    @staticmethod
    def _save_result(image, original_path, suffix, return_path=True):
        """Helper to save processed image and return relative path."""
        if not return_path:
            return image
            
        # Create output filename
        filename = os.path.basename(original_path)
        name, ext = os.path.splitext(filename)
        new_filename = f"{name}_{suffix}{ext}"
        
        # Ensure directory exists
        processed_dir = os.path.join(settings.MEDIA_ROOT, 'processed')
        os.makedirs(processed_dir, exist_ok=True)
        
        output_path = os.path.join(processed_dir, new_filename)
        cv2.imwrite(output_path, image)
        
        # Return relative path for Django ImageField
        return os.path.join('processed', new_filename)

    @staticmethod
    def colorize_image(image_input, return_path=True, ref_path=""):
        """
        Apply 'Vintage Colorization'.
        Returns path if return_path=True, else returns image array.
        ref_path is needed for filename generation if return_path=True and input is array.
        """
        img = AIEngine._read_image(image_input)
        
        # 1. Convert to Gray
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img
        
        # 2. Apply a colormap
        colored_map = cv2.applyColorMap(gray, cv2.COLORMAP_PINK)
        
        # 3. Preserve Original Luminance
        lab_color = cv2.cvtColor(colored_map, cv2.COLOR_BGR2LAB)
        l_c, a_c, b_c = cv2.split(lab_color)
        l_orig = gray
        merged_lab = cv2.merge([l_orig, a_c, b_c])
        final_color = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)
        
        return AIEngine._save_result(final_color, ref_path, 'colorized', return_path)

    @staticmethod
    def adjust_image(image_input, brightness=1.0, contrast=1.0, saturation=1.0, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)

        # 1. Brightness and Contrast
        beta = (brightness - 1.0) * 100
        adjusted = cv2.convertScaleAbs(img, alpha=contrast, beta=beta)
        
        # 2. Saturation
        if saturation != 1.0:
            hsv = cv2.cvtColor(adjusted, cv2.COLOR_BGR2HSV)
            h, s, v = cv2.split(hsv)
            s = s.astype(np.float32) * saturation
            s = np.clip(s, 0, 255).astype(np.uint8)
            hsv = cv2.merge([h, s, v])
            adjusted = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
            
        return AIEngine._save_result(adjusted, ref_path, 'adjusted', return_path)

    @staticmethod
    def remove_scratches(image_input, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)
        # Low strength for performance, increase for quality
        denoised = cv2.fastNlMeansDenoisingColored(img, None, 5, 5, 7, 21)
        return AIEngine._save_result(denoised, ref_path, 'restored', return_path)

    @staticmethod
    def restore_faces(image_input, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)
        # Sharpening
        gaussian = cv2.GaussianBlur(img, (0, 0), 3.0)
        sharpened = cv2.addWeighted(img, 1.5, gaussian, -0.5, 0)
        return AIEngine._save_result(sharpened, ref_path, 'face_restored', return_path)

    @staticmethod
    def remove_background(image_input, return_path=True, ref_path=""):
        img_array = AIEngine._read_image(image_input)
        
        # Convert CV2 BGR to bytes for rembg input if needed, OR just pass array if rembg supports it.
        # rembg expects PIL image or bytes properly.
        # Let's use bytes for compatibility with current structure
        success, output_bytes = False, None
        
        if remove is not None:
             try:
                 # Encode to PNG to pass to rembg
                 success, encoded_img = cv2.imencode(".png", img_array)
                 if success:
                     input_bytes = encoded_img.tobytes()
                     output_bytes = remove(input_bytes)
                     
                     # Decode back to CV2
                     nparr = np.frombuffer(output_bytes, np.uint8)
                     img_nobg = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
                     return AIEngine._save_result(img_nobg, ref_path, 'nobg', return_path)
             except Exception as e:
                 print(f"rembg failed: {e}")

        # Fallback GrabCut
        print("Fallback to GrabCut")
        mask = np.zeros(img_array.shape[:2], np.uint8)
        h, w = img_array.shape[:2]
        rect = (int(w*0.05), int(h*0.05), w-int(w*0.1), h-int(h*0.1))
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)
        cv2.grabCut(img_array, mask, rect, bgdModel, fgdModel, 3, cv2.GC_INIT_WITH_RECT) # Reduced iters
        mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
        img_array = img_array * mask2[:, :, np.newaxis]
        b, g, r = cv2.split(img_array)
        d = cv2.merge([b, g, r, mask2 * 255])
        return AIEngine._save_result(d, ref_path, 'nobg_grabcut', return_path)

    @staticmethod
    def auto_enhance(image_input, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        return AIEngine._save_result(final, ref_path, 'auto_enhanced', return_path)

    @staticmethod
    def inpaint_object(image_input, mask_input, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)
        
        if isinstance(mask_input, str):
            # Read as unchanged to preserve Alpha channel if present
            mask_src = cv2.imread(mask_input, cv2.IMREAD_UNCHANGED)
        else:
            mask_src = mask_input
            
        if mask_src is None: 
            print("DEBUG: Mask is None")
            raise ValueError("Invalid mask")
            
        # Handle formats
        if len(mask_src.shape) == 3:
            # RGB/BGR - convert to Gray
            mask = cv2.cvtColor(mask_src, cv2.COLOR_BGR2GRAY)
        elif len(mask_src.shape) == 4:
            # BGRA - use Alpha channel as mask
            # This is critical for frontend canvas which exports transparent PNGs
            mask = mask_src[:, :, 3]
        else:
            # Already 1 channel
            mask = mask_src

        # Resize to match image
        if img.shape[:2] != mask.shape[:2]:
            mask = cv2.resize(mask, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_NEAREST)

        # Threshold to ensure binary (0 or 255)
        # Any non-zero alpha/gray becomes 255
        _, mask = cv2.threshold(mask, 10, 255, cv2.THRESH_BINARY)
        
        # Dilate mask slightly to clean edges (optional but good for UX)
        kernel = np.ones((5,5), np.uint8)
        mask = cv2.dilate(mask, kernel, iterations=2)

        print(f"DEBUG: Inpainting with Mask. Non-zero pixels: {cv2.countNonZero(mask)}")

        inpainted = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)
        return AIEngine._save_result(inpainted, ref_path, 'inpainted', return_path)

    @staticmethod
    def upscale_image(image_input, scale=2, return_path=True, ref_path=""):
        img = AIEngine._read_image(image_input)
        if scale not in [2, 4]: scale = 2
        h, w = img.shape[:2]
        upscaled = cv2.resize(img, (w*scale, h*scale), interpolation=cv2.INTER_LANCZOS4)
        # Sharpen
        gaussian = cv2.GaussianBlur(upscaled, (0, 0), 2.0)
        upscaled = cv2.addWeighted(upscaled, 1.5, gaussian, -0.5, 0)
        return AIEngine._save_result(upscaled, ref_path, f'upscaled_{scale}x', return_path)
