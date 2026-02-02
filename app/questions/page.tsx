"use client";
import { useEffect, useState, useCallback } from 'react';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/lib/api';
import { Question } from '@/types/database';
import { Plus, Edit2, Trash2, X, Clock, Hash } from 'lucide-react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    question_text: '',
    scheduled_time: '08:00:00',
    is_active: 1
  });

  const loadQuestions = useCallback(async () => {
    try {
      const res = await getQuestions();
      if (res.data && Array.isArray(res.data.data)) {
        setQuestions(res.data.data);
      } else if (Array.isArray(res.data)) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat pertanyaan:", err);
    }
  }, []);

//   useEffect(() => {
//     loadQuestions();
//   }, []);
useEffect(() => {
    const fetchQuestions = async () => {
      await loadQuestions();
    };
    fetchQuestions();
  }, [loadQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateQuestion(editingId, formData);
      } else {
        await createQuestion(formData);
      }
      closeModal();
      loadQuestions();
    } catch (err) {
      alert("Gagal menyimpan data. Pastikan backend aktif.");
    }
  };

  const openModal = (q?: Question) => {
    if (q) {
      setEditingId(q.id);
      setFormData({ 
        question_text: q.question_text, 
        scheduled_time: q.scheduled_time, 
        is_active: q.is_active ?? 1 
      });
    } else {
      setEditingId(null);
      setFormData({ question_text: '', scheduled_time: '08:00:00', is_active: 1 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await deleteQuestion(id);
        loadQuestions();
      } catch (err) {
        alert("Gagal menghapus data.");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pertanyaan</h1>
          <p className="text-sm text-slate-500">Atur jadwal dan teks pertanyaan chatbot otomatis.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} /> Tambah Pertanyaan
        </button>
      </div>

      <div className="grid gap-4">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group transition-hover hover:border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    <Hash size={12} /> {q.id}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
                    <Clock size={14} /> {q.scheduled_time}
                  </span>
                  {!q.is_active && (
                    <span className="text-[10px] font-bold uppercase bg-red-50 text-red-500 px-2 py-1 rounded-md">Non-Aktif</span>
                  )}
                </div>
                <p className="text-slate-800 font-medium text-lg leading-relaxed">{q.question_text}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(q)} 
                  className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)} 
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Hapus"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            Belum ada pertanyaan. Klik Tambah Pertanyaan untuk memulai.
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Pertanyaan' : 'Pertanyaan Baru'}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Teks Pertanyaan</label>
                <textarea 
                  required
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                  rows={4}
                  value={formData.question_text}
                  onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  placeholder="Masukkan pertanyaan yang akan dikirim bot..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Waktu Kirim</label>
                  <input 
                    type="time"
                    step="1"
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Status</label>
                  <select 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none appearance-none bg-white cursor-pointer"
                    value={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: Number(e.target.value)})}
                  >
                    <option value={1}>Aktif</option>
                    <option value={0}>Non-Aktif</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] mt-2"
              >
                {editingId ? 'Simpan Perubahan' : 'Buat Pertanyaan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}