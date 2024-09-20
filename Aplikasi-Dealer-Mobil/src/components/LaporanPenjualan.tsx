import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Penjualan {
  ID_Pesanan: number;
  Nama_Pelanggan: string;
  Nama_Mobil: string;
  Tanggal_Pemesanan: string;
  Status_Pemesanan: string;
  Harga: string;
}

const LaporanPenjualan: React.FC = () => {
  const [laporan, setLaporan] = useState<Penjualan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tanggalMulai, setTanggalMulai] = useState<string>(''); // State untuk tanggalMulai
  const [tanggalSelesai, setTanggalSelesai] = useState<string>(''); // State untuk tanggalSelesai
  const token = localStorage.getItem('token');

  const fetchLaporan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/laporanpenjualan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tanggalMulai,
          tanggalSelesai,
        },
      });
      console.log('Data laporan:', response.data); // Log data untuk debugging
      if (Array.isArray(response.data.rincianPenjualan)) {
        setLaporan(response.data.rincianPenjualan);
      } else {
        setError('Data yang diterima bukan array');
      }
    } catch (error) {
      console.error('Error fetching laporan penjualan:', error);
      setError('Gagal mengambil data laporan penjualan');
    }
  };

  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      fetchLaporan();
    }
  }, [token, tanggalMulai, tanggalSelesai]);

  return (
    <div>
      <h2>Laporan Penjualan</h2>
      {error && <p>Error: {error}</p>}
      <div>
        <label>
          Tanggal Mulai:
          <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} />
        </label>
        <label>
          Tanggal Selesai:
          <input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID Pesanan</th>
            <th>Nama Pelanggan</th>
            <th>Nama Mobil</th>
            <th>Tanggal Pemesanan</th>
            <th>Status Pemesanan</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {laporan.map((data, index) => (
            <tr key={index}>
              <td>{data.ID_Pesanan}</td>
              <td>{data.Nama_Pelanggan}</td>
              <td>{data.Nama_Mobil}</td>
              <td>{new Date(data.Tanggal_Pemesanan).toLocaleDateString()}</td>
              <td>{data.Status_Pemesanan}</td>
              <td>{data.Harga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanPenjualan;
