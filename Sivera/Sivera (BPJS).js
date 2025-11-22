import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, Search, User, CheckCircle, List, BarChart } from 'lucide-react';

// --- Komponen Dropdown Navigasi ---
const NavDropdown = ({ title, isActive, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback((e) => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="relative">
      <a
        href="#"
        className={`flex items-center cursor-pointer p-2 rounded-md transition duration-150 ${
          isActive ? 'font-semibold text-[#07408d]' : 'text-gray-700 hover:text-blue-600'
        }`}
        onClick={(e) => {
          onClick(e); // Handle page change
          toggleDropdown(e); // Handle dropdown visibility
        }}
      >
        {title} <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </a>
      {/* Dropdown Content */}
      <div
        className={`absolute ${isOpen ? 'block' : 'hidden'} bg-white mt-2 rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px] z-50 right-0 lg:right-auto`}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

// --- Komponen Header/Navbar Utama ---
const Header = ({ currentPage, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white flex flex-col md:flex-row items-center justify-between px-4 lg:px-10 h-auto md:h-[64px] shadow-md z-20">
      {/* Logo Area */}
      <div className="flex items-center space-x-3 py-2 md:py-0">
        <img src="https://placehold.co/40x40/003882/ffffff?text=BPJS" alt="BPJS Logo" className="w-10 h-10 object-cover rounded-full" />
        <div className="flex flex-col text-sm leading-tight">
          <span className="font-bold text-lg text-green-700">BPJS Kesehatan</span>
          <span className="text-xs text-gray-500">Badan Penyelenggara Jaminan Sosial</span>
        </div>
      </div>

      {/* Navigasi Utama (Terpusat) */}
      <nav className="flex flex-wrap justify-center md:justify-start items-center space-x-3 md:space-x-6 text-sm font-medium py-2 md:py-0">
        <a 
          href="#" 
          className={`p-2 rounded-md transition duration-150 ${currentPage === 'profile' ? 'font-semibold text-[#07408d]' : 'text-gray-700 hover:text-blue-600'}`}
          onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}
        >
          Profil
        </a>

        {/* Dropdown Jaminan Kesehatan */}
        <NavDropdown title="Jaminan Kesehatan" isActive={false} onClick={(e) => e.stopPropagation()}>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cek Status Jaminan</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Kalkulator Premi</a>
        </NavDropdown>

        {/* Dropdown Layanan (Aktif jika currentPage adalah 'layanan') */}
        <NavDropdown title="Layanan" isActive={currentPage === 'layanan'} onClick={(e) => { e.stopPropagation(); onNavigate('layanan'); }}>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Alamat BPJS Kesehatan</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Layanan Autodebit</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-bold text-blue-700">Data Peserta</a>
        </NavDropdown>

        <a href="#" className="p-2 rounded-md text-gray-700 hover:text-blue-600">Informasi Publik</a>
        <a href="#" className="p-2 rounded-md text-gray-700 hover:text-blue-600">Berita</a>
        <a href="#" className="p-2 rounded-md text-gray-700 hover:text-blue-600">Tautan</a>
        <a href="#" className="p-2 rounded-md text-gray-700 hover:text-blue-600">Kontak</a>
      </nav>

      {/* Search and ID Dropdown */}
      <div className="flex items-center space-x-3 py-2 md:py-0">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Cari"
            className="pl-4 pr-10 py-2 w-24 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div className="bg-[#07408d] w-10 h-10 rounded-md flex items-center justify-center cursor-pointer group">
          <User className="text-white w-5 h-5" />
        </div>
      </div>
    </header>
  );
};


// --- Komponen Konten Layanan (Verifikasi Data Peserta) ---
const LayananView = () => {
  const [activeTab, setActiveTab] = useState('verifikasi');

  const tabs = useMemo(() => [
    { key: 'verifikasi', title: 'Verifikasi', icon: CheckCircle, path: 'Verifikasi' },
    { key: 'list', title: 'List Pelanggan', icon: List, path: 'List Pelanggan' },
    { key: 'sivera', title: 'Sivera', icon: BarChart, path: 'Sivera' },
  ], []);

  const currentTab = tabs.find(tab => tab.key === activeTab) || tabs[0];
  const breadcrumb = `Beranda/Layanan/${currentTab.path}`;

  const TabContent = () => {
    switch (activeTab) {
      case 'verifikasi':
        return (
          <div id="content-verifikasi">
            <h2 className="text-xl font-extrabold text-[#003882] mb-6">
              Verifikasi <span className="text-gray-900">DATA CUSTOMER BPJS KESEHATAN</span>
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">SIVERA</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                SIVERA berfungsi sebagai sistem verifikasi data secara real-time untuk memastikan 100% identitas peserta saat mereka menghubungi CS secara online. Ini penting agar data kesehatan dan kepesertaan yang bersifat pribadi tidak disalahgunakan, sekaligus mempercepat proses layanan.
              </p>
              
              <h4 className="text-md font-semibold text-gray-700 mb-2">Tahap penggunaan fitur :</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm pl-4">
                <li>
                  <span className="font-bold">Unggah KTP</span>
                  <p className="text-xs ml-4 text-gray-500">CS mengunggah KTP dari customer yang dilayani</p>
                </li>
                <li>
                  <span className="font-bold">Unggah KTP dan Selfie</span>
                  <p className="text-xs ml-4 text-gray-500">CS mengunggah swafoto (selfie) atau gambar wajah secara langsung peserta melalui kamera perangkat dan bandingkan dengan hasil KTP yang diunggah.</p>
                </li>
                <li>
                  <span className="font-bold">Verifikasi dengan Kamera (Liveness Check & Matching)</span>
                  <p className="text-xs ml-4 text-gray-500">CS membantu peserta dalam melakukan verifikasi data melalui kamera secara realtime</p>
                </li>
                <li>
                  <span className="font-bold">Input Hasil ke Sistem</span>
                  <p className="text-xs ml-4 text-gray-500">Proses selesai</p>
                </li>
              </ol>
            </div>

            <button className="bg-[#07408d] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#003882] transition duration-200">
              Verifikasi
            </button>
          </div>
        );
      case 'list':
        return (
          <div id="content-list">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">List Pelanggan</h2>
            <p className="text-gray-600">Informasi detail mengenai daftar pelanggan BPJS Kesehatan akan ditampilkan di sini.</p>
          </div>
        );
      case 'sivera':
        return (
          <div id="content-sivera">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Sivera</h2>
            <p className="text-gray-600">Aplikasi atau laman Sivera (Sistem Verifikasi Peserta) akan diakses di sini.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Navigasi Layanan */}
      <aside className="w-full md:w-[280px] p-6 bg-gray-50 border-r border-gray-200 shrink-0">
        <div className="text-3xl font-extrabold text-gray-900 mt-4 mb-8">
          Data Peserta
        </div>
        <div className="space-y-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-item flex items-center justify-between w-full text-left p-3 rounded-md transition duration-150 ${
                activeTab === tab.key
                  ? 'bg-[#f0f3f8] border-r-4 border-[#07408d] font-bold text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 border-r-4 border-transparent'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="text-base">{tab.title}</span>
              <ChevronDown className={`w-4 h-4 text-xs ${activeTab === tab.key ? 'text-gray-700' : 'text-gray-400'} rotate-[-90deg]`} />
            </button>
          ))}
        </div>
      </aside>

      {/* Konten Utama Layanan */}
      <main className="flex-1 p-6 md:p-10 bg-white">
        <p className="text-sm text-gray-500 mb-8">
          {breadcrumb.split('/').map((item, index, arr) => (
            <React.Fragment key={index}>
              {index > 0 && '/'}
              {index === arr.length - 1 ? (
                <span className="font-medium text-gray-900">{item}</span>
              ) : (
                item
              )}
            </React.Fragment>
          ))}
        </p>
        <TabContent />
      </main>
    </div>
  );
};


// --- Komponen Konten Profil (Sederhana) ---
const ProfileView = () => {
  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#07408d] mb-8">Profil Peserta BPJS Kesehatan</h1>
      <p className="text-sm text-gray-500 mb-8">
        Beranda/<span className="font-medium">Profil</span>
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center space-x-6 mb-8 border-b pb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <User className="w-12 h-12 text-[#07408d]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
            <p className="text-gray-600">Nomor Kartu: 0001234567890</p>
            <p className="text-sm text-green-600 font-medium">Status: Aktif</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-gray-700">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">NIK/KTP</p>
            <p className="font-medium">320101XXXXXXXXX</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Tanggal Lahir</p>
            <p className="font-medium">1 Januari 1990</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Alamat Email</p>
            <p className="font-medium">john.doe@example.com</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Fasilitas Kesehatan Tingkat Pertama (FKTP)</p>
            <p className="font-medium">Puskesmas Maju Sehat</p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">Ini adalah contoh tampilan data profil peserta. Untuk layanan verifikasi, silakan klik menu "Layanan" di navigasi atas.</p>
    </div>
  );
};

// --- Komponen Aplikasi Utama ---
const App = () => {
  // State untuk mengontrol tampilan halaman: 'profile' atau 'layanan'
  const [currentPage, setCurrentPage] = useState('profile');

  // Mengatur padding atas berdasarkan tinggi header
  const headerHeight = '64px'; // Sesuaikan dengan tinggi header

  return (
    <div className="bg-[#f0f3f8] min-h-screen">
      {/* Header (Digunakan Bersama) */}
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Konten Dinamis */}
      <div className="pt-[64px] max-w-7xl mx-auto shadow-xl border-x border-gray-200">
        {currentPage === 'profile' && <ProfileView />}
        {currentPage === 'layanan' && <LayananView />}
      </div>
    </div>
  );
};

export default App;