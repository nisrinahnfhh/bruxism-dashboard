// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { loginAdmin } from '@/lib/api';

// export default function LoginPage() {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await loginAdmin(form);
//       localStorage.setItem('token', res.data.token); 
//       router.push('/'); 
//     } catch (err: unknown) {
//       if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
//         setError((err.response as { data: { message?: string } }).data.message || 'Login Gagal. Cek koneksi backend.');
//       } else {
//         setError('Login Gagal. Cek koneksi backend.');
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bruxism Admin Login</h2>
//         {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
//         <div className="space-y-4">
//           <input 
//             type="text" placeholder="Username" required
//             className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={(e) => setForm({...form, username: e.target.value})}
//           />
//           <input 
//             type="password" placeholder="Password" required
//             className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={(e) => setForm({...form, password: e.target.value})}
//           />
//           <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
//             Sign In
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api';
import { LockKeyhole, User, Loader2 } from 'lucide-react'; // Opsional: install lucide-react

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
              <LockKeyhole className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm">Please enter your account to access <span className="font-semibold text-blue-600">Bruxism Admin</span></p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm animate-in fade-in slide-in-from-top-1">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Username */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* Input Password */}
            <div className="relative group">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-400">
            &copy; 2026 Bruxism Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}