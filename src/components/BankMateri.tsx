import React, { useState } from 'react';
import { initialMaterials } from '../data/initialData';
import { MaterialItem, Subject, Game } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Layers,
  GraduationCap
} from 'lucide-react';

interface BankMateriProps {
  onPlayMaterialAsGame: (game: Game) => void;
}

export const BankMateri: React.FC<BankMateriProps> = ({
  onPlayMaterialAsGame,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);

  const filteredMaterials = initialMaterials.filter((m) => {
    if (selectedSubject !== 'Semua' && m.subject !== selectedSubject) return false;
    return true;
  });

  const handleLaunchGameFromMaterial = (m: MaterialItem) => {
    const generatedGame: Game = {
      id: 'mat-game-' + Date.now(),
      title: `${m.topic} (${m.subject})`,
      grade: m.grade,
      subject: m.subject,
      topic: m.topic,
      learningGoal: m.description,
      gameType: 'kuis-kilat',
      difficulty: m.difficulty,
      questions: m.sampleQuestions,
      createdAt: new Date().toISOString(),
    };
    onPlayMaterialAsGame(generatedGame);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Kurikulum Sekolah Dasar Kelas Rendah</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl">
            Bank Materi Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium">
            Kumpulan materi standar kelas 1-3 SD beserta Muatan Lokal SDN 32 Rantau Bayur yang siap diujikan menjadi mini game edukatif.
          </p>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Mata Pelajaran:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {['Semua', 'Bahasa Indonesia', 'Matematika', 'Pendidikan Pancasila', 'Muatan Lokal Banyuasin'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List with Macam-macam Warna */}
      <div className="space-y-6">
        {filteredMaterials.map((item) => {
          const isExpanded = expandedMaterialId === item.id;

          const subjectColors: Record<Subject, { border: string; bg: string; badge: string; btn: string }> = {
            'Bahasa Indonesia': {
              border: 'border-rose-200 hover:border-rose-300',
              bg: 'bg-rose-50/20',
              badge: 'bg-rose-100 text-rose-800 border-rose-200',
              btn: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-200',
            },
            'Matematika': {
              border: 'border-sky-200 hover:border-sky-300',
              bg: 'bg-sky-50/20',
              badge: 'bg-sky-100 text-sky-800 border-sky-200',
              btn: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-200',
            },
            'Pendidikan Pancasila': {
              border: 'border-purple-200 hover:border-purple-300',
              bg: 'bg-purple-50/20',
              badge: 'bg-purple-100 text-purple-800 border-purple-200',
              btn: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-purple-200',
            },
            'Muatan Lokal Banyuasin': {
              border: 'border-emerald-200 hover:border-emerald-300',
              bg: 'bg-emerald-50/20',
              badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              btn: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200',
            },
          };

          const sColor = subjectColors[item.subject] || subjectColors['Bahasa Indonesia'];

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xs space-y-5 transition-all bg-white ${sColor.border} ${sColor.bg}`}
            >
              {/* Material Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={`px-2.5 py-0.5 rounded-full border ${sColor.badge}`}>
                      {item.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.grade}
                    </span>
                    <span className="text-slate-400 capitalize">
                      · {item.difficulty.replace('-', ' ')}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-slate-900">
                    {item.topic}
                  </h3>
                  <p className="text-xs font-bold text-slate-600">
                    {item.subtopic}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLaunchGameFromMaterial(item)}
                    className={`px-4 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer ${sColor.btn}`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mainkan Materi Ini!</span>
                  </button>

                  <button
                    onClick={() => setExpandedMaterialId(isExpanded ? null : item.id)}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title={isExpanded ? 'Tutup Detail' : 'Buka Detail Soal'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isExpanded ? 'Tutup' : 'Lihat Soal'}</span>
                  </button>
                </div>
              </div>

              {/* Description & Visual Example */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <div className="space-y-1">
                  <strong className="text-slate-900 block font-bold">Uraian Konsep:</strong>
                  <p className="leading-relaxed">{item.description}</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block font-bold">Contoh Konkret / Visual:</strong>
                  <p className="font-mono bg-white p-2 rounded-xl border border-slate-200 text-indigo-900 font-bold">
                    {item.visualExample}
                  </p>
                </div>
              </div>

              {/* Key concepts */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-500">Kata Kunci:</span>
                {item.keyConcepts.map((k, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                    {k}
                  </span>
                ))}
              </div>

              {/* Collapsible Sample Questions with verified answer keys */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Daftar {item.sampleQuestions.length} Soal Standar Terverifikasi:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.sampleQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs"
                      >
                        <div className="font-extrabold text-xs text-slate-900 line-clamp-2">
                          {idx + 1}. {q.prompt}
                        </div>
                        {q.visualHint && (
                          <div className="text-2xl text-center py-1">{q.visualHint}</div>
                        )}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="text-slate-500">{q.options.length} Opsi Pilihan</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Kunci: {q.correctAnswer}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
