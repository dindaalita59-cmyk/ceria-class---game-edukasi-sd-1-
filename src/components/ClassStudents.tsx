import React, { useState } from 'react';
import { Student, GradeLevel } from '../types';
import { initialStudents } from '../data/initialData';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  Sparkles,
  School,
  X
} from 'lucide-react';

interface ClassStudentsProps {
  students: Student[];
  onSaveStudents: (students: Student[]) => void;
}

export const ClassStudents: React.FC<ClassStudentsProps> = ({
  students,
  onSaveStudents,
}) => {
  const [filterGrade, setFilterGrade] = useState<string>('Semua');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState<GradeLevel>('Kelas 1');
  const [newGroupName, setNewGroupName] = useState('Kelompok Patin Ceria');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    if (filterGrade !== 'Semua' && s.grade !== filterGrade) return false;
    return true;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: Student = {
      id: 'std-' + Date.now(),
      name: newName.trim(),
      grade: newGrade,
      groupName: newGroupName.trim() || undefined,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newStudent, ...students];
    onSaveStudents(updated);
    setNewName('');
    setNewModalOpen(false);
    setFeedbackMsg(`Siswa ${newStudent.name} berhasil ditambahkan.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    onSaveStudents(updated);
    setConfirmDeleteId(null);
    setFeedbackMsg('Data siswa berhasil dihapus.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleClearDemoStudents = () => {
    const realOnly = students.filter((s) => !s.isDemo);
    onSaveStudents(realOnly);
    setFeedbackMsg('Semua data siswa demo berhasil dibersihkan.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleRestoreDemoStudents = () => {
    const nonDemos = students.filter((s) => !s.isDemo);
    onSaveStudents([...initialStudents, ...nonDemos]);
    setFeedbackMsg('Siswa demo berhasil dimuat ulang.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <School className="w-3.5 h-3.5" />
            <span>Manajemen Siswa SDN 32 Rantau Bayur</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl">
            Kelas dan Siswa
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium">
            Kelola data nama panggilan siswa dan kelompok belajar untuk mencatat hasil permainan dan asesmen formatif.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4 text-purple-700" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold">Keamanan & Privasi Data Siswa SD:</strong>
          <p className="text-emerald-800 leading-relaxed">
            CERIA CLASS hanya menyimpan nama panggilan atau kode siswa di peramban lokal. Tidak mengumpulkan foto wajah, NIK, alamat rumah, atau data rahasia anak.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-amber-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter and Demo Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Filter Kelas:</span>
          {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3'].map((gr) => (
            <button
              key={gr}
              onClick={() => setFilterGrade(gr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGrade === gr
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {gr}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {students.some((s) => s.isDemo) ? (
            <button
              onClick={handleClearDemoStudents}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
            >
              Hapus Siswa Demo
            </button>
          ) : (
            <button
              onClick={handleRestoreDemoStudents}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Muat Siswa Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              className="bg-white rounded-2xl p-5 border-2 border-slate-100 hover:border-purple-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
                    {std.grade}
                  </span>
                  {std.isDemo && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      DEMO
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    {std.name}
                  </h3>
                  {std.groupName && (
                    <p className="text-xs text-slate-500 font-medium">
                      {std.groupName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                {confirmDeleteId === std.id ? (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500">Yakin?</span>
                    <button
                      onClick={() => handleDeleteStudent(std.id)}
                      className="px-2 py-1 rounded bg-rose-600 text-white font-bold"
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(std.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Hapus Siswa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-purple-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-lg text-slate-900">Belum Ada Siswa Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Klik tombol Tambah Siswa Baru untuk mendaftarkan nama peserta didik.
          </p>
        </div>
      )}

      {/* Add Student Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-purple-300 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-black text-xl text-slate-900">
                Tambah Siswa Baru
              </h3>
              <button
                onClick={() => setNewModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Nama Panggilan Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Kelas</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value as GradeLevel)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 bg-white"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Kelompok Belajar (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Kelompok Patin Ceria"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
