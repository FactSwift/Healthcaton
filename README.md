# 🏥 SIVERA - Sistem Verifikasi BPJS Kesehatan

**SIVERA** (*Sistem Verifikasi Realtime*) adalah platform verifikasi identitas peserta BPJS Kesehatan berbasis AI yang dirancang untuk mencegah fraud dan mempercepat layanan customer service secara online.

## 🎯 Fitur Utama

### 1. **Verifikasi Wajah AI (Face Verification)**
- ✅ Upload KTP peserta
- ✅ Capture selfie real-time melalui kamera
- ✅ Verifikasi otomatis menggunakan **DeepFace** dengan model **ArcFace**
- ✅ Deteksi fraud dengan akurasi tinggi (95-98%)
- ✅ Hasil verifikasi instant dengan confidence score

### 2. **SIVERA Chatbot (AI Assistant)**
- 🤖 Chatbot berbasis **n8n** dengan teknologi RAG (Retrieval-Augmented Generation)
- 💬 Menjawab pertanyaan seputar kepesertaan BPJS
- 🔍 Menggunakan **Qdrant** vector database untuk pencarian dokumen
- 🧠 Powered by **Google Gemini AI**

### 3. **Antarmuka Modern**
- 🎨 Design mengikuti guideline BPJS Kesehatan
- 📱 Responsive design (desktop & mobile)
- ⚡ Built with **Tailwind CSS**
- 🚀 Fast & intuitive user experience

## 🛠️ Teknologi yang Digunakan

### Backend
- **Python 3.12**
- **FastAPI** - REST API framework
- **DeepFace** - Face recognition library
- **TensorFlow 2.16.1** - Deep learning framework
- **OpenCV** - Image processing
- **NumPy** - Numerical computations

### Frontend
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Face-API.js** - Client-side face detection (UI preview)

### AI & ML
- **Model**: ArcFace (face recognition)
- **Detector**: RetinaFace (face detection)
- **n8n**: Workflow automation & chatbot
- **Qdrant**: Vector database untuk RAG
- **Google Gemini**: LLM untuk chatbot

## 📋 Prasyarat

- **Python 3.12** (virtual environment recommended)
- **Node.js** (untuk n8n)
- **NVIDIA GPU** (optional, untuk akselerasi)
- **CUDA 12.3+** (jika menggunakan GPU)

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/FactSwift/Healthcaton.git
cd Healthcaton
```

### 2. Setup Backend (Face Verification)
```powershell
# Buat virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
cd backend
pip install -r requirements.txt
```

### 3. Setup n8n (Chatbot)
```powershell
# Install n8n globally
npm install -g n8n

# Import workflow dari folder n8n-workflows/
# Jalankan n8n
n8n
```

### 4. Konfigurasi
- Backend berjalan di `http://localhost:8000`
- n8n berjalan di `http://localhost:5678`
- Chatbot webhook: `http://localhost:5678/webhook/5e56a263-3a40-44bd-bc9d-1cfb3bc2a87d/chat`

## 💻 Cara Menjalankan

### Jalankan Backend
```powershell
cd backend
python main.py
```

### Jalankan n8n
```powershell
n8n
```

### Buka Website
```
file:///Z:/Engihere/Git-projects/Healthcaton/sivera-home.html
```

Atau gunakan Live Server di VS Code.

## 📖 Cara Penggunaan

### Verifikasi Wajah
1. Buka halaman **Verifikasi** di sidebar
2. Klik **"Mulai Verifikasi Wajah"**
3. Upload foto KTP peserta
4. Ambil foto selfie menggunakan kamera
5. Klik **"Verifikasi"** untuk memulai proses
6. Lihat hasil verifikasi (Match/No Match)

### Chatbot SIVERA
1. Buka halaman **Sivera Chatbot** di sidebar
2. Ketik pertanyaan di kolom chat
3. Dapatkan jawaban instant dari AI assistant

## 🏗️ Struktur Proyek

```
Healthcaton/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── requirements.txt        # Python dependencies
│   ├── README.md              # Backend documentation
│   └── setup_gpu.md           # GPU setup guide
├── n8n-workflows/
│   └── Local Chatbot with RAG.json
├── Sivera/                     # Original design files
├── face-verification.html      # Face verification UI
├── face-verification.css       # Styling
├── face-verification.js        # Frontend logic
├── sivera-home.html           # Main website
├── index.html                 # Legacy entry point
└── README.md                  # This file
```

## 🔧 Troubleshooting

### Backend Tidak Bisa Diakses
```powershell
# Pastikan backend berjalan
cd backend
python main.py

# Cek di browser: http://localhost:8000/health
```

### GPU Tidak Terdeteksi
- TensorFlow Windows tidak support GPU by default
- Gunakan CPU (performa tetap bagus untuk development)
- Atau gunakan WSL2 + Ubuntu untuk GPU support

### Chatbot Tidak Merespon
```powershell
# Pastikan n8n berjalan
n8n

# Cek workflow sudah aktif di http://localhost:5678
```

## 📊 Performa

### Face Verification (CPU - AMD Ryzen 5 7000)
- First request: 3-5 detik (model loading)
- Subsequent: 1-2 detik per verifikasi
- Accuracy: 95-98%

### Face Verification (GPU - RTX 4060)
- ⚠️ Windows tidak support TensorFlow GPU
- Gunakan WSL2 untuk 10x performa lebih cepat

## 🤝 Kontributor

- **Face Verification System**: DeepFace + FastAPI
- **Chatbot Integration**: n8n + Qdrant + Gemini
- **UI/UX Design**: Adapted from BPJS Kesehatan guidelines

## 📄 Lisensi

This project is licensed under the MIT License.

## 🔗 Referensi

- [DeepFace Documentation](https://github.com/serengil/deepface)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)

---

**Developed with ❤️ for BPJS Kesehatan Innovation**
