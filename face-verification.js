// Global variables
let ktpImage = null;
let selfieImage = null;
let ktpDescriptor = null;
let selfieDescriptor = null;
let ktpDetection = null;
let selfieDetection = null;
let stream = null;
let modelsLoaded = false;
let currentSelfieMethod = 'camera'; // 'camera' or 'upload'
let detectionInterval = null;
let isDetecting = false;
let animationFrameId = null;
const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL

// Load face-api.js models (hanya untuk deteksi UI, verifikasi pakai backend)
async function loadModels() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    
    try {
        // Hanya load TinyFaceDetector untuk UI detection (lebih ringan)
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        modelsLoaded = true;
        console.log('✓ Face-API models loaded successfully');
    } catch (error) {
        console.error('Error loading models:', error);
        showStatus('ktp-status', 'error', '❌ Gagal memuat model AI. Refresh halaman.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadModels();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const ktpInput = document.getElementById('ktp-input');
    const ktpUploadArea = document.getElementById('ktp-upload-area');
    const selfieInput = document.getElementById('selfie-input');
    const selfieUploadArea = document.getElementById('selfie-upload-area');

    // KTP file input change
    ktpInput.addEventListener('change', handleKTPUpload);

    // KTP Drag and drop
    ktpUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        ktpUploadArea.classList.add('dragover');
    });

    ktpUploadArea.addEventListener('dragleave', () => {
        ktpUploadArea.classList.remove('dragover');
    });

    ktpUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        ktpUploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleKTPFile(file);
        }
    });

    // Selfie file input change
    selfieInput.addEventListener('change', handleSelfieUpload);

    // Selfie Drag and drop
    selfieUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        selfieUploadArea.classList.add('dragover');
    });

    selfieUploadArea.addEventListener('dragleave', () => {
        selfieUploadArea.classList.remove('dragover');
    });

    selfieUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        selfieUploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleSelfieFile(file);
        }
    });
}

// Handle KTP upload
async function handleKTPUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleKTPFile(file);
    }
}

async function handleKTPFile(file) {
    if (!modelsLoaded) {
        showStatus('ktp-status', 'warning', '⏳ Mohon tunggu, model AI sedang dimuat...');
        await loadModels();
    }

    if (file.size > 5 * 1024 * 1024) {
        showStatus('ktp-status', 'error', '❌ Ukuran file terlalu besar. Maksimal 5MB');
        return;
    }

    showStatus('ktp-status', 'warning', '🔍 Memproses foto KTP...');

    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
            await processKTPImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Process KTP image (simplified - hanya untuk UI preview)
async function processKTPImage(img) {
    const canvas = document.getElementById('ktp-canvas');
    const ctx = canvas.getContext('2d');

    // Resize image if too large
    let width = img.width;
    let height = img.height;
    const maxWidth = 800;

    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Save as base64 for backend
    ktpImage = canvas.toDataURL('image/jpeg', 0.9);

    // Simple detection untuk UI feedback
    try {
        const options = new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 224,
            scoreThreshold: 0.5
        });

        const detection = await faceapi.detectSingleFace(canvas, options);

        if (detection) {
            ktpDetection = detection;

            // Show preview
            document.getElementById('ktp-upload-area').style.display = 'none';
            document.getElementById('ktp-preview-container').style.display = 'block';

            // Draw face box
            drawFaceBox(detection.box, 'ktp-face-box', canvas);

            showStatus('ktp-status', 'success', '✓ Wajah terdeteksi! Silakan lanjut ke selfie.');
            document.getElementById('next-to-selfie').disabled = false;
        } else {
            showStatus('ktp-status', 'warning', '⚠️ Wajah tidak terdeteksi di preview, tapi tetap bisa dilanjutkan.');
            // Tetap allow untuk lanjut, backend yang akan validate
            document.getElementById('ktp-upload-area').style.display = 'none';
            document.getElementById('ktp-preview-container').style.display = 'block';
            document.getElementById('next-to-selfie').disabled = false;
        }
    } catch (error) {
        console.error('Error detecting face:', error);
        showStatus('ktp-status', 'warning', '⚠️ Error deteksi, tapi tetap bisa dilanjutkan.');
        document.getElementById('ktp-upload-area').style.display = 'none';
        document.getElementById('ktp-preview-container').style.display = 'block';
        document.getElementById('next-to-selfie').disabled = false;
    }
}

