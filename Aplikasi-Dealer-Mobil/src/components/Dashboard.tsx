import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        
        if (!token) {
            navigate('/login');
        } else {
            setRole(userRole);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    // Jangan tampilkan navbar di halaman login
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <div>
            <nav className="navbar">
                <ul>
                    {role === 'Admin' && (
                        <>
                            <li>
                                <Link to="/admin/mobil">Kelola Mobil</Link>
                            </li>
                            <li>
                                <Link to="/katalog-mobil">Katalog</Link>
                            </li>
                            <li>
                                <Link to="/pesanan-mobil">Order</Link>
                            </li>
                            <li>
                                <Link to="/laporan-penjualan">Laporan</Link>
                            </li>
                        </>
                    )}
                    {role === 'User' && (
                        <>
                            <li>
                                <Link to="/katalog-mobil">Katalog</Link>
                            </li>
                            <li>
                                <Link to="/pesanan-mobil">Order</Link>
                            </li>
                        </>
                    )}
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <div className="dashboard-content">
                {role === 'Admin' && (
                    <h2>Welcome, Admin!</h2>
                )}
                {role === 'User' && (
                    <h2>Welcome, User!</h2>
                )}
                {!role && <p>Loading...</p>}
                {role !== 'Admin' && role !== 'User' && role && (
                    <p>Invalid role. Contact admin.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;