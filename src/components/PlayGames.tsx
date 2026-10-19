import React, { useState } from 'react';
import { Game, Student, Subject, GradeLevel, GameType, DifficultyLevel, AppSettings, GameSessionResult } from '../types';
import { 
  Gamepad2, 
  Users, 
  User, 
  Play, 
  Sparkles, 
  Compass, 
  Search, 
  Calculator, 
  Puzzle, 
  HelpCircle,
  X,
  Plus
} from 'lucide-react';
import { KuisKilatGame } from './games/KuisKilatGame';
import { PasangkanAkuGame } from './games/PasangkanAkuGame';
import { PetualanganMisiGame } from './games/PetualanganMisiGame';
import { DetektifLiterasiGame } from './games/DetektifLiterasiGame';
import { DetektifNumerasiGame } from './games/DetektifNumerasiGame';

interface PlayGamesProps {
  games: Game[];
  students: Student[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRecordResult: (result: GameSessionResult) => void;
  onOpenGameMaker: () => void;
}

export const PlayGames: React.FC<PlayGamesProps> = ({
  games,
  students,
  settings,
  onUpdateSettings,
  onRecordResult,
  onOpenGameMaker,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');

  // Launch modal states
  const [launchingGame, setLaunchingGame] = useState<Game | null>(null);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(false);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [customPlayerName, setCustomPlayerName] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('sedang-berkembang');
  
  // Group mode teams with colorful distinct names
  const [groupTeams, setGroupTeams] = useState<string[]>([
    'Kelompok Patin Ceria',
    'Kelompok Padi Emas',
    'Kelompok Rajawali Musi',
  ]);
  const [newTeamName, setNewTeamName] = useState<string>('');

  // Active playing game instance
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [activePlayerName, setActivePlayerName] = useState<string>('');

  // Filter games
  const filteredGames = games.filter((game) => {
    if (selectedSubject !== 'Semua' && game.subject !== selectedSubject) return false;
    if (selectedGrade !== 'Semua' && game.grade !== selectedGrade) return false;
    if (selectedType !== 'Semua' && game.gameType !== selectedType) return false;
    return true;
  });

  // Theme configuration for each subject (Macam-macam Warna!)
  const getSubjectTheme = (subject: Subject) => {
    switch (subject) {
      case 'Bahasa Indonesia':
        return {
          cardBg: 'bg-rose-50/40 hover:bg-rose-50/70',
          border: 'border-rose-200 hover:border-rose-400',
          iconBg: 'bg-rose-500 text-white shadow-rose-200',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          btnBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-200',
        };
      case 'Matematika':
        return {
          cardBg: 'bg-sky-50/40 hover:bg-sky-50/70',
          border: 'border-sky-200 hover:border-sky-400',
          iconBg: 'bg-sky-500 text-white shadow-sky-200',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
          btnBg: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-200',
        };
      case 'Pendidikan Pancasila':
        return {
          cardBg: 'bg-purple-50/40 hover:bg-purple-50/70',
          border: 'border-purple-200 hover:border-purple-400',
          iconBg: 'bg-purple-500 text-white shadow-purple-200',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
          btnBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-purple-200',
        };
      case 'Muatan Lokal Banyuasin':
        return {
          cardBg: 'bg-emerald-50/40 hover:bg-emerald-50/70',
          border: 'border-emerald-200 hover:border-emerald-400',
          iconBg: 'bg-emerald-500 text-white shadow-emerald-200',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200',
        };
      default:
        return {
          cardBg: 'bg-amber-50/40 hover:bg-amber-50/70',
          border: 'border-amber-200 hover:border-amber-400',
          iconBg: 'bg-amber-500 text-white shadow-amber-200',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200',
        };
    }
  };

  const getGameTypeIcon = (type: GameType) => {
    switch (type) {
      case 'kuis-kilat':
        return <Gamepad2 className="w-5 h-5" />;
      case 'pasangkan-aku':
        return <Puzzle className="w-5 h-5" />;
      case 'petualangan-misi':
        return <Compass className="w-5 h-5" />;
      case 'detektif-literasi':
        return <Search className="w-5 h-5" />;
      case 'detektif-numerasi':
        return <Calculator className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getGameTypeLabel = (type: GameType) => {
    switch (type) {
      case 'kuis-kilat':
        return 'Kuis Kilat';
      case 'pasangkan-aku':
        return 'Pasangkan Aku';
      case 'petualangan-misi':
        return 'Petualangan Misi';
      case 'detektif-literasi':
        return 'Detektif Literasi';
      case 'detektif-numerasi':
        return 'Detektif Numerasi';
      default:
        return type;
    }
  };

  const handleOpenLaunchModal = (game: Game) => {
    setLaunchingGame(game);
    setSelectedDifficulty(game.difficulty);
    if (students.length > 0) {
      setSelectedStudentName(students[0].name);
    } else {
      setSelectedStudentName('Siswa Ceria');
    }
  };

  const handleStartGame = () => {
    if (!launchingGame) return;

    const finalPlayer = isGroupMode 
      ? 'Mode Kelompok' 
      : (customPlayerName.trim() || selectedStudentName || 'Siswa Kelas Rendah');

    const customizedGame: Game = {
      ...launchingGame,
      difficulty: selectedDifficulty,
    };

    setActiveGame(customizedGame);
    setActivePlayerName(finalPlayer);
    setLaunchingGame(null);
  };

  const handleAddTeam = () => {
    if (newTeamName.trim() && !groupTeams.includes(newTeamName.trim())) {
      setGroupTeams([...groupTeams, newTeamName.trim()]);
      setNewTeamName('');
    }
  };

  const handleRemoveTeam = (index: number) => {
    if (groupTeams.length > 2) {
      setGroupTeams(groupTeams.filter((_, i) => i !== index));
    }
  };

  if (activeGame) {
    switch (activeGame.gameType) {
      case 'kuis-kilat':
        return (
          <KuisKilatGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
      case 'pasangkan-aku':
        return (
          <PasangkanAkuGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
      case 'petualangan-misi':
        return (
          <PetualanganMisiGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
      case 'detektif-literasi':
        return (
          <DetektifLiterasiGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
      case 'detektif-numerasi':
        return (
          <DetektifNumerasiGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
      default:
        return (
          <KuisKilatGame
            game={activeGame}
            playerName={activePlayerName}
            isGroupMode={isGroupMode}
            groupNames={groupTeams}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onFinishGame={onRecordResult}
            onQuit={() => setActiveGame(null)}
          />
        );
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner in Multi-Color Gradient */}
      <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pilihan Game Interaktif Warna-Warni</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl">
            Ayo Mainkan Game Ceria!
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 font-semibold leading-relaxed">
            Pilih permainan siap pakai untuk dimainkan mandiri, per kelompok warna, atau di proyektor kelas bersama siswa SDN 32 Rantau Bayur.
          </p>
        </div>
      </div>

      {/* Multi-Colored Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Subjects Filter with individual themed colors */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'Semua', label: 'Semua Mapel', active: 'bg-slate-800 text-white' },
              { id: 'Bahasa Indonesia', label: 'Bahasa Indonesia', active: 'bg-rose-500 text-white shadow-rose-200' },
              { id: 'Matematika', label: 'Matematika', active: 'bg-sky-500 text-white shadow-sky-200' },
              { id: 'Pendidikan Pancasila', label: 'Pendidikan Pancasila', active: 'bg-purple-500 text-white shadow-purple-200' },
              { id: 'Muatan Lokal Banyuasin', label: 'Muatan Lokal Banyuasin', active: 'bg-emerald-500 text-white shadow-emerald-200' },
            ].map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  selectedSubject === subj.id
                    ? subj.active
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {subj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade & Game Type Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Kelas:</span>
            {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3'].map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGrade === gr
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {gr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Jenis Game:</span>
            {['Semua', 'kuis-kilat', 'pasangkan-aku', 'petualangan-misi', 'detektif-literasi', 'detektif-numerasi'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedType === type
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'Semua' ? 'Semua Jenis' : getGameTypeLabel(type as GameType)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Games List Grid (with individual Subject Themes & Colors) */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const theme = getSubjectTheme(game.subject);

            return (
              <div
                key={game.id}
                className={`rounded-3xl p-6 border-2 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${theme.cardBg} ${theme.border}`}
              >
                <div className="space-y-3">
                  
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${theme.iconBg}`}>
                        {getGameTypeIcon(game.gameType)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {getGameTypeLabel(game.gameType)}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                      {game.grade}
                    </span>
                  </div>

                  {/* Title & Goal */}
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {game.learningGoal || game.topic}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${theme.badgeBg}`}>
                      {game.subject}
                    </span>
                    <span>·</span>
                    <span>{game.questions.length} Soal</span>
                  </div>

                </div>

                {/* Themed Action Button */}
                <div className="pt-6">
                  <button
                    onClick={() => handleOpenLaunchModal(game)}
                    className={`w-full py-3 px-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer ${theme.btnBg}`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mulai Mainkan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl text-slate-900">
              Belum Ada Game yang Sesuai Filter
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Coba sesuaikan filter mata pelajaran atau buat game baru khusus materi ini lewat menu Game Maker!
            </p>
          </div>
          <button
            onClick={onOpenGameMaker}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm inline-flex items-center gap-2 shadow-sm hover:from-emerald-600 hover:to-teal-700"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Game Baru di Game Maker</span>
          </button>
        </div>
      )}

      {/* Pre-Game Launcher Modal with Colorful Team Badges */}
      {launchingGame && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-indigo-300 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Pengaturan Sesi Bermain</span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 line-clamp-1">
                  {launchingGame.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {launchingGame.grade} · {launchingGame.subject} · {launchingGame.questions.length} Soal
                </p>
              </div>
              <button
                onClick={() => setLaunchingGame(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Pemain: Individu vs Kelompok */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase">Mode Bermain di Kelas:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsGroupMode(false)}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all ${
                    !isGroupMode
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Siswa Mandiri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGroupMode(true)}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isGroupMode
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-transparent shadow-md shadow-purple-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Mode Kelompok / Tim</span>
                </button>
              </div>
            </div>

            {/* Individual Student Selection */}
            {!isGroupMode ? (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Pilih Siswa atau Ketik Nama:</label>
                {students.length > 0 && (
                  <select
                    value={selectedStudentName}
                    onChange={(e) => setSelectedStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-800 bg-slate-50"
                  >
                    {students.map((std) => (
                      <option key={std.id} value={std.name}>
                        {std.name} ({std.grade}) {std.isDemo ? '[DEMO]' : ''}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  placeholder="Atau ketik nama pemain..."
                  value={customPlayerName}
                  onChange={(e) => setCustomPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                />
              </div>
            ) : (
              /* Group Mode Teams with Colorful Badges */
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Nama Tim Kelompok:</label>
                <div className="flex flex-wrap gap-2">
                  {groupTeams.map((team, idx) => {
                    const colors = [
                      'bg-rose-100 text-rose-800 border-rose-300',
                      'bg-amber-100 text-amber-800 border-amber-300',
                      'bg-sky-100 text-sky-800 border-sky-300',
                      'bg-emerald-100 text-emerald-800 border-emerald-300',
                    ];
                    const colorClass = colors[idx % colors.length];

                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${colorClass}`}
                      >
                        <span>{team}</span>
                        {groupTeams.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTeam(idx)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tambah nama kelompok..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTeam}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            )}

            {/* Pembelajaran Berdiferensiasi Tier */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Tingkat Pembelajaran Berdiferensiasi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mulai-belajar' as DifficultyLevel, label: 'Mulai Belajar', desc: 'Huruf & Visual', activeBg: 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-300' },
                  { id: 'sedang-berkembang' as DifficultyLevel, label: 'Berkembang', desc: 'Suku Kata & Hitung', activeBg: 'bg-sky-100 text-sky-950 border-sky-400 ring-2 ring-sky-300' },
                  { id: 'tantangan' as DifficultyLevel, label: 'Tantangan', desc: 'Kalimat & Cerita', activeBg: 'bg-emerald-100 text-emerald-950 border-emerald-400 ring-2 ring-emerald-300' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(tier.id)}
                    className={`p-2.5 rounded-xl border font-bold text-xs text-left transition-all ${
                      selectedDifficulty === tier.id
                        ? tier.activeBg
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-black">{tier.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLaunchingGame(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartGame}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Bermain!</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
