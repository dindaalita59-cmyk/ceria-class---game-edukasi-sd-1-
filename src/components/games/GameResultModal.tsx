import React, { useEffect } from 'react';
import { Star, Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle, HeartHandshake } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';
import { playFanfareSound } from '../../utils/sound';

interface GameResultModalProps {
  gameTitle: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercent: number;
  starsEarned: number;
  durationSeconds: number;
  playerName: string;
  isGroupMode: boolean;
  groupScores?: Record<string, number>;
  soundEnabled: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  gameTitle,
  totalQuestions,
  correctCount,
  wrongCount,
  scorePercent,
  starsEarned,
  durationSeconds,
  playerName,
  isGroupMode,
  groupScores,
  soundEnabled,
  onPlayAgain,
  onBackToMenu,
}) => {
  useEffect(() => {
    triggerConfetti();
    playFanfareSound(soundEnabled);
  }, [soundEnabled]);

  const getEncouragement = () => {
    if (scorePercent === 100) {
      return {
        title: 'Luar Biasa Sempurna! 🌟🌟🌟',
        subtitle: 'Kamu menjawab semua soal dengan sangat tepat! Guru dan teman-teman bangga padamu!',
        color: 'text-amber-600',
      };
    }
    if (scorePercent >= 70) {
      return {
        title: 'Hebat Sekali! Pertahankan! ⭐⭐',
        subtitle: 'Usahamu sangat bagus dan pemahamanmu sudah semakin mantap! Teruslah rajin belajar!',
        color: 'text-emerald-600',
      };
    }
    return {
      title: 'Kamu Sudah Berusaha Bagus! ⭐',
      subtitle: 'Hebat sudah menyelesaikan permainan! Belajar itu proses, ayo coba lagi bersama Ibu Guru ya!',
      color: 'text-sky-600',
    };
  };

  const encouragement = getEncouragement();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Trophy & Stars Banner */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-950 shadow-lg shadow-amber-200">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                  starIndex <= starsEarned
                    ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                    : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title and Feedback */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500">Hasil Permainan: {playerName}</span>
          <h3 className={`font-display font-extrabold text-2xl sm:text-3xl ${encouragement.color}`}>
            {encouragement.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {encouragement.subtitle}
          </p>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-3 gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Benar</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{correctCount}</p>
          </div>

          <div className="space-y-1 border-x border-amber-200">
            <div className="flex items-center justify-center gap-1 text-sky-600 text-xs font-bold">
              <XCircle className="w-4 h-4" />
              <span>Coba Lagi</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{wrongCount}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-600 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Skor Akhir</span>
            </div>
            <p className="text-2xl font-black text-amber-950">{scorePercent}%</p>
          </div>
        </div>

        {/* Group Scores (if group mode) */}
        {isGroupMode && groupScores && (
          <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <HeartHandshake className="w-4 h-4 text-sky-600" />
              <span>Perolehan Poin Kerja Sama Kelompok:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(groupScores).map(([team, pts]) => (
                <div key={team} className="bg-white p-2 rounded-xl border border-sky-100 flex justify-between font-bold">
                  <span className="text-slate-700 truncate">{team}</span>
                  <span className="text-sky-700">{pts} Poin</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-200 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Pilih Game Lain</span>
          </button>
        </div>

      </div>
    </div>
  );
};
