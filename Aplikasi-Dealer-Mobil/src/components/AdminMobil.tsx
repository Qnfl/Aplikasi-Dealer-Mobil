import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mobil {
  ID_Mobil: number;
  Kode_Mobil: string;
  Nama_Mobil: string;
  Merek: string;
  Tahun_Produksi: number;
  Harga: number;
  Stok: number;
  Gambar_Mobil: string;
}

const AdminMobil: React.FC = () => {
  const [mobilList, setMobilList] = useState<Mobil[]>([]);
  const [newMobil, setNewMobil] = useState<Partial<Mobil>>({});
  const [editMobilId, setEditMobilId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Ambil token dari localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch data mobil dari server dengan otorisasi
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/mobil', {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token ke dalam header
          },
        });
        setMobilList(response.data);
      } catch (error) {
        console.error('Error fetching mobil data:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMobil((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

const handleAddMobil = async () => {
  const formData = new FormData();
  if (selectedFile) {
    formData.append('gambar', selectedFile);  // Pastikan ini adalah file gambar
  }
  Object.keys(newMobil).forEach((key) => {
    if (newMobil[key as keyof Mobil]) {
      formData.append(key, newMobil[key as keyof Mobil]!.toString());
    }
  });

  try {
    const response = await axios.post('http://localhost:5000/mobil', formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Token untuk autentikasi
        'Content-Type': 'multipart/form-data',
      },
    });
    setMobilList([...mobilList, response.data]);
    setNewMobil({});
    setSelectedFile(null);
  } catch (error) {
    console.error('Error adding mobil:', error);
  }
};

  const handleEditMobil = (mobil: Mobil) => {
    setIsEditing(true);
    setEditMobilId(mobil.ID_Mobil);
    setNewMobil(mobil);
  };

  const handleUpdateMobil = async () => {
    if (editMobilId === null) return;

    const formData = new FormData();
    if (selectedFile) {
      formData.append('gambar', selectedFile);
    }
    Object.keys(newMobil).forEach((key) => {
      if (newMobil[key as keyof Mobil]) {
        formData.append(key, newMobil[key as keyof Mobil]!.toString());
      }
    });

    try {
      const response = await axios.put(`http://localhost:5000/mobil/${editMobilId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMobilList(
        mobilList.map((mobil) =>
          mobil.ID_Mobil === editMobilId ? { ...mobil, ...newMobil } : mobil
        )
      );
      setNewMobil({});
      setSelectedFile(null);
      setIsEditing(false);
      setEditMobilId(null);
    } catch (error) {
      console.error('Error updating mobil:', error);
    }
  };

  const handleDeleteMobil = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/mobil/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Tambahkan token ke dalam header
        },
      });
      setMobilList(mobilList.filter((mobil) => mobil.ID_Mobil !== id));
    } catch (error) {
      console.error('Error deleting mobil:', error);
    }
  };

  return (
    <div className="admin-mobil-container">
      <h2>Manajemen Data Mobil</h2>

      {/* Form untuk menambah/edit mobil */}
      <div className="form-container">
        <div>
          <input
            type="text"
            name="Nama_Mobil"
            placeholder="Nama Mobil"
            value={newMobil.Nama_Mobil || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="Merek"
            placeholder="Merek"
            value={newMobil.Merek || ''}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="Tahun_Produksi"
            placeholder="Tahun Produksi"
            value={newMobil.Tahun_Produksi || ''}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="Harga"
            placeholder="Harga"
            value={newMobil.Harga || ''}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="Stok"
            placeholder="Stok"
            value={newMobil.Stok || ''}
            onChange={handleInputChange}
          />
          <input type="file" onChange={handleFileChange} />

          {isEditing ? (
            <button onClick={handleUpdateMobil}>Update Mobil</button>
          ) : (
            <button onClick={handleAddMobil}>Tambah Mobil</button>
          )}
        </div>

        {/* Tabel daftar mobil */}
        <table>
          <thead>
            <tr>
              <th>Nama Mobil</th>
              <th>Merek</th>
              <th>Tahun Produksi</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mobilList.map((mobil) => (
              <tr key={mobil.ID_Mobil}>
                <td>{mobil.Nama_Mobil}</td>
                <td>{mobil.Merek}</td>
                <td>{mobil.Tahun_Produksi}</td>
                <td>{mobil.Harga}</td>
                <td>{mobil.Stok}</td>
                <td>
                  <img
                    src={`http://localhost:5000/images/${mobil.Gambar_Mobil}`}
                    alt={mobil.Nama_Mobil}
                    width="100"
                  />
                </td>
                <td className="action-buttons">
                  <button onClick={() => handleEditMobil(mobil)}>Edit</button>
                  <button onClick={() => handleDeleteMobil(mobil.ID_Mobil)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMobil;