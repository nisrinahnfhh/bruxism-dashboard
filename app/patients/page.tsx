// "use client";
// import { useEffect, useState } from 'react';
// import { getPatients, deletePatient } from '@/lib/api';
// import { Patient } from '@/types/database';
// import { Trash2, Loader2 } from 'lucide-react'; 

// export default function PatientsPage() {
//   const [data, setData] = useState<Patient[]>([]);
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);

//   const loadPatients = async () => {
//     try {
//       const res = await getPatients();
//       const patientList = res.data?.data || res.data;
//       if (Array.isArray(patientList)) {
//         setData(patientList);
//       }
//     } catch (err) {
//       console.error("Gagal memuat pasien:", err);
//     }
//   };

//   useEffect(() => {
//     loadPatients();
//   }, []);

//   const handleDelete = async (phone: string) => {
//     // 1. Validasi konfirmasi teks
//     const doubleCheck = confirm(
//       `APAKAH ANDA YAKIN?\n\nMenghapus pasien (${phone}) akan menghapus seluruh riwayat log gejala secara permanen di database.`
//     );

//     if (!doubleCheck) return;

//     try {
//       setIsDeleting(phone);
//       await deletePatient(phone);
      
//       alert("Data pasien berhasil dihapus selamanya.");
//       await loadPatients();
//     } catch (err: unknown) {
//       const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Terjadi kesalahan koneksi.";
//       alert(`Gagal menghapus: ${errorMsg}`);
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
//         <div className="p-6 border-b flex justify-between items-center bg-white">
//           <h2 className="text-xl font-bold text-slate-800">Database Pasien</h2>
//           <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//             {data.length} Total Terdaftar
//           </span>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
//               <tr>
//                 <th className="px-6 py-4 text-left font-bold">Nama</th>
//                 <th className="px-6 py-4 text-left font-bold">Phone (ID)</th>
//                 <th className="px-6 py-4 text-left font-bold">Tgl Lahir</th>
//                 <th className="px-6 py-4 text-left font-bold">Status</th>
//                 <th className="px-6 py-4 text-center font-bold">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {data.map((p) => (
//                 <tr key={p.phone} className="hover:bg-slate-50/80 transition-colors">
//                   <td className="px-6 py-4 font-medium text-slate-900">{p.name || '---'}</td>
//                   <td className="px-6 py-4 text-slate-600 font-mono font-semibold">{p.phone}</td>
//                   <td className="px-6 py-4 text-slate-500">{p.birth || 'N/A'}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                       p.isRegistered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {p.isRegistered ? 'Registered' : 'Pending'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button 
//                       disabled={isDeleting === p.phone}
//                       onClick={() => handleDelete(p.phone)}
//                       className={`p-2 rounded-lg transition-all ${
//                         isDeleting === p.phone 
//                           ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
//                           : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
//                       }`}
//                     >
//                       {isDeleting === p.phone ? (
//                         <Loader2 size={18} className="animate-spin" />
//                       ) : (
//                         <Trash2 size={18} />
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {data.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">
//                     Belum ada data pasien tersimpan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import { getPatients, deletePatient } from '@/lib/api';
import { Patient } from '@/types/database';
import { Trash2, Loader2, Search, Users, Phone, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PatientsPage() {
  const [data, setData] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients();
      const patientList = res.data?.data || res.data;
      if (Array.isArray(patientList)) {
        setData(patientList);
      }
    } catch (err) {
      console.error("Gagal memuat pasien:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredData = data.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  const handleDelete = async (phone: string) => {
    const doubleCheck = confirm(
      `Hapus Pasien?\n\nData pasien (${phone}) dan seluruh riwayat log akan dihapus permanen.`
    );

    if (!doubleCheck) return;

    try {
      setIsDeleting(phone);
      await deletePatient(phone);
      
      alert("Data pasien berhasil dihapus selamanya.");
      await loadPatients();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Terjadi kesalahan koneksi.";
      alert(`Gagal menghapus: ${errorMsg}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Database Pasien</h1>
            <p className="text-slate-500 text-sm">Kelola informasi pasien dan riwayat medis Bruxism.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Cari nama atau nomor..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-full md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards (Mini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Total Pasien</p>
              <p className="text-xl font-bold text-slate-900">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                  <th className="px-6 py-4 font-semibold">Identitas Pasien</th>
                  <th className="px-6 py-4 font-semibold">Kontak & Lahir</th>
                  <th className="px-6 py-4 font-semibold">Status Akun</th>
                  <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                      <p className="text-slate-400 mt-2">Memuat database...</p>
                    </td>
                  </tr>
                ) : filteredData.map((p) => (
                  <tr key={p.phone} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-white shadow-sm">
                          {p.name?.substring(0, 2).toUpperCase() || '??'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter italic font-mono">ID: {p.phone.slice(-4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          <span className="font-medium">{p.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Calendar size={14} />
                          <span>{p.birth || 'Tgl lahir kosong'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.isRegistered ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <ShieldCheck size={14} />
                          <span className="text-[11px] font-bold uppercase tracking-wide">Verified</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                          <AlertCircle size={14} />
                          <span className="text-[11px] font-bold uppercase tracking-wide">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        disabled={isDeleting === p.phone}
                        onClick={() => handleDelete(p.phone)}
                        className={`p-2.5 rounded-xl transition-all ${
                          isDeleting === p.phone 
                            ? 'bg-slate-100 text-slate-300' 
                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-sm'
                        }`}
                      >
                        {isDeleting === p.phone ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredData.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
              <p className="text-slate-400 text-sm">Coba kata kunci pencarian lain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}