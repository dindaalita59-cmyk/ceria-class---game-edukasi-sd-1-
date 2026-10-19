import React, { useState, useEffect } from 'react';
import { Game, GameSessionResult, AppSettings } from '../../types';
import { GameHeader } from './GameHeader';
import { GameResultModal } from './GameResultModal';
import { playCorrectSound, playTryAgainSound } from '../../utils/sound';
import { CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface KuisKilatGameProps {
  game: Game;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
}

export const KuisKilatGame: React.FC<KuisKilatGameProps> = ({
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
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [groupScores, setGroupScores] = useState<Record<string, number>>({});

  const currentQuestion = game.questions[currentIndex] || {
    id: 'empty',
    prompt: 'Soal tidak ditemukan',
    options: [],
    correctAnswer: '',
  };

  const activeGroup = isGroupMode && groupNames.length > 0 
    ? groupNames[currentIndex % groupNames.length]
    : playerName;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return; // Prevent double answering

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound(settings.soundEnabled);
      setCorrectCount((prev) => prev + 1);

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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < game.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Game completed
      const total = game.questions.length;
      const finalCorrect = isCorrect ? correctCount : correctCount;
      const scorePct = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;
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
        correctCount: finalCorrect,
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
    setCorrectCount(0);
    setWrongCount(0);
    setShowHint(false);
    setShowResult(false);
    setGroupScores({});
  };

  const readText = `${currentQuestion.prompt}. Pilihan jawaban: ${currentQuestion.options.join(', ')}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${settings.projectorMode ? 'scale-[1.03] transform-gpu' : ''}`}>
      <GameHeader
        game={game}
        currentIndex={currentIndex}
        totalQuestions={game.questions.length}
        score={correctCount * 10}
        playerName={playerName}
        isGroupMode={isGroupMode}
        activeGroupIndex={currentIndex}
        groupNames={groupNames}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onQuit={onQuit}
        readAloudText={readText}
      />

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200/90 shadow-md space-y-8">
        
        {/* Visual Hint / Illustration */}
        {currentQuestion.visualHint && (
          <div className="flex items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200">
            <span className="text-5xl sm:text-7xl select-none filter drop-shadow-sm">
              {currentQuestion.visualHint}
            </span>
          </div>
        )}

        {/* Question Prompt */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-amber-700 tracking-wide uppercase">Pertanyaan Kuis</p>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Options Grid with Macam-macam Warna Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTarget = isAnswered && option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

            // Distinct option colors (A=Rose, B=Sky, C=Emerald, D=Purple, E=Amber)
            const optionColors = [
              { badge: 'bg-rose-500 text-white', hoverBorder: 'hover:border-rose-300 hover:bg-rose-50/50' },
              { badge: 'bg-sky-500 text-white', hoverBorder: 'hover:border-sky-300 hover:bg-sky-50/50' },
              { badge: 'bg-emerald-500 text-white', hoverBorder: 'hover:border-emerald-300 hover:bg-emerald-50/50' },
              { badge: 'bg-purple-500 text-white', hoverBorder: 'hover:border-purple-300 hover:bg-purple-50/50' },
              { badge: 'bg-amber-500 text-white', hoverBorder: 'hover:border-amber-300 hover:bg-amber-50/50' },
            ];
            const colorScheme = optionColors[idx % optionColors.length];

            let buttonStyle = `bg-white text-slate-800 border-slate-200 ${colorScheme.hoverBorder}`;
            
            if (isAnswered) {
              if (isTarget) {
                buttonStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg ring-4 ring-emerald-200';
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
                    isAnswered && isTarget ? 'bg-white text-emerald-700' : colorScheme.badge
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

        {/* Friendly Feedback Banner (After answering) */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
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
                    ? currentQuestion.feedbackCorrect || 'Hebat! Jawabanmu Tepat Sekali! 🎉'
                    : currentQuestion.feedbackIncorrect || 'Ayo Coba Lagi, Kamu Pasti Bisa! 💪'}
                </h4>
                {!isCorrect && (
                  <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-0.5">
                    Kunci jawaban: {currentQuestion.correctAnswer}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-300 transition-all hover:scale-105 shrink-0"
            >
              <span>{currentIndex + 1 < game.questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Helpful Hint (Tier 1: Mulai Belajar) */}
        {!isAnswered && currentQuestion.hint && (
          <div className="pt-2 flex justify-center">
            {showHint ? (
              <div className="bg-sky-50 text-sky-800 text-xs sm:text-sm p-3 rounded-xl border border-sky-200 flex items-center gap-2 font-medium">
                <Lightbulb className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Petunjuk Guru: {currentQuestion.hint}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 p-1 hover:underline"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Perlu bantuan petunjuk?</span>
              </button>
            )}
          </div>
        )}

      </div>

      {/* Result Modal */}
      {showResult && (
        <GameResultModal
          gameTitle={game.title}
          totalQuestions={game.questions.length}
          correctCount={correctCount}
          wrongCount={wrongCount}
          scorePercent={Math.round((correctCount / game.questions.length) * 100)}
          starsEarned={
            Math.round((correctCount / game.questions.length) * 100) >= 80 ? 3 : 
            Math.round((correctCount / game.questions.length) * 100) >= 50 ? 2 : 1
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
