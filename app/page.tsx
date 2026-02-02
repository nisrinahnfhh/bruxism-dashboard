"use client";
import { useEffect, useState } from 'react';
import { getStatsCount, getRecentLogs } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, Activity, Clock } from 'lucide-react';
import { SymptomLog } from '../types/database';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalPatients: 0 });
  const [recentData, setRecentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [countRes, recentRes] = await Promise.all([
          getStatsCount(),
          getRecentLogs()
        ]);
        
        // SESUAIKAN DENGAN DashboardController.js (total_patients)
        setStats({
          totalPatients: countRes.data.total_patients || 0,
        });

        // SESUAIKAN DENGAN DashboardController.js (res.json({ success: true, data: logs }))
        setRecentData(recentRes.data.data || []); 
      } catch (err) {
        console.error("Gagal mengambil data dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat data analisis...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menggunakan data total_patients dari backend */}
        <StatCard 
          title="Total Pasien" 
          value={stats.totalPatients} 
          icon={<Users className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        {/* Stat tambahan bisa dihitung dari panjang recentData jika backend belum menyediakan count khusus */}
        <StatCard 
          title="Log Terbaru" 
          value={recentData.length} 
          icon={<MessageSquare className="text-green-600" />} 
          color="bg-green-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-700">
            <Clock size={20} /> Statistik Jawaban
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="phone_number" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="id" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Log ID" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="mb-4 text-lg font-semibold text-slate-700">10 Interaksi Terbaru</h3>
          <div className="space-y-4">
            {recentData.map((log: SymptomLog) => (
              <div key={log.id} className="flex items-center justify-between p-3 transition rounded-lg hover:bg-slate-50">
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-700">{log.phone_number}</p>
                  <p className="text-xs italic truncate text-slate-500">{log.answer}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                  {new Date(log.createdAt).toLocaleTimeString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center p-6 bg-white border shadow-sm rounded-2xl border-slate-100 gap-5">
      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}