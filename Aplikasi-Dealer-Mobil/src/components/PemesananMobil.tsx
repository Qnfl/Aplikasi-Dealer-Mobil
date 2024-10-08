import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Import useLocation

const PemesananMobil: React.FC = () => {
  const [idMobil, setIdMobil] = useState(''); // Menggunakan ID Mobil
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Inisialisasi useLocation

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setIdMobil(id); // Set ID mobil dari query parameter
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      const response = await axios.post('http://localhost:5000/pesanan', {
        idMobil, // Mengirimkan ID mobil yang dipesan
        namaPelanggan, // Nama pelanggan
        alamatPengiriman: alamat, // Alamat
        tanggalPemesanan: new Date().toISOString().split('T')[0], // Mengirim tanggal pemesanan (format YYYY-MM-DD)
        statusPemesanan: 'Diproses', // Status default adalah 'Diproses'
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Token untuk autentikasi
        }
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/katalog-mobil'), 2000); // Redirect setelah berhasil
      }
    } catch (error) {
      setError('Gagal melakukan pemesanan. Silakan coba lagi.');
      console.error(error);
    }
  };

  return (
    <div className="pemesanan-container">
      <form onSubmit={handleSubmit} className="pemesanan-form">
        <h2>Form Pemesanan Mobil</h2>
        {success ? (
          <p>Pemesanan berhasil! Anda akan diarahkan kembali ke katalog.</p>
        ) : (
          <>
            <div>
              <label>ID Mobil:</label>
              <input 
                type="text" 
                value={idMobil} 
                onChange={(e) => setIdMobil(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Nama Pelanggan:</label>
              <input 
                type="text" 
                value={namaPelanggan} 
                onChange={(e) => setNamaPelanggan(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Alamat Pengiriman:</label>
              <input 
                type="text" 
                value={alamat} 
                onChange={(e) => setAlamat(e.target.value)} 
                required 
              />
            </div>
            <div className="button-container">
              <button type="submit">Pesan Sekarang</button>
            </div>
          </>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default PemesananMobil;