// Draw face box with accurate positioning
function drawFaceBox(box, elementId, canvas) {
    const faceBox = document.getElementById(elementId);
    const wrapper = faceBox.parentElement;
    
    // Get canvas display dimensions
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;
    
    // Calculate position relative to displayed canvas size
    faceBox.style.left = (box.x * scaleX) + 'px';
    faceBox.style.top = (box.y * scaleY) + 'px';
    faceBox.style.width = (box.width * scaleX) + 'px';
    faceBox.style.height = (box.height * scaleY) + 'px';
    faceBox.style.display = 'block';
}

// Reset KTP
function resetKTP() {
    ktpImage = null;
    ktpDescriptor = null;
    ktpDetection = null;
    document.getElementById('ktp-upload-area').style.display = 'block';
    document.getElementById('ktp-preview-container').style.display = 'none';
    document.getElementById('ktp-input').value = '';
    document.getElementById('next-to-selfie').disabled = true;
    const faceBox = document.getElementById('ktp-face-box');
    if (faceBox) faceBox.style.display = 'none';
    hideStatus('ktp-status');
}

// Select selfie method
function selectSelfieMethod(method) {
    currentSelfieMethod = method;
    
    // Update button states
    const buttons = document.querySelectorAll('.method-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.method-btn').classList.add('active');
    
    // Show/hide appropriate sections
    const cameraContainer = document.getElementById('camera-container');
    const uploadArea = document.getElementById('selfie-upload-area');
    const captureBtn = document.getElementById('capture-btn');
    const video = document.getElementById('video');
    
    if (method === 'camera') {
        // Pastikan video visible dan canvas hidden
        if (video) video.style.display = 'block';
        document.getElementById('selfie-canvas').style.display = 'none';
        
        cameraContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        captureBtn.style.display = 'inline-flex';
        startCamera();
    } else {
        cameraContainer.style.display = 'none';
        uploadArea.style.display = 'block';
        captureBtn.style.display = 'none';
        stopCamera();
    }
}

// Go to selfie section
function goToSelfie() {
    updateStep(2);
    document.getElementById('section-1').classList.remove('active');
    document.getElementById('section-2').classList.add('active');
    
    // Show method selector
    document.getElementById('selfie-method-selector').style.display = 'flex';
    
    // Start with camera by default
    selectSelfieMethod('camera');
}

// Go back to KTP
function goBackToKTP() {
    updateStep(1);
    document.getElementById('section-2').classList.remove('active');
    document.getElementById('section-1').classList.add('active');
    stopCamera();
    resetSelfie();
}

// Reset selfie
function resetSelfie() {
    selfieImage = null;
    selfieDescriptor = null;
    selfieDetection = null;
    document.getElementById('selfie-preview-container').style.display = 'none';
    document.getElementById('selfie-input').value = '';
    const faceBox = document.getElementById('selfie-face-box');
    if (faceBox) faceBox.style.display = 'none';
    hideStatus('selfie-status');
}

// Start camera
async function startCamera() {
    // Bersihkan canvas dan video sebelum start
    const video = document.getElementById('video');
    const canvas = document.getElementById('selfie-canvas');
    const overlay = document.getElementById('face-detection-overlay');
    
    // Clear video element
    video.srcObject = null;
    video.load(); // Force reload
    
    // Clear canvas
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Clear overlay
    if (overlay) {
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });

        video.srcObject = stream;

        // Start face detection with overlay
        video.addEventListener('loadeddata', () => {
            setupFaceDetectionOverlay();
            isDetecting = true;
            detectFaceInVideoWithOverlay();
        }, { once: true });
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
}

// Setup face detection overlay canvas
function setupFaceDetectionOverlay() {
    const video = document.getElementById('video');
    const overlay = document.getElementById('face-detection-overlay');
    
    if (overlay) {
        overlay.width = video.videoWidth;
        overlay.height = video.videoHeight;
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
    }
}

