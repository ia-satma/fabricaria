
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

def compare_images(ref_path: str, current_path: str) -> dict:
    """
    VERIFICACIÓN VISUAL CIENTÍFICA (Step 116)
    Calcula la similitud estructural entre dos capturas de pantalla.
    """
    print(f"🔬 [Scientific-QA] Comparing {ref_path} vs {current_path}")
    
    img1 = cv2.imread(ref_path)
    img2 = cv2.imread(current_path)
    
    if img1 is None or img2 is None:
        return {"status": "ERROR", "message": "One of the images could not be read."}

    # Ensure same size
    if img1.shape != img2.shape:
        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))

    # Convert to grayscale
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # Calculate SSIM
    score, diff = ssim(gray1, gray2, full=True)
    
    status = "PASS" if score >= 0.95 else "FAIL"
    print(f"📊 SSIM Score: {score:.4f} -> {status}")
    
    return {
        "status": status,
        "ssim": float(score),
        "threshold": 0.95
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        res = compare_images(sys.argv[1], sys.argv[2])
        print(res)
