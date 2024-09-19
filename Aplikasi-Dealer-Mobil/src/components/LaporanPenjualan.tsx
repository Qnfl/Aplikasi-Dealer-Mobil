import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Penjualan {
  Tanggal: string;
  TotalMobilTerjual: number;
  TotalPendapatan: number;
}

const LaporanPenjualan: React.FC = () => {
  const [laporan, setLaporan] = useState<Penjualan[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await axios.get('http://localhost:5000/laporan-penjualan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLaporan(response.data);
      } catch (error) {
        console.error('Error fetching laporan penjualan:', error);
      }
    };

    fetchLaporan();
  }, [token]);

  return (
    <div>
      <h2>Laporan Penjualan</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Total Mobil Terjual</th>
            <th>Total Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {laporan.map((data, index) => (
            <tr key={index}>
              <td>{data.Tanggal}</td>
              <td>{data.TotalMobilTerjual}</td>
              <td>{data.TotalPendapatan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanPenjualan;
