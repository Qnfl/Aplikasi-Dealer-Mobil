import express from 'express';
import mysql from 'mysql2/promise'; // Menggunakan mysql2/promise untuk async/await
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(express.json());

// Konfigurasi CORS agar mengizinkan request dari frontend (React di localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Setup untuk serve gambar statis dari folder 'uploads'
app.use('/images', express.static('uploads'));

// Konfigurasi database MySQL dengan promise
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dealer_mobil',
    });
    console.log('Terhubung ke database MySQL');
  } catch (err) {
    console.error('Koneksi ke database gagal:', err);
  }
}
connectDB();

// Secret Key untuk JWT
const JWT_SECRET = 'your_jwt_secret';

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM Pengguna WHERE Username = ?', [username]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Verifikasi kata sandi tanpa bcrypt
    if (password !== user.Password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.ID_Pengguna, role: user.Role }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, role: user.Role });
  } catch (err) {
    console.error('Error saat login:', err);
    return res.status(500).json({ message: 'Database query error' });
  }
});

// Middleware untuk memverifikasi JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Route yang hanya bisa diakses oleh Admin
app.get('/admin', verifyToken, (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ message: 'Welcome Admin!' });
});

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Mendapatkan semua data mobil
app.get('/mobil', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM Mobil');
    res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Database query error' });
  }
});

// Menambahkan mobil baru (dengan gambar)
app.post('/mobil', verifyToken, upload.single('gambar'), async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { Nama_Mobil, Merek, Tahun_Produksi, Harga, Stok } = req.body;
  const Gambar_Mobil = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'INSERT INTO Mobil (Nama_Mobil, Merek, Tahun_Produksi, Harga, Stok, Gambar_Mobil) VALUES (?, ?, ?, ?, ?, ?)',
      [Nama_Mobil, Merek, Tahun_Produksi, Harga, Stok, Gambar_Mobil]
    );
    res.json({ message: 'Mobil berhasil ditambahkan', data: result });
  } catch (err) {
    return res.status(500).json({ message: 'Database query error' });
  }
});

// Menambahkan pesanan mobil
app.post('/pesanan', async (req, res) => {
  const { idMobil, namaPelanggan, alamatPengiriman, tanggalPemesanan, statusPemesanan } = req.body;

  console.log('Data diterima dari frontend:', req.body);

  try {
    await db.query(`
      INSERT INTO Pesanan (ID_Mobil, Nama_Pelanggan, Alamat_Pengiriman, Tanggal_Pemesanan, Status_Pemesanan) 
      VALUES (?, ?, ?, ?, ?)
    `, [idMobil, namaPelanggan, alamatPengiriman, tanggalPemesanan, statusPemesanan]);

    res.status(201).send('Pemesanan berhasil dibuat');
  } catch (err) {
    console.error('Error saat membuat pesanan:', err);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

// Mengedit data mobil (dengan gambar)
app.put('/mobil/:id', verifyToken, upload.single('gambar'), async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { Nama_Mobil, Merek, Tahun_Produksi, Harga, Stok } = req.body;
  const Gambar_Mobil = req.file ? req.file.filename : req.body.Gambar_Mobil;

  try {
    const [result] = await db.query(
      'UPDATE Mobil SET Nama_Mobil = ?, Merek = ?, Tahun_Produksi = ?, Harga = ?, Stok = ?, Gambar_Mobil = ? WHERE ID_Mobil = ?',
      [Nama_Mobil, Merek, Tahun_Produksi, Harga, Stok, Gambar_Mobil, id]
    );
    res.json({ message: 'Mobil berhasil diupdate', data: result });
  } catch (err) {
    return res.status(500).json({ message: 'Database query error' });
  }
});

// Menghapus mobil
app.delete('/mobil/:id', verifyToken, async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Mobil WHERE ID_Mobil = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    }

    res.json({ message: 'Mobil berhasil dihapus', data: result });
  } catch (err) {
    console.error('Error saat menghapus mobil:', err);
    return res.status(500).json({ message: 'Database query error' });
  }
});


// Menjalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