// Stop camera
function stopCamera() {
    // Stop detection loop
    isDetecting = false;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    
    // Stop camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    const video = document.getElementById('video');
    if (video) {
        video.srcObject = null;
    }
    
    // Clear overlay
    const overlay = document.getElementById('face-detection-overlay');
    if (overlay) {
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
}

// Detect face in video with overlay visualization (OPTIMIZED)
let lastDetectionTime = 0;
const DETECTION_INTERVAL = 500; // Deteksi setiap 500ms (tidak setiap frame)

async function detectFaceInVideoWithOverlay() {
    const video = document.getElementById('video');
    const overlay = document.getElementById('face-detection-overlay');
    const statusElement = document.getElementById('face-detection-status');
    const statusDot = document.querySelector('.camera-status .status-dot');
    
    if (!isDetecting || !video || video.paused || video.ended || !stream) {
        return;
    }
    
    const ctx = overlay ? overlay.getContext('2d') : null;
    const currentTime = Date.now();
    
    // Only detect every DETECTION_INTERVAL ms to reduce lag
    if (currentTime - lastDetectionTime >= DETECTION_INTERVAL) {
        lastDetectionTime = currentTime;
        
        try {
            const options = new faceapi.TinyFaceDetectorOptions({ 
                inputSize: 224,  // Reduced from 416 untuk performa lebih baik
                scoreThreshold: 0.5
            });
            
            // Hanya deteksi face box, skip landmarks untuk performa
            const detection = await faceapi.detectSingleFace(video, options);

            // Clear previous overlay
            if (ctx) {
                ctx.clearRect(0, 0, overlay.width, overlay.height);
            }

            if (detection) {
                // Draw simple face box on overlay
                if (ctx) {
                    const box = detection.box;
                    
                    // Draw box
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                    
                    // Draw corner markers (lebih ringan dari landmarks)
                    ctx.fillStyle = '#10b981';
                    const markerSize = 8;
                    // Top-left
                    ctx.fillRect(box.x, box.y, markerSize, 2);
                    ctx.fillRect(box.x, box.y, 2, markerSize);
                    // Top-right
                    ctx.fillRect(box.x + box.width - markerSize, box.y, markerSize, 2);
                    ctx.fillRect(box.x + box.width - 2, box.y, 2, markerSize);
                    // Bottom-left
                    ctx.fillRect(box.x, box.y + box.height - 2, markerSize, 2);
                    ctx.fillRect(box.x, box.y + box.height - markerSize, 2, markerSize);
                    // Bottom-right
                    ctx.fillRect(box.x + box.width - markerSize, box.y + box.height - 2, markerSize, 2);
                    ctx.fillRect(box.x + box.width - 2, box.y + box.height - markerSize, 2, markerSize);
                }
                
                if (statusElement) statusElement.textContent = '✓ Wajah terdeteksi - Siap mengambil foto';
                if (statusDot) statusDot.classList.add('active');
            } else {
                if (statusElement) statusElement.textContent = 'Posisikan wajah di tengah kamera';
                if (statusDot) statusDot.classList.remove('active');
            }
        } catch (error) {
            console.error('Detection error:', error);
        }
    }
    
    // Use requestAnimationFrame instead of setTimeout for smoother animation
    animationFrameId = requestAnimationFrame(detectFaceInVideoWithOverlay);
}

// Capture selfie with improved accuracy
async function captureSelfie() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('selfie-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Process the captured image
    await processSelfieImage(canvas);
}

// Handle selfie upload
async function handleSelfieUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleSelfieFile(file);
    }
}

async function handleSelfieFile(file) {
    if (!modelsLoaded) {
        showStatus('selfie-status', 'warning', '⏳ Mohon tunggu, model AI sedang dimuat...');
        await loadModels();
    }

    if (file.size > 5 * 1024 * 1024) {
        showStatus('selfie-status', 'error', '❌ Ukuran file terlalu besar. Maksimal 5MB');
        return;
    }

    showStatus('selfie-status', 'warning', '🔍 Memproses foto selfie...');

    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
            const canvas = document.getElementById('selfie-canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize if needed
            let width = img.width;
            let height = img.height;
            const maxWidth = 800;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            await processSelfieImage(canvas);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Process selfie image (simplified - verifikasi pakai backend)
async function processSelfieImage(canvas) {
    showStatus('selfie-status', 'warning', '🔍 Menganalisis foto selfie...');

    // Save as base64 for backend
    selfieImage = canvas.toDataURL('image/jpeg', 0.9);

    try {
        const options = new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 224,
            scoreThreshold: 0.5
        });

        const detection = await faceapi.detectSingleFace(canvas, options);

        if (detection) {
            selfieDetection = detection;

            // Show preview
            if (currentSelfieMethod === 'camera') {
                document.getElementById('video').style.display = 'none';
                stopCamera();
            } else {
                document.getElementById('selfie-upload-area').style.display = 'none';
            }
            
            document.getElementById('selfie-canvas').style.display = 'block';
            document.getElementById('selfie-preview-container').style.display = 'block';

            // Copy to preview canvas
            const previewCanvas = document.getElementById('selfie-preview-canvas');
            previewCanvas.width = canvas.width;
            previewCanvas.height = canvas.height;
            previewCanvas.getContext('2d').drawImage(canvas, 0, 0);

            // Draw face box
            drawFaceBox(detection.box, 'selfie-face-box', previewCanvas);

            // Update buttons
            document.getElementById('capture-btn').style.display = 'none';
            document.getElementById('retake-btn').style.display = 'inline-flex';
            document.getElementById('verify-btn').style.display = 'inline-flex';
            
            showStatus('selfie-status', 'success', '✓ Wajah terdeteksi! Klik verifikasi untuk melanjutkan.');
        } else {
            // Tetap allow verifikasi meski deteksi gagal di UI
            showStatus('selfie-status', 'warning', '⚠️ Wajah tidak terdeteksi di preview, tapi tetap bisa diverifikasi.');
            
            if (currentSelfieMethod === 'camera') {
                document.getElementById('video').style.display = 'none';
                stopCamera();
            } else {
                document.getElementById('selfie-upload-area').style.display = 'none';
            }
            
            document.getElementById('selfie-canvas').style.display = 'block';
            document.getElementById('selfie-preview-container').style.display = 'block';

            const previewCanvas = document.getElementById('selfie-preview-canvas');
            previewCanvas.width = canvas.width;
            previewCanvas.height = canvas.height;
            previewCanvas.getContext('2d').drawImage(canvas, 0, 0);

            document.getElementById('capture-btn').style.display = 'none';
            document.getElementById('retake-btn').style.display = 'inline-flex';
            document.getElementById('verify-btn').style.display = 'inline-flex';
        }
    } catch (error) {
        console.error('Error processing selfie:', error);
        showStatus('selfie-status', 'error', '❌ Terjadi kesalahan saat memproses foto.');
    }
}

// Retake selfie
function retakeSelfie() {
    resetSelfie();
    
    // Bersihkan canvas preview
    const canvas = document.getElementById('selfie-canvas');
    const previewCanvas = document.getElementById('selfie-preview-canvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (previewCanvas) {
        const ctx = previewCanvas.getContext('2d');
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }

    document.getElementById('selfie-canvas').style.display = 'none';
    document.getElementById('capture-btn').style.display = currentSelfieMethod === 'camera' ? 'inline-flex' : 'none';
    document.getElementById('retake-btn').style.display = 'none';
    document.getElementById('verify-btn').style.display = 'none';

    if (currentSelfieMethod === 'camera') {
        document.getElementById('video').style.display = 'block';
        startCamera(); // Akan clear video dan canvas otomatis
    } else {
        document.getElementById('selfie-upload-area').style.display = 'block';
    }
}

