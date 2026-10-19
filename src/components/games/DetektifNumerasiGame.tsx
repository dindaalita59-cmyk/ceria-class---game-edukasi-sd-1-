import React, { useState, useEffect } from 'react';
import { Game, GameSessionResult, AppSettings } from '../../types';
import { GameHeader } from './GameHeader';
import { GameResultModal } from './GameResultModal';
import { playCorrectSound, playTryAgainSound } from '../../utils/sound';
import { Calculator, CheckCircle2, AlertCircle, ArrowRight, Shapes } from 'lucide-react';

interface DetektifNumerasiGameProps {
  game: Game;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
}

export const DetektifNumerasiGame: React.FC<DetektifNumerasiGameProps> = ({
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
  const [countedTaps, setCountedTaps] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [groupScores, setGroupScores] = useState<Record<string, number>>({});

  const currentQuestion = game.questions[currentIndex] || {
    id: 'empty',
    prompt: 'Hitunglah Objek Berikut',
    options: [],
    correctAnswer: '',
  };

  const activeGroup = isGroupMode && groupNames.length > 0 
    ? groupNames[currentIndex % groupNames.length]
    : playerName;

  // Split visual hint into tappable emoji items if it contains multiple emojis
  const visualEmojiList = currentQuestion.visualHint
    ? currentQuestion.visualHint.split(/\s+/).filter((x) => x.length > 0 && !x.includes('vs') && !x.includes('+'))
    : [];

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCountedTaps([]);
  }, [currentIndex]);

  const handleTapObject = (idx: number) => {
    if (countedTaps.includes(idx)) {
      setCountedTaps((prev) => prev.filter((i) => i !== idx));
    } else {
      setCountedTaps((prev) => [...prev, idx]);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

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
    } else {
      const total = game.questions.length;
      const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
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
        correctCount,
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
    setCorrectCount(0);
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
        score={correctCount * 10}
        playerName={playerName}
        isGroupMode={isGroupMode}
        activeGroupIndex={currentIndex}
        groupNames={groupNames}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onQuit={onQuit}
        readAloudText={`${currentQuestion.prompt}. Pilihan: ${currentQuestion.options.join(', ')}`}
      />

      {/* Main Detective Numerasi Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200/90 shadow-md space-y-8">
        
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Misi Detektif Numerasi</span>
          </div>
        </div>

        {/* Interactive Counting Area / Visual Hint */}
        {currentQuestion.visualHint && (
          <div className="bg-gradient-to-tr from-amber-50 to-emerald-50/50 p-6 sm:p-8 rounded-3xl border-2 border-emerald-100 text-center space-y-3">
            {visualEmojiList.length > 1 ? (
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-3">
                  💡 <em>Sentuh objek di bawah satu per satu untuk membantumu berhitung:</em>
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {visualEmojiList.map((emoji, idx) => {
                    const isTapped = countedTaps.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleTapObject(idx)}
                        className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all transform active:scale-90 ${
                          isTapped
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md ring-4 ring-emerald-200'
                            : 'bg-white border-emerald-200 hover:scale-105 shadow-xs'
                        }`}
                        title="Sentuh untuk menghitung"
                      >
                        <span className="text-4xl sm:text-5xl select-none">{emoji}</span>
                        {isTapped && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow-xs">
                            {countedTaps.indexOf(idx) + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {countedTaps.length > 0 && (
                  <p className="text-xs font-black text-emerald-800 mt-2">
                    Kamu sudah menyentuh {countedTaps.length} objek!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-5xl sm:text-7xl filter drop-shadow-sm select-none py-2">
                {currentQuestion.visualHint}
              </div>
            )}
          </div>
        )}

        {/* Prompt */}
        <div className="text-center space-y-2">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Options with Colorful Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTarget = isAnswered && option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

            const optColors = ['bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500'];
            const badgeColor = optColors[idx % optColors.length];

            let buttonStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300';
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
                    ? currentQuestion.feedbackCorrect || 'Perhitunganmu Sangat Akurat! 🌟'
                    : currentQuestion.feedbackIncorrect || 'Ayo Coba Lagi, Kamu Pasti Bisa Menghitungnya!'}
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
              <span>{currentIndex + 1 < game.questions.length ? 'Misi Hitung Berikutnya' : 'Lihat Hasil Akhir'}</span>
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
