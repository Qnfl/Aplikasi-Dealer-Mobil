import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminComponent from './components/AdminComponent'; // Import komponen AdminComponent
import AdminMobil from './components/AdminMobil'; // Import komponen AdminMobil
import KatalogMobil from './components/KatalogMobil'; // Import komponen KatalogMobil
import PemesananMobil from './components/PemesananMobil'; // Import komponen PemesananMobil
import LaporanPenjualan from './components/LaporanPenjualan'; // Import komponen Laporan Penjualan
import { useEffect, useState } from 'react';

function App() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil role dari localStorage ketika aplikasi di-load
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Route untuk admin, jika role bukan Admin, redirect ke /dashboard */}
          <Route path="/admin" element={role === 'Admin' ? <AdminComponent /> : <Navigate to="/dashboard" />} />
          
          {/* Route untuk manajemen mobil admin */}
          <Route path="/admin/mobil" element={role === 'Admin' ? <AdminMobil /> : <Navigate to="/dashboard" />} />

          {/* Route untuk katalog mobil */}
          <Route path="/katalog-mobil" element={<KatalogMobil />} />

          {/* Route untuk pesanan mobil */}
          <Route path="/pesanan-mobil" element={<PemesananMobil />} />

          {/* Route untuk laporan penjualan, hanya bisa diakses oleh Admin */}
          <Route path="/laporan-penjualan" element={role === 'Admin' ? <LaporanPenjualan /> : <Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;