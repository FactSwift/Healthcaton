#!/usr/bin/env python3
"""
FastAPI Backend for Face Verification using DeepFace
Uses ArcFace model with RetinaFace detector for high accuracy
Optimized for NVIDIA RTX 4060 GPU
"""

import os
import base64
import io
import logging
from typing import Dict, Optional
from io import BytesIO

import cv2
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deepface import DeepFace
import tensorflow as tf

# Configure GPU
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    try:
        # Enable memory growth to avoid OOM errors
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        
        logical_gpus = tf.config.list_logical_devices('GPU')
        print(f"✅ GPU configured: {len(gpus)} Physical GPU(s), {len(logical_gpus)} Logical GPU(s)")
        print(f"   GPU Device: {gpus[0].name}")
    except RuntimeError as e:
        print(f"❌ GPU configuration error: {e}")
else:
    print("⚠️  No GPU detected. Running on CPU (will be slower).")

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Face Verification API",
    description="High-accuracy face verification using DeepFace",
    version="1.0.0"
)

# CORS middleware untuk allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk production, ganti dengan domain spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_NAME = "ArcFace"  # State-of-the-art model
DETECTOR_BACKEND = "retinaface"  # Best detector
DISTANCE_METRIC = "cosine"  # or "euclidean"

# Request/Response models
class VerificationRequest(BaseModel):
    """Request model for base64 encoded images"""
    ktp_image: str  # Base64 encoded
    selfie_image: str  # Base64 encoded

class VerificationResponse(BaseModel):
    """Response model for verification results"""
    verified: bool
    distance: float
    threshold: float
    similarity: float
    confidence: float
    model: str
    detector_backend: str
    face_ktp_detected: bool
    face_selfie_detected: bool
    ktp_face_b64: Optional[str] = None
    selfie_face_b64: Optional[str] = None
    message: str


def base64_to_image(base64_string: str) -> np.ndarray:
    """
    Convert base64 string to OpenCV image (numpy array)
    
    Args:
        base64_string: Base64 encoded image string (with or without prefix)
    
    Returns:
        numpy.ndarray: Image in BGR format
    """
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        pil_image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to numpy array and BGR (OpenCV format)
        image_np = np.array(pil_image)
        image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        
        return image_bgr
    
    except Exception as e:
        logger.error(f"Error converting base64 to image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")


def image_to_base64(image_np: np.ndarray) -> str:
    """
    Convert numpy array (OpenCV image) to base64 string
    
    Args:
        image_np: Image in BGR or RGB format
    
    Returns:
        str: Base64 encoded image
    """
    try:
        # Convert BGR to RGB if needed
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        else:
            image_rgb = image_np
        
        # Convert to PIL Image
        pil_image = Image.fromarray(image_rgb.astype('uint8'))
        
        # Save to buffer
        buffered = BytesIO()
        pil_image.save(buffered, format="PNG")
        
        # Encode to base64
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return img_str
    
    except Exception as e:
        logger.error(f"Error converting image to base64: {str(e)}")
        return ""


def extract_face(image: np.ndarray, detector_backend: str = DETECTOR_BACKEND) -> Optional[Dict]:
    """
    Extract face from image using DeepFace
    
    Args:
        image: Image in BGR format
        detector_backend: Face detector to use
    
    Returns:
        Dict with face data or None if no face detected
    """
    try:
        faces = DeepFace.extract_faces(
            img_path=image,
            detector_backend=detector_backend,
            enforce_detection=True,
            align=True
        )
        
        if faces and len(faces) > 0:
            return faces[0]
        return None
    
    except Exception as e:
        logger.warning(f"Face extraction failed: {str(e)}")
        return None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Face Verification API",
        "model": MODEL_NAME,
        "detector": DETECTOR_BACKEND
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "detector": DETECTOR_BACKEND,
        "distance_metric": DISTANCE_METRIC
    }


