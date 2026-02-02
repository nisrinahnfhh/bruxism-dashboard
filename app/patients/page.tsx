"use client";
import { useEffect, useState } from 'react';
import { getPatients, deletePatient } from '@/lib/api';
import { Patient } from '@/types/database';
import { Trash2, Loader2 } from 'lucide-react'; 

export default function PatientsPage() {
  const [data, setData] = useState<Patient[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      const res = await getPatients();
      const patientList = res.data?.data || res.data;
      if (Array.isArray(patientList)) {
        setData(patientList);
      }
    } catch (err) {
      console.error("Gagal memuat pasien:", err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleDelete = async (phone: string) => {
    // 1. Validasi konfirmasi teks
    const doubleCheck = confirm(
      `APAKAH ANDA YAKIN?\n\nMenghapus pasien (${phone}) akan menghapus seluruh riwayat log gejala secara permanen di database.`
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
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-800">Database Pasien</h2>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {data.length} Total Terdaftar
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Nama</th>
                <th className="px-6 py-4 text-left font-bold">Phone (ID)</th>
                <th className="px-6 py-4 text-left font-bold">Tgl Lahir</th>
                <th className="px-6 py-4 text-left font-bold">Status</th>
                <th className="px-6 py-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((p) => (
                <tr key={p.phone} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.name || '---'}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono font-semibold">{p.phone}</td>
                  <td className="px-6 py-4 text-slate-500">{p.birth || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.isRegistered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.isRegistered ? 'Registered' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      disabled={isDeleting === p.phone}
                      onClick={() => handleDelete(p.phone)}
                      className={`p-2 rounded-lg transition-all ${
                        isDeleting === p.phone 
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
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
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">
                    Belum ada data pasien tersimpan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}