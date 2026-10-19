import React from 'react';
import { Game, GameSessionResult, Student } from '../types';
import { 
  Gamepad2, 
  PlusCircle, 
  Trophy, 
  Users, 
  Sparkles, 
  Clock, 
  Lightbulb, 
  School,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  games: Game[];
  students: Student[];
  results: GameSessionResult[];
  onNavigateToPlay: () => void;
  onNavigateToMaker: () => void;
  onNavigateToReports: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  games,
  students,
  results,
  onNavigateToPlay,
  onNavigateToMaker,
  onNavigateToReports,
}) => {
  const totalGames = games.length;
  const totalSessions = results.length;
  const totalStudents = students.length;
  const recentResults = results.slice(0, 5);

  // Compute actual recommendation based on real data
  const getPedagogicalRecommendation = () => {
    if (results.length === 0) {
      return {
        hasData: false,
        title: 'Belum Ada Sesi Permainan',
        detail: 'Mulai mainkan game kuis bersama siswa untuk melihat pemetaan capaian belajar dan rekomendasi diferensiasi.',
      };
    }

    const topicScores: Record<string, { total: number; count: number; subject: string }> = {};
    results.forEach((r) => {
      if (!topicScores[r.topic]) {
        topicScores[r.topic] = { total: 0, count: 0, subject: r.subject };
      }
      topicScores[r.topic].total += r.scorePercent;
      topicScores[r.topic].count += 1;
    });

    let lowestTopic = '';
    let lowestAvg = 101;
    let lowestSubject = '';

    Object.entries(topicScores).forEach(([t, val]) => {
      const avg = val.total / val.count;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestTopic = t;
        lowestSubject = val.subject;
      }
    });

    if (lowestAvg < 70) {
      return {
        hasData: true,
        title: `Penguatan Disarankan: ${lowestTopic} (${lowestSubject})`,
        detail: `Rata-rata ketuntasan pada topik ini adalah ${Math.round(lowestAvg)}%. Disarankan memberi penguatan dengan media konkret atau tingkat 'Mulai Belajar' sebelum asesmen lanjutan.`,
      };
    }

    return {
      hasData: true,
      title: 'Pemahaman Siswa Secara Umum Sangat Baik!',
      detail: `Rata-rata ketuntasan seluruh sesi mencapai ${Math.round(results.reduce((acc, r) => acc + r.scorePercent, 0) / results.length)}%. Siswa siap menerima materi pengayaan pada tingkat 'Tantangan'.`,
    };
  };

  const recommendation = getPedagogicalRecommendation();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Teacher Welcome Banner with Macam-macam Warna (Rainbow Gradient) */}
      <div className="bg-gradient-to-r from-amber-400 via-rose-400 via-purple-500 to-sky-500 rounded-3xl p-1 shadow-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-[22px] p-6 sm:p-10 text-slate-900 relative overflow-hidden">
          
          {/* Subtle floating background colorful circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-sky-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-rose-200/40 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-sky-100 text-slate-800 text-xs font-black border border-slate-200">
              <School className="w-4 h-4 text-rose-500" />
              <span>SDN 32 Rantau Bayur, Banyuasin</span>
              <span className="text-slate-400">·</span>
              <span className="text-sky-700">Dinda Noer Alita, S.Pd.</span>
            </div>

            <div className="space-y-1">
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Selamat Datang di{' '}
                <span className="text-rose-500">C</span>
                <span className="text-amber-500">E</span>
                <span className="text-emerald-500">R</span>
                <span className="text-sky-500">I</span>
                <span className="text-purple-600">A</span>
                {' '}
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">CLASS!</span>
              </h1>
              <p className="text-base sm:text-lg font-bold text-slate-600">
                <span className="text-amber-600">Belajar Seru</span>,{' '}
                <span className="text-sky-600">Guru Terbantu</span>,{' '}
                <span className="text-emerald-600">Anak Ceria</span>.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Aplikasi games edukatif kelas 1–3 SD dengan penuh warna-warni ceria untuk membantu pembelajaran berdiferensiasi dan asesmen formatif yang menyenangkan!
            </p>

            {/* Quick Action CTA Buttons with vibrant colorful gradients */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToPlay}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm flex items-center gap-2.5 shadow-lg shadow-sky-200 transition-all hover:scale-105 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5 text-white" />
                <span>Mulai Mainkan Game</span>
              </button>

              <button
                onClick={onNavigateToMaker}
                className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-white" />
                <span>Buat Game Baru</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Multi-colored Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Warm Amber/Orange */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 p-5 rounded-3xl border-2 border-amber-200/90 shadow-sm space-y-2 hover:border-amber-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-200">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800">Game Tersimpan</span>
            <p className="text-3xl font-black text-slate-900">{totalGames}</p>
            <span className="text-[11px] font-semibold text-amber-600">Siap dimainkan</span>
          </div>
        </div>

        {/* Card 2: Ocean Sky Blue */}
        <div className="bg-gradient-to-b from-sky-50 to-blue-50/40 p-5 rounded-3xl border-2 border-sky-200/90 shadow-sm space-y-2 hover:border-sky-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-800">Sesi Permainan</span>
            <p className="text-3xl font-black text-sky-700">{totalSessions}</p>
            <span className="text-[11px] font-semibold text-sky-600">Total aktivitas</span>
          </div>
        </div>

        {/* Card 3: Royal Purple/Violet */}
        <div className="bg-gradient-to-b from-purple-50 to-violet-50/40 p-5 rounded-3xl border-2 border-purple-200/90 shadow-sm space-y-2 hover:border-purple-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-800">Siswa Terdaftar</span>
            <p className="text-3xl font-black text-purple-700">{totalStudents}</p>
            <span className="text-[11px] font-semibold text-purple-600">Kelas 1, 2, dan 3</span>
          </div>
        </div>

        {/* Card 4: Fresh Emerald/Mint */}
        <div className="bg-gradient-to-b from-emerald-50 to-teal-50/40 p-5 rounded-3xl border-2 border-emerald-200/90 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800">Bintang Prestasi</span>
            <p className="text-3xl font-black text-emerald-600">
              {results.reduce((acc, r) => acc + (r.starsEarned || 0), 0)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">Bintang diraih anak</span>
          </div>
        </div>

      </div>

      {/* Pedagogical Recommendation with Rainbow Badge */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
            Rekomendasi Latihan Diferensiasi
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
            {recommendation.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            {recommendation.detail}
          </p>
        </div>
      </div>

      {/* Recent Activities Section with Multi-Colored Badges */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">
              Aktivitas dan Hasil Belajar Terbaru
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Riwayat permainan terakhir siswa atau kelompok belajar.
            </p>
          </div>

          {results.length > 0 && (
            <button
              onClick={onNavigateToReports}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
            >
              <span>Lihat Semua Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentResults.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentResults.map((res, idx) => {
              const timeString = new Date(res.completedAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              // Color cycling for activity avatars
              const badgeColors = [
                'bg-rose-100 text-rose-700 border-rose-200',
                'bg-sky-100 text-sky-700 border-sky-200',
                'bg-emerald-100 text-emerald-700 border-emerald-200',
                'bg-purple-100 text-purple-700 border-purple-200',
                'bg-amber-100 text-amber-700 border-amber-200',
              ];
              const badgeClass = badgeColors[idx % badgeColors.length];

              return (
                <div key={res.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 border ${badgeClass}`}>
                      {'⭐'.repeat(res.starsEarned || 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {res.gameTitle}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {res.playerName} · <span className="font-bold text-slate-700">{res.topic}</span> · {timeString}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-base text-emerald-600">
                      {res.scorePercent}%
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {res.correctCount} dari {res.totalQuestions} Benar
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <p className="text-sm font-bold text-slate-700">Belum Ada Aktivitas Terakhir</p>
            <p className="text-xs text-slate-400">
              Mulai permainan pertama dengan menekan tombol 'Mulai Mainkan Game' di atas.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
