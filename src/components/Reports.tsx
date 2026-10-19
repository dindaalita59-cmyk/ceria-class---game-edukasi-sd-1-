import React, { useState } from 'react';
import { GameSessionResult, Game, Student } from '../types';
import { 
  BarChart3, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Trophy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Info,
  Calendar,
  Filter,
  Users
} from 'lucide-react';
import { exportResultsToCsv, exportBackupJson, validateAndParseBackup, ImportResult } from '../utils/storage';

interface ReportsProps {
  results: GameSessionResult[];
  games: Game[];
  students: Student[];
  onClearResults: () => void;
  onRestoreBackup: (importedData: ImportResult) => void;
}

export const Reports: React.FC<ReportsProps> = ({
  results,
  games,
  students,
  onClearResults,
  onRestoreBackup,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('Semua');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Semua');
  const [searchPlayer, setSearchPlayer] = useState<string>('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Filtered results
  const filteredResults = results.filter((r) => {
    if (filterSubject !== 'Semua' && r.subject !== filterSubject) return false;
    if (filterDifficulty !== 'Semua' && r.difficulty !== filterDifficulty) return false;
    if (searchPlayer.trim() && !r.playerName.toLowerCase().includes(searchPlayer.toLowerCase().trim())) return false;
    return true;
  });

  // Summary statistics
  const totalSessions = results.length;
  const avgScore = totalSessions > 0
    ? Math.round(results.reduce((acc, r) => acc + r.scorePercent, 0) / totalSessions)
    : 0;
  const totalStars = results.reduce((acc, r) => acc + (r.starsEarned || 0), 0);
  const totalCorrect = results.reduce((acc, r) => acc + r.correctCount, 0);

  // File import handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateAndParseBackup(content);
      if (res.success) {
        onRestoreBackup(res);
        setImportNotice('Data cadangan JSON berhasil dipulihkan!');
      } else {
        setImportNotice(`Gagal impor: ${res.message}`);
      }
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Asesmen Formatif & Rekapitulasi Pembelajaran</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl">
            Laporan Hasil Belajar
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium">
            Rekap otomatis skor, durasi, ketepatan jawaban, dan perkembangan peserta didik SDN 32 Rantau Bayur.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportResultsToCsv(results)}
            disabled={results.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-white text-rose-800 hover:bg-rose-50 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all hover:scale-105"
            title="Unduh Lembar Kerja CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => exportBackupJson(games, students, results)}
            className="px-4 py-2.5 rounded-2xl bg-rose-700/60 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20"
            title="Unduh Cadangan JSON"
          >
            <Download className="w-4 h-4" />
            <span>Cadangan JSON</span>
          </button>

          <label className="px-4 py-2.5 rounded-2xl bg-rose-700/60 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Pulihkan JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {importNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-amber-600" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Formative Assessment Notice (Mandatory Pedagogical Clarification) */}
      <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-950">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-extrabold text-sky-900">Catatan Pedagogis Guru:</strong>
          <p className="leading-relaxed text-sky-800">
            Skor mini games ini merupakan salah satu sumber <strong>asesmen formatif</strong> untuk memetakan capaian belajar dan kebutuhan bimbingan individual siswa. Skor tidak dimaksudkan sebagai satu-satunya penentu nilai rapor akhir dan hendaknya dipertimbangkan secara komprehensif bersama observasi perilaku, partisipasi kelas, dan portofolio karya nyata peserta didik.
          </p>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Sesi Main</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalSessions}</p>
          <span className="text-[11px] text-slate-400">Sesi kelas & individu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Rata-Rata Skor</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{avgScore}%</p>
          <span className="text-[11px] text-slate-400">Ketepatan jawaban</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Bintang Terkumpul</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center gap-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>{totalStars}</span>
          </p>
          <span className="text-[11px] text-slate-400">Apresiasi motivasi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-sky-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Jawaban Tepat</span>
          <p className="text-2xl sm:text-3xl font-black text-sky-600">{totalCorrect}</p>
          <span className="text-[11px] text-slate-400">Soal terjawab benar</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Matematika">Matematika</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="Muatan Lokal Banyuasin">Muatan Lokal Banyuasin</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="mulai-belajar">Mulai Belajar</option>
              <option value="sedang-berkembang">Sedang Berkembang</option>
              <option value="tantangan">Tantangan</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari nama siswa/tim..."
              value={searchPlayer}
              onChange={(e) => setSearchPlayer(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 w-full sm:w-48"
            />

            {results.length > 0 && (
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors shrink-0"
              >
                Reset Riwayat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      {filteredResults.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Waktu & Tanggal</th>
                  <th className="py-3.5 px-4">Pemain / Kelompok</th>
                  <th className="py-3.5 px-4">Judul Game</th>
                  <th className="py-3.5 px-4">Materi & Mapel</th>
                  <th className="py-3.5 px-4 text-center">Benar / Soal</th>
                  <th className="py-3.5 px-4 text-center">Skor</th>
                  <th className="py-3.5 px-4 text-center">Bintang</th>
                  <th className="py-3.5 px-4">Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredResults.map((r) => {
                  const dateStr = new Date(r.completedAt).toLocaleString('id-ID', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  });

                  return (
                    <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {r.isGroupMode && <Users className="w-3.5 h-3.5 text-sky-600" />}
                          <span>{r.playerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 line-clamp-1 max-w-xs">
                        {r.gameTitle}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-900 font-semibold">{r.topic}</span>
                        <div className="text-[10px] text-slate-400 capitalize">{r.subject}</div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="font-bold text-emerald-700">{r.correctCount}</span>
                        <span className="text-slate-400"> / {r.totalQuestions}</span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap font-black">
                        <span className={`px-2 py-0.5 rounded-md ${
                          r.scorePercent >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          r.scorePercent >= 50 ? 'bg-amber-100 text-amber-900' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {r.scorePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="text-amber-500 font-black">
                          {'⭐'.repeat(r.starsEarned || 1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 font-semibold">
                        {r.scorePercent >= 80 
                          ? 'Pengayaan materi lanjutan' 
                          : r.scorePercent >= 60 
                          ? 'Pemantapan mandiri' 
                          : 'Pendampingan guru'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-rose-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-lg text-slate-900">Belum Ada Riwayat Sesi Permainan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Data penilaian formatif akan otomatis tercatat setiap kali siswa menyelesaikan mini game.
          </p>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-rose-300 shadow-2xl space-y-4">
            <h3 className="font-display font-black text-xl text-slate-900">
              Reset Riwayat Sesi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh riwayat hasil sesi belajar di perangkat ini. Pastikan Anda sudah mengunduh file CSV bila diperlukan.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearResults();
                  setConfirmClearOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
