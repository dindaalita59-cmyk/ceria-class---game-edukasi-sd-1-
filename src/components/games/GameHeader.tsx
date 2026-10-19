import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Megaphone, Star, Users, User, Projector } from 'lucide-react';
import { Game, AppSettings } from '../../types';
import { speakIndonesian } from '../../utils/sound';

interface GameHeaderProps {
  game: Game;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  playerName: string;
  isGroupMode: boolean;
  activeGroupIndex?: number;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onQuit: () => void;
  readAloudText?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  game,
  currentIndex,
  totalQuestions,
  score,
  playerName,
  isGroupMode,
  activeGroupIndex = 0,
  groupNames = [],
  settings,
  onUpdateSettings,
  onQuit,
  readAloudText,
}) => {
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm space-y-3">
      {/* Top action row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={onQuit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Game</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read aloud prompt for 1-3 SD readers */}
          {readAloudText && (
            <button
              onClick={() => speakIndonesian(readAloudText, settings.voiceEnabled)}
              title="Dengarkan Suara Soal (Bacakan)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Bacakan</span>
            </button>
          )}

          {/* Sound toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            title="Suara Efek"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Projector switch */}
          <button
            onClick={() => onUpdateSettings({ projectorMode: !settings.projectorMode })}
            className={`p-1.5 rounded-xl border transition-colors ${
              settings.projectorMode 
                ? 'bg-sky-600 text-white border-sky-600' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Mode Proyektor Layar Lebar"
          >
            <Projector className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game info & player identity */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
        <div>
          <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 line-clamp-1">
            {game.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{game.grade}</span>
            <span>·</span>
            <span>{game.subject}</span>
            <span>·</span>
            <span className="capitalize">{game.difficulty.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Player / Group Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-xl border border-sky-200 text-xs font-bold">
            {isGroupMode ? <Users className="w-4 h-4 text-sky-600" /> : <User className="w-4 h-4 text-sky-600" />}
            <span>
              {isGroupMode && groupNames.length > 0 
                ? `Giliran: ${groupNames[activeGroupIndex % groupNames.length]}`
                : playerName}
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-extrabold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Skor: {score}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Soal {currentIndex + 1} dari {totalQuestions}</span>
          <span>{Math.round(progressPercent)}% Selesai</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