@app.post("/verify", response_model=VerificationResponse)
async def verify_faces(request: VerificationRequest):
    """
    Verify if two face images match
    
    Args:
        request: VerificationRequest with base64 encoded images
    
    Returns:
        VerificationResponse with verification results
    """
    try:
        logger.info("Processing verification request...")
        
        # Convert base64 to images
        ktp_image = base64_to_image(request.ktp_image)
        selfie_image = base64_to_image(request.selfie_image)
        
        logger.info(f"Images loaded - KTP: {ktp_image.shape}, Selfie: {selfie_image.shape}")
        
        # Perform verification
        try:
            result = DeepFace.verify(
                img1_path=ktp_image,
                img2_path=selfie_image,
                model_name=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                distance_metric=DISTANCE_METRIC,
                enforce_detection=True
            )
            
            logger.info(f"Verification result: {result['verified']}, Distance: {result['distance']:.4f}")
            
        except ValueError as ve:
            # Face not detected in one or both images
            logger.warning(f"Face detection failed: {str(ve)}")
            return VerificationResponse(
                verified=False,
                distance=1.0,
                threshold=0.0,
                similarity=0.0,
                confidence=0.0,
                model=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                face_ktp_detected=False,
                face_selfie_detected=False,
                message="Wajah tidak terdeteksi pada salah satu atau kedua gambar"
            )
        
        # Extract faces for visualization
        ktp_face_data = extract_face(ktp_image)
        selfie_face_data = extract_face(selfie_image)
        
        ktp_face_b64 = None
        selfie_face_b64 = None
        
        if ktp_face_data and 'face' in ktp_face_data:
            face_np = (ktp_face_data['face'] * 255).astype(np.uint8)
            ktp_face_b64 = image_to_base64(face_np)
        
        if selfie_face_data and 'face' in selfie_face_data:
            face_np = (selfie_face_data['face'] * 255).astype(np.uint8)
            selfie_face_b64 = image_to_base64(face_np)
        
        # Calculate metrics
        distance = float(result['distance'])
        threshold = float(result['threshold'])
        verified = bool(result['verified'])
        
        # Calculate similarity (0-100%)
        if DISTANCE_METRIC == "cosine":
            # Cosine distance: 0 = identical, 2 = opposite
            similarity = max(0, min(100, (1 - distance) * 100))
        else:
            # Euclidean distance: lower is better
            similarity = max(0, min(100, (1 - distance / threshold) * 100))
        
        # Calculate confidence
        confidence = max(0, min(100, (1 - distance / threshold) * 100))
        
        # Quality scores
        ktp_quality = ktp_face_data.get('confidence', 0.0) if ktp_face_data else 0.0
        selfie_quality = selfie_face_data.get('confidence', 0.0) if selfie_face_data else 0.0
        
        # Adjust confidence based on detection quality
        avg_quality = (ktp_quality + selfie_quality) / 2
        confidence = confidence * avg_quality
        
        message = "Verifikasi berhasil - Wajah cocok" if verified else "Verifikasi gagal - Wajah tidak cocok"
        
        return VerificationResponse(
            verified=verified,
            distance=distance,
            threshold=threshold,
            similarity=round(similarity, 2),
            confidence=round(confidence, 2),
            model=result['model'],
            detector_backend=result['detector_backend'],
            face_ktp_detected=ktp_face_data is not None,
            face_selfie_detected=selfie_face_data is not None,
            ktp_face_b64=ktp_face_b64,
            selfie_face_b64=selfie_face_b64,
            message=message
        )
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Verification error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat verifikasi: {str(e)}"
        )


@app.post("/verify-files")
async def verify_files_upload(
    ktp_file: UploadFile = File(...),
    selfie_file: UploadFile = File(...)
):
    """
    Alternative endpoint for file uploads instead of base64
    
    Args:
        ktp_file: KTP image file
        selfie_file: Selfie image file
    
    Returns:
        Verification results
    """
    try:
        # Read uploaded files
        ktp_bytes = await ktp_file.read()
        selfie_bytes = await selfie_file.read()
        
        # Convert to base64
        ktp_b64 = base64.b64encode(ktp_bytes).decode('utf-8')
        selfie_b64 = base64.b64encode(selfie_bytes).decode('utf-8')
        
        # Create request object
        request = VerificationRequest(
            ktp_image=ktp_b64,
            selfie_image=selfie_b64
        )
        
        # Use existing verify endpoint
        return await verify_faces(request)
    
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat upload: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    # Run server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
