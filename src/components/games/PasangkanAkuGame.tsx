import React, { useState, useEffect } from 'react';
import { Game, GameSessionResult, AppSettings, PairMatchItem } from '../../types';
import { GameHeader } from './GameHeader';
import { GameResultModal } from './GameResultModal';
import { playCorrectSound, playTryAgainSound } from '../../utils/sound';
import { CheckCircle2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface PasangkanAkuGameProps {
  game: Game;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
}

export const PasangkanAkuGame: React.FC<PasangkanAkuGameProps> = ({
  game,
  playerName,
  isGroupMode,
  groupNames = [],
  settings,
  onUpdateSettings,
  onFinishGame,
  onQuit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [mismatchedRightId, setMismatchedRightId] = useState<string | null>(null);
  const [shuffledRights, setShuffledRights] = useState<Array<{ id: string; text: string }>>([]);
  
  const [correctPairsCount, setCorrectPairsCount] = useState(0);
  const [attemptErrors, setAttemptErrors] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [groupScores, setGroupScores] = useState<Record<string, number>>({});

  const currentQuestion = game.questions[currentIndex] || {
    id: 'empty',
    prompt: 'Pasangkanlah item yang sesuai',
    options: [],
    correctAnswer: '',
    pairs: [],
  };

  const currentPairs: PairMatchItem[] = currentQuestion.pairs && currentQuestion.pairs.length > 0
    ? currentQuestion.pairs
    : [
        { id: 'dp-1', left: 'Buku', right: '📖 Buku Pelajaran' },
        { id: 'dp-2', left: 'Ikan Patin', right: '🐟 Ikan Sungai' },
        { id: 'dp-3', left: 'Padi', right: '🌾 Tanaman Sawah' },
        { id: 'dp-4', left: 'Bola', right: '⚽ Bola Kaki' },
      ];

  // Shuffle right items on question load to make it a fun challenge
  useEffect(() => {
    const rights = currentPairs.map((p) => ({ id: p.id, text: p.right }));
    // deterministic seed or random shuffle
    const shuffled = [...rights].sort(() => Math.random() - 0.5);
    setShuffledRights(shuffled);
    setSelectedLeftId(null);
    setMatchedPairIds([]);
    setMismatchedRightId(null);
  }, [currentIndex]);

  const activeGroup = isGroupMode && groupNames.length > 0 
    ? groupNames[currentIndex % groupNames.length]
    : playerName;

  const handleSelectLeft = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    setSelectedLeftId(id);
    setMismatchedRightId(null);
  };

  const handleSelectRight = (rightPairId: string) => {
    if (matchedPairIds.includes(rightPairId)) return;
    if (!selectedLeftId) {
      // Prompt user to select left first
      return;
    }

    if (selectedLeftId === rightPairId) {
      // MATCH!
      playCorrectSound(settings.soundEnabled);
      const newMatched = [...matchedPairIds, rightPairId];
      setMatchedPairIds(newMatched);
      setSelectedLeftId(null);
      setMismatchedRightId(null);
      setCorrectPairsCount((prev) => prev + 1);

      if (isGroupMode && activeGroup) {
        setGroupScores((prev) => ({
          ...prev,
          [activeGroup]: (prev[activeGroup] || 0) + 10,
        }));
      }
    } else {
      // MISMATCH
      playTryAgainSound(settings.soundEnabled);
      setMismatchedRightId(rightPairId);
      setAttemptErrors((prev) => prev + 1);
      setTimeout(() => {
        setMismatchedRightId(null);
      }, 700);
    }
  };

  const allMatchedInQuestion = matchedPairIds.length === currentPairs.length;

  const handleNextQuestion = () => {
    if (currentIndex + 1 < game.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all questions
      const totalPairs = game.questions.reduce((acc, q) => acc + (q.pairs?.length || 4), 0);
      const scorePct = totalPairs > 0 
        ? Math.max(20, Math.round(((totalPairs - attemptErrors * 0.3) / totalPairs) * 100))
        : 100;
      const stars = scorePct >= 85 ? 3 : scorePct >= 60 ? 2 : 1;
      const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      const sessionResult: GameSessionResult = {
        id: 'res-' + Date.now(),
        gameId: game.id,
        gameTitle: game.title,
        subject: game.subject,
        topic: game.topic,
        gameType: game.gameType,
        difficulty: game.difficulty,
        playerName,
        isGroupMode,
        groupNames: isGroupMode ? groupNames : undefined,
        totalQuestions: totalPairs,
        correctCount: totalPairs,
        wrongCount: attemptErrors,
        scorePercent: Math.min(100, Math.max(0, scorePct)),
        starsEarned: stars,
        durationSeconds: duration,
        completedAt: new Date().toISOString(),
      };

      onFinishGame(sessionResult);
      setShowResult(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setSelectedLeftId(null);
    setMatchedPairIds([]);
    setMismatchedRightId(null);
    setCorrectPairsCount(0);
    setAttemptErrors(0);
    setShowResult(false);
    setGroupScores({});
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${settings.projectorMode ? 'scale-[1.03] transform-gpu' : ''}`}>
      <GameHeader
        game={game}
        currentIndex={currentIndex}
        totalQuestions={game.questions.length}
        score={correctPairsCount * 10}
        playerName={playerName}
        isGroupMode={isGroupMode}
        activeGroupIndex={currentIndex}
        groupNames={groupNames}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onQuit={onQuit}
        readAloudText={`${currentQuestion.prompt}. Sentuh satu kartu di sebelah kiri, lalu sentuh pasangannya di sebelah kanan.`}
      />

      {/* Main Matching Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 shadow-md space-y-6">
        
        {/* Instruction Banner */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">Teka-Teki Pasangkan Aku</span>
          <h3 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900">
            {currentQuestion.prompt}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            💡 <strong>Cara Main:</strong> Klik/Sentuh kartu di kolom <strong>KIRI</strong>, lalu klik pasangannya di kolom <strong>KANAN</strong>!
          </p>
        </div>

        {/* 2-Column Matching Playfield */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
          
          {/* Left Column (Items) */}
          <div className="space-y-3">
            <div className="text-xs font-black text-sky-800 uppercase tracking-wider text-center pb-1">
              Kolom Kiri
            </div>
            {currentPairs.map((pair) => {
              const isMatched = matchedPairIds.includes(pair.id);
              const isSelected = selectedLeftId === pair.id;

              let style = 'bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-800';
              if (isMatched) {
                style = 'bg-emerald-500 text-white border-emerald-600 shadow-sm opacity-90 cursor-default';
              } else if (isSelected) {
                style = 'bg-sky-600 text-white border-sky-700 shadow-lg scale-[1.03] ring-4 ring-sky-200';
              }

              return (
                <button
                  key={pair.id}
                  disabled={isMatched}
                  onClick={() => handleSelectLeft(pair.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 font-bold text-sm sm:text-lg text-left transition-all duration-150 flex items-center justify-between ${style} ${
                    !isMatched ? 'cursor-pointer hover:shadow-xs' : ''
                  }`}
                >
                  <span className="line-clamp-2">{pair.left}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                  {isSelected && <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Column (Matches) */}
          <div className="space-y-3">
            <div className="text-xs font-black text-amber-800 uppercase tracking-wider text-center pb-1">
              Kolom Kanan
            </div>
            {shuffledRights.map((item) => {
              const isMatched = matchedPairIds.includes(item.id);
              const isMismatched = mismatchedRightId === item.id;

              let style = 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800';
              if (isMatched) {
                style = 'bg-emerald-500 text-white border-emerald-600 shadow-sm opacity-90 cursor-default';
              } else if (isMismatched) {
                style = 'bg-rose-100 text-rose-800 border-rose-400 animate-shake';
              }

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleSelectRight(item.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 font-bold text-sm sm:text-lg text-left transition-all duration-150 flex items-center justify-between ${style} ${
                    !isMatched ? 'cursor-pointer hover:shadow-xs' : ''
                  }`}
                >
                  <span className="line-clamp-2">{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Success / Next Question Bar */}
        {allMatchedInQuestion && (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-display font-black text-lg">
                  {currentQuestion.feedbackCorrect || 'Hebat! Semua Pasangan Cocok Sempurna! 🎉'}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                  Kamu sangat cermat dan teliti dalam mencari pasangan kata!
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-300 transition-all hover:scale-105 shrink-0"
            >
              <span>{currentIndex + 1 < game.questions.length ? 'Tantangan Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Result Modal */}
      {showResult && (
        <GameResultModal
          gameTitle={game.title}
          totalQuestions={game.questions.length}
          correctCount={correctPairsCount}
          wrongCount={attemptErrors}
          scorePercent={Math.max(30, Math.min(100, 100 - attemptErrors * 10))}
          starsEarned={attemptErrors <= 1 ? 3 : attemptErrors <= 3 ? 2 : 1}
          durationSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
          playerName={playerName}
          isGroupMode={isGroupMode}
          groupScores={isGroupMode ? groupScores : undefined}
          soundEnabled={settings.soundEnabled}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={onQuit}
        />
      )}
    </div>
  );
};
