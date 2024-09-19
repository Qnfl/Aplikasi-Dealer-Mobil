import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Cek apakah token ada di localStorage, jika tidak ada redirect ke login
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');  // Ambil role dari localStorage
        
        if (!token) {
            navigate('/login');  // Redirect ke login jika tidak ada token
        } else {
            setRole(userRole);  // Simpan role ke state
        }
    }, [navigate]);

    const handleLogout = () => {
        // Hapus token dan role dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');  // Redirect ke halaman login
    };

    return (
        <div>
            <h1>Dashboard</h1>

            {/* Jika role adalah Admin, tampilkan konten dan tautan untuk Admin */}
            {role === 'Admin' && (
                <div>
                    <h2>Welcome, Admin!</h2>
                    <p>Ini adalah konten yang hanya bisa diakses oleh Admin.</p>
                    <ul>
                        <li>
                            <Link to="/admin">Go to Admin Page</Link>
                        </li>
                        <li>
                            <Link to="/admin/mobil">Manage Cars (Admin)</Link>
                        </li>
                        <li>
                            <Link to="/katalog-mobil">Lihat Katalog Mobil</Link>
                        </li>
                        <li>
                            <Link to="/pesanan-mobil">Lihat Pesanan Mobil</Link>
                        </li>
                        {/* Tautan untuk melihat laporan penjualan */}
                        <li>
                            <Link to="/laporan-penjualan">Lihat Laporan Penjualan</Link>
                        </li>
                    </ul>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}

            {/* Jika role adalah User, tampilkan konten untuk User */}
            {role === 'User' && (
                <div>
                    <h2>Welcome, User!</h2>
                    <p>Ini adalah konten yang hanya bisa diakses oleh User.</p>
                    <ul>
                        <li>
                            <Link to="/katalog-mobil">Lihat Katalog Mobil</Link>
                        </li>
                        <li>
                            <Link to="/pesanan-mobil">Lihat Pesanan Mobil</Link>
                        </li>
                    </ul>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}

            {/* Jika role belum ditemukan (loading state) */}
            {!role && <p>Loading...</p>}

            {/* Jika role tidak valid, tampilkan pesan kesalahan */}
            {role !== 'Admin' && role !== 'User' && role && (
                <p>Role tidak valid. Hubungi administrator.</p>
            )}
        </div>
    );
};

export default Dashboard;