// Verify faces using FastAPI backend with DeepFace
async function verifyFaces() {
    updateStep(3);
    document.getElementById('section-2').classList.remove('active');
    document.getElementById('section-3').classList.add('active');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';

    try {
        // Check if backend is running
        let backendOnline = false;
        try {
            const healthCheck = await fetch(`${API_BASE_URL}/health`, { 
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            backendOnline = healthCheck.ok;
        } catch (e) {
            console.warn('Backend not reachable:', e);
        }

        if (!backendOnline) {
            // Show error
            displayBackendError();
            return;
        }

        // Prepare request
        const requestData = {
            ktp_image: ktpImage,
            selfie_image: selfieImage
        };

        // Call FastAPI backend
        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Verification failed');
        }

        const result = await response.json();

        // Display results
        displayResults(
            result.verified,
            result.similarity,
            result.confidence,
            result.distance,
            result.threshold,
            result
        );

    } catch (error) {
        console.error('Verification error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result-content').style.display = 'block';

        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');

        resultIcon.className = 'result-icon failed';
        resultIcon.textContent = '⚠';
        resultTitle.textContent = 'Error Verifikasi';
        resultMessage.textContent = `Terjadi kesalahan: ${error.message}`;
        resultTitle.style.color = 'var(--warning-color)';

        // Hide comparison and metrics
        document.querySelector('.comparison-container').style.display = 'none';
    }
}

// Display backend error
function displayBackendError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    resultIcon.className = 'result-icon failed';
    resultIcon.textContent = '⚠';
    resultTitle.textContent = 'Backend Tidak Aktif';
    resultMessage.innerHTML = `
        <strong>Backend server belum dijalankan!</strong><br><br>
        Silakan jalankan backend terlebih dahulu:<br>
        <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: block; margin: 10px 0;">
        cd backend<br>
        pip install -r requirements.txt<br>
        python main.py
        </code>
        Server akan berjalan di: <strong>http://localhost:8000</strong>
    `;
    resultTitle.style.color = 'var(--warning-color)';

    // Hide comparison and metrics
    document.querySelector('.comparison-container').style.display = 'none';
}

