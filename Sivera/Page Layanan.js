import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, UploadCloud, Camera, UserCheck, LoaderCircle, XCircle } from 'lucide-react';
import MainView from './MainView';
import CameraCaptureView from './CameraCaptureView';

// --- Komponen Modal ---
const ResultModal = ({ show, onClose, success, title, message }) => {
    if (!show) return null;
    const iconClass = success ? 'result-icon success bg-green-200 text-green-800' : 'result-icon failed bg-red-200 text-red-800';
    const buttonClass = success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

    return (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-content bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
                <div className="px-6 py-8 md:px-10 text-center">
                    <div className={`w-20 h-20 mx-auto mt-4 mb-6 rounded-full p-4 ${iconClass}`}>
                        {success ? <CheckCircle className="w-full h-full" /> : <XCircle className="w-full h-full" />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{title}</h2>
                    <p className="text-gray-600">{message}</p>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <button onClick={onClose} className={`text-white font-semibold py-3 px-8 rounded-lg transition duration-150 w-full ${buttonClass}`}>
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
};

const SystemInputModal = ({ show, onCancel, onConfirm }) => {
    if (!show) return null;
    return (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-content bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
                <div className="px-6 py-8 md:px-10 border-b border-gray-200">
                    <h2 className="text-2xl font-extrabold text-gray-900">Konfirmasi Input Data</h2>
                    <p className="text-gray-600 mt-2">Yakin ingin menginput hasil verifikasi ini ke sistem?</p>
                </div>
                <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-gray-200">
                    <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition duration-150">
                        Batal
                    </button>
                    <button onClick={onConfirm} className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition duration-150">
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Komponen MatchView ---
const MatchView = ({ goToMain, uploadedKtpFile, capturedSelfieFile, onSystemConfirm }) => {
    const [isProcessingMatch, setIsProcessingMatch] = useState(false);
    const [isMatchSuccessful, setIsMatchSuccessful] = useState(false);
    const [matchResult, setMatchResult] = useState('');
    const [matchResultClass, setMatchResultClass] = useState('hidden');

    const hasAllFiles = uploadedKtpFile && capturedSelfieFile;

    const runFaceMatchVerification = () => {
        if (isProcessingMatch || !hasAllFiles) return;

        setIsProcessingMatch(true);
        setIsMatchSuccessful(false);
        setMatchResultClass('p-4 rounded-lg text-center font-bold bg-blue-100 text-blue-800 flex items-center justify-center');
        setMatchResult(
            <>
                <LoaderCircle className="w-6 h-6 mr-2 inline-block animate-spin" /> Memproses verifikasi perbandingan wajah...
            </>
        );

        // Simulasi penundaan 3 detik
        setTimeout(() => {
            const matchScore = Math.random(); 
            const success = matchScore > 0.3; // 70% success rate simulation

            if (success) {
                setIsMatchSuccessful(true);
                setMatchResult(
                    <>
                        <CheckCircle className="w-6 h-6 mr-2 inline-block" /> Verifikasi Berhasil! Wajah cocok.
                    </>
                );
                setMatchResultClass('p-4 rounded-lg text-center font-bold bg-green-100 text-green-800 flex items-center justify-center');
            } else {
                setIsMatchSuccessful(false);
                setMatchResult(
                    <>
                        <XCircle className="w-6 h-6 mr-2 inline-block" /> Verifikasi Gagal! Wajah tidak cocok dengan KTP.
                    </>
                );
                setMatchResultClass('p-4 rounded-lg text-center font-bold bg-red-100 text-red-800 flex items-center justify-center');
            }

            setIsProcessingMatch(false);
        }, 3000);
    };

    return (
        <div id="match-view" className="view">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Verifikasi Wajah (Face Matching)</h1>
            <p className="text-gray-500 mb-10">Perbandingan wajah akan dilakukan antara KTP dan Selfie yang telah diunggah.</p>

            <div className="space-y-8">
                {/* 1. Info KTP dan Selfie yang Diunggah */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800 mb-1">KTP Referensi:</p>
                        <p id="ktp-ref-name" className="text-sm text-blue-700 truncate font-medium">
                            {uploadedKtpFile ? uploadedKtpFile.name : 'Belum diunggah.'}
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-xs font-semibold text-purple-800 mb-1">Selfie Diunggah:</p>
                        <p id="selfie-ref-name" className="text-sm text-purple-700 truncate font-medium">
                            {capturedSelfieFile ? 'Foto Selfie berhasil diambil.' : 'Belum di-capture.'}
                        </p>
                    </div>
                </div>

                {/* Hasil Verifikasi (Simulasi) */}
                <div id="match-result" className={matchResultClass}>
                    {matchResult}
                </div>

                {/* Tombol Aksi */}
                <div className="pt-6 flex justify-end space-x-4 border-t border-gray-200">
                    <button 
                        onClick={runFaceMatchVerification} 
                        disabled={isProcessingMatch || !hasAllFiles}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-150 ${isProcessingMatch || !hasAllFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Mulai Verifikasi
                    </button>
                    <button 
                        onClick={onSystemConfirm} 
                        disabled={!isMatchSuccessful || isProcessingMatch}
                        className={`bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-150 ${!isMatchSuccessful || isProcessingMatch ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                    >
                        Konfirmasi ke Sistem
                    </button>
                </div>
            </div>
            
            {!hasAllFiles && (
                <div id="match-status-warning" className="mt-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center font-medium">
                    Mohon unggah KTP dan ambil Foto Selfie terlebih dahulu di menu utama.
                </div>
            )}
        </div>
    );
};


// --- Komponen Aplikasi Utama ---
const App = () => {
    const [currentView, setCurrentView] = useState('main'); // 'main', 'camera-capture', 'match'
    const [uploadedKtpFile, setUploadedKtpFile] = useState(null);
    const [capturedSelfieFile, setCapturedSelfieFile] = useState(null);
    
    // State Modal
    const [showSystemModal, setShowSystemModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalData, setResultModalData] = useState({ success: true, title: '', message: '', mode: 'final' });

    // FUNGSI NAVIGASI
    const goToMain = () => setCurrentView('main');
    const goToCamera = () => setCurrentView('camera-capture');
    const goToMatch = () => setCurrentView('match');

    // HANDLER UPLOAD/CAPTURE
    const handleKtpUpload = (file) => setUploadedKtpFile(file);
    const handleSelfieCapture = (file) => {
        setCapturedSelfieFile(file);
        
        // Tampilkan modal konfirmasi capture
        setResultModalData({
            success: true,
            title: 'Selfie Berhasil Diambil!',
            message: 'Foto wajah telah berhasil di-capture dan disimpan sebagai referensi.',
            mode: 'capture'
        });
        setShowResultModal(true);
        // Kembali ke main view saat modal ditutup
    };

    // HANDLER MODAL
    const handleCloseResultModal = () => {
        setShowResultModal(false);
        if (resultModalData.mode === 'final') {
            // Reset state setelah konfirmasi sistem akhir
            setUploadedKtpFile(null);
            setCapturedSelfieFile(null);
        }
        goToMain(); // Selalu kembali ke main view setelah modal selesai
    };

    const handleConfirmSystemInput = () => {
        setShowSystemModal(true);
    };

    const handleFinalConfirm = () => {
        setShowSystemModal(false);
        // Tampilkan modal hasil konfirmasi akhir
        setResultModalData({
            success: true,
            title: 'Input Berhasil!',
            message: 'Hasil verifikasi berhasil diinput ke sistem.',
            mode: 'final'
        });
        setShowResultModal(true);
    };

    // Tentukan teks tombol kembali berdasarkan view saat ini
    const backButtonText = currentView === 'camera-capture' || currentView === 'match' ? 'Batal' : 'Kembali';

    // RENDER VIEW SAAT INI
    const renderView = () => {
        switch (currentView) {
            case 'camera-capture':
                return <CameraCaptureView onCapture={handleSelfieCapture} goToMain={goToMain} />;
            case 'match':
                return (
                    <MatchView 
                        goToMain={goToMain} 
                        uploadedKtpFile={uploadedKtpFile} 
                        capturedSelfieFile={capturedSelfieFile}
                        onSystemConfirm={handleConfirmSystemInput}
                    />
                );
            case 'main':
            default:
                return (
                    <MainView 
                        uploadedKtpFile={uploadedKtpFile} 
                        capturedSelfieFile={capturedSelfieFile} 
                        onKtpUpload={handleKtpUpload} 
                        goToCamera={goToCamera} 
                        goToMatch={goToMatch} 
                    />
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f0f3f8' }}>
            <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200">
                
                {/* Header Universal */}
                <header id="app-header" className="flex justify-between items-center mb-10">
                    <div className="flex items-center space-x-3">
                        <img src="https://placehold.co/40x40/00824b/ffffff?text=BPJS" alt="BPJS Logo" className="w-10 h-10 object-cover rounded-md" />
                        <div className="flex flex-col text-sm leading-tight">
                            <span className="font-bold text-lg text-green-700">BPJS Kesehatan</span>
                            <span className="text-xs text-gray-500">Badan Penyelenggara Jaminan Sosial</span>
                        </div>
                    </div>
                    {/* Tombol Kembali */}
                    <button 
                        onClick={goToMain} 
                        className="flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {backButtonText}
                    </button>
                </header>
                
                {renderView()}

            </div>

            {/* Modals */}
            <SystemInputModal 
                show={showSystemModal} 
                onCancel={() => setShowSystemModal(false)} 
                onConfirm={handleFinalConfirm} 
            />
            <ResultModal 
                show={showResultModal} 
                onClose={handleCloseResultModal} 
                success={resultModalData.success}
                title={resultModalData.title}
                message={resultModalData.message}
            />
        </div>
    );
};

export default App;