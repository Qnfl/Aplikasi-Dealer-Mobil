import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';  // Untuk navigasi setelah login

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');  // Menambahkan tipe string
    const [password, setPassword] = useState<string>('');  // Menambahkan tipe string
    const [error, setError] = useState<string>('');        // Menambahkan tipe string
    const navigate = useNavigate();  // Hook untuk navigasi

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Reset error state

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            console.log('Response:', response); // Log response for debugging

            if (response.status === 200) {
                const { token, role } = response.data;  // Ambil role dari response
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);  // Simpan role di localStorage
                navigate('/dashboard');  // Redirect ke dashboard setelah login berhasil
            } else {
                setError('Login failed: Invalid username or password');
            }
        } catch (err) {
            console.error('Error:', err); // Log error for debugging
            if (axios.isAxiosError(err)) {
                if (err.response && err.response.status === 401) {
                    setError('Login failed: Invalid username or password');
                } else {
                    setError('Login failed: Something went wrong. Please try again.');
                }
            } else {
                setError('Login failed: An unexpected error occurred.');
            }
        }
    };  

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            // placeholder="Username"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}  // Tipe untuk event input
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            // placeholder="Password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}  // Tipe untuk event input
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}  {/* Tampilkan error jika ada */}
            </div>
        </div>
    );
};

export default Login;