// Display verification results
function displayResults(isMatch, similarity, confidence, distance, threshold, fullResult = null) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';

    // Show comparison container
    document.querySelector('.comparison-container').style.display = 'block';

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    if (isMatch) {
        resultIcon.className = 'result-icon success';
        resultIcon.textContent = '✓';
        resultTitle.textContent = 'Verifikasi Berhasil';
        resultMessage.textContent = fullResult?.message || 'Identitas Anda terverifikasi. Tidak terdeteksi fraud.';
        resultTitle.style.color = 'var(--success-color)';
    } else {
        resultIcon.className = 'result-icon failed';
        resultIcon.textContent = '✗';
        resultTitle.textContent = 'Verifikasi Gagal';
        resultMessage.textContent = fullResult?.message || 'Wajah tidak cocok dengan KTP. Terdeteksi potensi fraud.';
        resultTitle.style.color = 'var(--danger-color)';
    }

    // Display comparison images
    const ktpCanvas = document.getElementById('result-ktp-canvas');
    const selfieCanvas = document.getElementById('result-selfie-canvas');

    // Use extracted faces if available, otherwise use original
    const ktpSrc = fullResult?.ktp_face_b64 
        ? `data:image/png;base64,${fullResult.ktp_face_b64}` 
        : ktpImage;
    const selfieSrc = fullResult?.selfie_face_b64 
        ? `data:image/png;base64,${fullResult.selfie_face_b64}` 
        : selfieImage;

    const ktpImg = new Image();
    ktpImg.onload = () => {
        ktpCanvas.width = 200;
        ktpCanvas.height = (200 * ktpImg.height) / ktpImg.width;
        ktpCanvas.getContext('2d').drawImage(ktpImg, 0, 0, ktpCanvas.width, ktpCanvas.height);
    };
    ktpImg.src = ktpSrc;

    const selfieImg = new Image();
    selfieImg.onload = () => {
        selfieCanvas.width = 200;
        selfieCanvas.height = (200 * selfieImg.height) / selfieImg.width;
        selfieCanvas.getContext('2d').drawImage(selfieImg, 0, 0, selfieCanvas.width, selfieCanvas.height);
    };
    selfieImg.src = selfieSrc;

    // Update metrics
    const similarityBar = document.getElementById('similarity-bar');
    const similarityValue = document.getElementById('similarity-value');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceValue = document.getElementById('confidence-value');

    setTimeout(() => {
        similarityBar.style.width = similarity.toFixed(1) + '%';
        similarityValue.textContent = similarity.toFixed(1) + '%';
        confidenceBar.style.width = confidence.toFixed(1) + '%';
        confidenceValue.textContent = confidence.toFixed(1) + '%';
    }, 300);

    // Set bar colors based on result
    if (isMatch) {
        similarityBar.style.background = 'linear-gradient(90deg, var(--success-color), #34d399)';
        confidenceBar.style.background = 'linear-gradient(90deg, var(--success-color), #34d399)';
    } else {
        similarityBar.style.background = 'linear-gradient(90deg, var(--danger-color), #f87171)';
        confidenceBar.style.background = 'linear-gradient(90deg, var(--danger-color), #f87171)';
    }

    // Display analysis details
    const detailsList = document.getElementById('analysis-details');
    const modelName = fullResult?.model || 'ArcFace';
    const detectorName = fullResult?.detector_backend || 'retinaface';
    
    detailsList.innerHTML = `
        <li><span>Distance:</span><strong>${distance.toFixed(4)}</strong></li>
        <li><span>Threshold:</span><strong>${threshold.toFixed(4)}</strong></li>
        <li><span>Status:</span><strong style="color: ${isMatch ? 'var(--success-color)' : 'var(--danger-color)'}">${isMatch ? 'VERIFIED ✓' : 'FRAUD DETECTED ✗'}</strong></li>
        <li><span>Face Detected (KTP):</span><strong>${fullResult?.face_ktp_detected ? 'Yes ✓' : 'No ✗'}</strong></li>
        <li><span>Face Detected (Selfie):</span><strong>${fullResult?.face_selfie_detected ? 'Yes ✓' : 'No ✗'}</strong></li>
        <li><span>Waktu Verifikasi:</span><strong>${new Date().toLocaleString('id-ID')}</strong></li>
        <li><span>Model:</span><strong>${modelName}</strong></li>
        <li><span>Detector:</span><strong>${detectorName}</strong></li>
    `;
}

// Start over
function startOver() {
    // Reset all data
    ktpImage = null;
    selfieImage = null;
    ktpDescriptor = null;
    selfieDescriptor = null;
    ktpDetection = null;
    selfieDetection = null;

    // Reset UI
    resetKTP();
    resetSelfie();
    
    document.getElementById('capture-btn').style.display = 'none';
    document.getElementById('retake-btn').style.display = 'none';
    document.getElementById('verify-btn').style.display = 'none';

    // Go back to step 1
    updateStep(1);
    document.getElementById('section-3').classList.remove('active');
    document.getElementById('section-1').classList.add('active');
}

// Download report
function downloadReport() {
    const reportData = {
        timestamp: new Date().toISOString(),
        result: document.getElementById('result-title').textContent,
        similarity: document.getElementById('similarity-value').textContent,
        confidence: document.getElementById('confidence-value').textContent,
        details: document.getElementById('analysis-details').innerText
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `face-verification-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Update step indicator
function updateStep(step) {
    // Reset all steps
    for (let i = 1; i <= 3; i++) {
        const stepNumber = document.querySelector(`#step-indicator-${i} .step-number`);
        stepNumber.classList.remove('active', 'completed');
    }

    // Set completed steps
    for (let i = 1; i < step; i++) {
        const stepNumber = document.querySelector(`#step-indicator-${i} .step-number`);
        stepNumber.classList.add('completed');
    }

    // Set active step
    const activeStep = document.querySelector(`#step-indicator-${step} .step-number`);
    activeStep.classList.add('active');
}

// Show status message
function showStatus(elementId, type, message) {
    const element = document.getElementById(elementId);
    element.className = `status-message ${type}`;
    element.textContent = message;
    element.style.display = 'block';
}

// Hide status message
function hideStatus(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}
