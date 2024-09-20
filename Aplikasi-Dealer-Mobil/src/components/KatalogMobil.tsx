import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Mobil {
  ID_Mobil: number;
  Nama_Mobil: string;
  Merek: string;
  Tahun_Produksi: number;
  Harga: number;
  Gambar_Mobil: string;
}

const KatalogMobil: React.FC = () => {
  const [mobilList, setMobilList] = useState<Mobil[]>([]);
  const [searchMerek, setSearchMerek] = useState('');
  const [searchTahun, setSearchTahun] = useState('');
  const [searchHarga, setSearchHarga] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    const fetchMobil = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await axios.get('http://localhost:5000/mobil', {
          headers: {
            Authorization: `Bearer ${token}` // Sertakan token dalam header
          }
        });
        setMobilList(response.data);
      } catch (error) {
        setError('Error fetching mobil data: ' + error);
        console.error(error);
      }
    };

    fetchMobil();
  }, []);

  // Filter berdasarkan Merek, Tahun Produksi, dan Harga Maksimum
  const filteredMobil = mobilList.filter((mobil) => {
    return (
      (searchMerek === '' || mobil.Merek.toLowerCase().includes(searchMerek.toLowerCase())) &&
      (searchTahun === '' || mobil.Tahun_Produksi.toString().includes(searchTahun)) &&
      (searchHarga === '' || mobil.Harga <= parseInt(searchHarga))
    );
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="katalog-container">
      <h1 className="katalog-title">Katalog Mobil</h1>

      {/* Input Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Cari berdasarkan Merek"
          value={searchMerek}
          onChange={(e) => setSearchMerek(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Cari berdasarkan Tahun Produksi"
          value={searchTahun}
          onChange={(e) => setSearchTahun(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Cari berdasarkan Harga Maksimum"
          value={searchHarga}
          onChange={(e) => setSearchHarga(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* List Mobil */}
      <div className="mobil-grid">
        {filteredMobil.map((mobil) => (
          <div 
            key={mobil.ID_Mobil} 
            className="mobil-card" 
            onClick={() => navigate(`/pemesanan-mobil?id=${mobil.ID_Mobil}`)} // Navigasi ke halaman pemesanan
          >
            <img 
              src={`http://localhost:5000/images/${mobil.Gambar_Mobil}`} 
              alt={mobil.Nama_Mobil}
              className="mobil-image"
            />
            <div className="mobil-info">
              <h2 className="mobil-title">{mobil.Nama_Mobil}</h2>
              <p className="mobil-detail">ID: {mobil.ID_Mobil}</p>
              <p className="mobil-detail">Merek: {mobil.Merek}</p>
              <p className="mobil-detail">Tahun Produksi: {mobil.Tahun_Produksi}</p>
              <p className="mobil-price">Harga: Rp {mobil.Harga.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KatalogMobil;
