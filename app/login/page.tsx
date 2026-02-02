"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginAdmin(form);
      localStorage.setItem('token', res.data.token); 
      router.push('/'); 
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data: { message?: string } }).data.message || 'Login Gagal. Cek koneksi backend.');
      } else {
        setError('Login Gagal. Cek koneksi backend.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bruxism Admin Login</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({...form, username: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}