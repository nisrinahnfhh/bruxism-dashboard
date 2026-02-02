"use client";
import { useEffect, useState } from 'react';
import { getRecentLogs } from '@/lib/api';
import { Patient, SymptomLog } from '@/types/database';
import { Search, Calendar, Phone, MessageCircle } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getRecentLogs();
        const logData = res.data?.data || res.data;
        if (Array.isArray(logData)) {
          setLogs(logData);
        }
      } catch (err) {
        console.error("Gagal mengambil log:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.phone_number?.includes(searchTerm) || 
    log.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Interaksi</h1>
          <p className="text-slate-500 text-sm">Pantau semua jawaban pasien dari chatbot bruxism.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nomor HP atau jawaban..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">Waktu</th>
                <th className="px-6 py-4 font-bold text-slate-700">Nama Pasien</th>
                <th className="px-6 py-4 font-bold text-slate-700">Nomor Pasien</th>
                <th className="px-6 py-4 font-bold text-slate-700">Pertanyaan</th>
                <th className="px-6 py-4 font-bold text-slate-700">Jawaban Pasien</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Memuat riwayat...</td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(log.createdAt).toLocaleDateString('id-ID')}
                        <span className="text-xs text-slate-400">
                          {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                {log.phone_number_patient?.name || "Pasien Anonim"} 
                            </p>
                        </div>
                    </td>
                    {/* <div className="font-bold text-slate-900">
                        {log.phone_number_patient?.name || "Pasien Anonim"} 
                    </div> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono font-semibold text-slate-700">
                        <Phone size={14} className="text-slate-400" />
                        {log.phone_number}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold">
                        #{log.question_id}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                        <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <MessageCircle size={20} className="text-blue-500 mt-0.5" />
                            <span className="text-slate-700 leading-relaxed font-medium italic">
                                {log.question?.question_text || `ID #${log.question_id}`}
                            </span>
                        </div>
                        {/* <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                {log.question?.question_text || `ID #${log.question_id}`}
                            </p>
                        </div> */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <MessageCircle size={20} className="text-blue-500 mt-0.5" />
                        <span className="text-slate-700 leading-relaxed font-medium italic">
                          {log.answer}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada log interaksi yang ditemukan.
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