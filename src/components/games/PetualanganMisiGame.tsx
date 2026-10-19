import React, { useState } from 'react';
import { Game, GameSessionResult, AppSettings } from '../../types';
import { GameHeader } from './GameHeader';
import { GameResultModal } from './GameResultModal';
import { playCorrectSound, playTryAgainSound } from '../../utils/sound';
import { Star, CheckCircle2, AlertCircle, ArrowRight, Compass, MapPin } from 'lucide-react';

interface PetualanganMisiGameProps {
  game: Game;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
}

export const PetualanganMisiGame: React.FC<PetualanganMisiGameProps> = ({
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [starsCollected, setStarsCollected] = useState<number[]>([]); // indexes of solved checkpoints
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [groupScores, setGroupScores] = useState<Record<string, number>>({});

  const currentQuestion = game.questions[currentIndex] || {
    id: 'empty',
    prompt: 'Soal Misi',
    options: [],
    correctAnswer: '',
  };

  const activeGroup = isGroupMode && groupNames.length > 0 
    ? groupNames[currentIndex % groupNames.length]
    : playerName;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound(settings.soundEnabled);
      if (!starsCollected.includes(currentIndex)) {
        setStarsCollected((prev) => [...prev, currentIndex]);
      }

      if (isGroupMode && activeGroup) {
        setGroupScores((prev) => ({
          ...prev,
          [activeGroup]: (prev[activeGroup] || 0) + 10,
        }));
      }
    } else {
      playTryAgainSound(settings.soundEnabled);
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNextStation = () => {
    if (currentIndex + 1 < game.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Completed all checkpoints!
      const total = game.questions.length;
      const solved = starsCollected.length + (isCorrect && !starsCollected.includes(currentIndex) ? 1 : 0);
      const scorePct = total > 0 ? Math.round((solved / total) * 100) : 0;
      const stars = scorePct >= 80 ? 3 : scorePct >= 50 ? 2 : 1;
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
        totalQuestions: total,
        correctCount: solved,
        wrongCount,
        scorePercent: scorePct,
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
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setStarsCollected([]);
    setWrongCount(0);
    setShowResult(false);
    setGroupScores({});
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${settings.projectorMode ? 'scale-[1.03] transform-gpu' : ''}`}>
      <GameHeader
        game={game}
        currentIndex={currentIndex}
        totalQuestions={game.questions.length}
        score={starsCollected.length * 15}
        playerName={playerName}
        isGroupMode={isGroupMode}
        activeGroupIndex={currentIndex}
        groupNames={groupNames}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onQuit={onQuit}
        readAloudText={currentQuestion.prompt}
      />

      {/* Adventure Mission Progress Trail / Checkpoints Map */}
      <div className="bg-gradient-to-r from-sky-50 via-amber-50 to-emerald-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
            <span className="font-display font-extrabold text-sm sm:text-base text-slate-800">
              Peta Jejak Petualangan Misi
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-800 shadow-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{starsCollected.length} / {game.questions.length} Bintang Terkumpul</span>
          </div>
        </div>

        {/* Stations Line */}
        <div className="relative flex items-center justify-between px-2 sm:px-6 py-2">
          {/* Connector line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 bg-slate-200 rounded-full z-0" />
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-2 bg-amber-400 rounded-full z-0 transition-all duration-300"
            style={{ 
              width: `${(Math.min(currentIndex, game.questions.length - 1) / Math.max(1, game.questions.length - 1)) * 90}%` 
            }} 
          />

          {game.questions.map((q, idx) => {
            const isSolved = starsCollected.includes(idx);
            const isCurrent = currentIndex === idx;

            // Distinct station colors for each pos
            const stationPalettes = [
              { active: 'bg-amber-400 text-amber-950 ring-amber-300 shadow-amber-200' },
              { active: 'bg-rose-500 text-white ring-rose-300 shadow-rose-200' },
              { active: 'bg-sky-500 text-white ring-sky-300 shadow-sky-200' },
              { active: 'bg-emerald-500 text-white ring-emerald-300 shadow-emerald-200' },
              { active: 'bg-purple-600 text-white ring-purple-300 shadow-purple-200' },
            ];
            const palette = stationPalettes[idx % stationPalettes.length];

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-display font-black text-sm sm:text-base transition-all duration-200 ${
                    isSolved
                      ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-200 scale-105'
                      : isCurrent
                      ? `${palette.active} shadow-lg ring-4 scale-110 animate-bounce-subtle`
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isSolved ? <Star className="w-5 h-5 fill-amber-950" /> : idx + 1}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-1 hidden sm:block">
                  Pos {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Mission Station Challenge */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-md space-y-6">
        
        {/* Mission Pos Title */}
        <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Tantangan Pos {currentIndex + 1} dari {game.questions.length}</span>
        </div>

        {/* Visual Hint */}
        {currentQuestion.visualHint && (
          <div className="flex items-center justify-center p-5 bg-gradient-to-tr from-amber-50 via-rose-50 to-sky-50 rounded-2xl border border-slate-200">
            <span className="text-5xl sm:text-6xl filter drop-shadow-xs">
              {currentQuestion.visualHint}
            </span>
          </div>
        )}

        {/* Question Prompt */}
        <div className="text-center space-y-2">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Multiple choice options with colorful badges */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTarget = isAnswered && option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

            const optColors = ['bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500'];
            const badgeColor = optColors[idx % optColors.length];

            let buttonStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300';
            if (isAnswered) {
              if (isTarget) {
                buttonStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-100 text-rose-800 border-rose-300';
              } else {
                buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`py-4 px-5 rounded-2xl font-bold text-base sm:text-lg border-2 text-left transition-all duration-150 flex items-center justify-between shadow-xs ${buttonStyle} ${
                  !isAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                    isAnswered && isTarget ? 'bg-white text-emerald-700' : `${badgeColor} text-white`
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && isTarget && <CheckCircle2 className="w-6 h-6 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
              )}
              <div>
                <h4 className="font-display font-black text-lg">
                  {isCorrect
                    ? currentQuestion.feedbackCorrect || 'Bintang Emas Diraih! Lanjut ke Pos Berikutnya! ⭐'
                    : currentQuestion.feedbackIncorrect || 'Ayo Coba Lagi, Kamu Pasti Mampu!'}
                </h4>
                {!isCorrect && (
                  <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-0.5">
                    Jawaban yang tepat: {currentQuestion.correctAnswer}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextStation}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-300 transition-all hover:scale-105 shrink-0"
            >
              <span>{currentIndex + 1 < game.questions.length ? 'Lanjut ke Pos Berikutnya' : 'Buka Peti Kemenangan!'}</span>
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
          correctCount={starsCollected.length}
          wrongCount={wrongCount}
          scorePercent={Math.round((starsCollected.length / game.questions.length) * 100)}
          starsEarned={
            Math.round((starsCollected.length / game.questions.length) * 100) >= 80 ? 3 : 
            Math.round((starsCollected.length / game.questions.length) * 100) >= 50 ? 2 : 1
          }
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
