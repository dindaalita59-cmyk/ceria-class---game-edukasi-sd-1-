import React, { useState, useEffect } from 'react';
import { Game, GameSessionResult, AppSettings } from '../../types';
import { GameHeader } from './GameHeader';
import { GameResultModal } from './GameResultModal';
import { playCorrectSound, playTryAgainSound } from '../../utils/sound';
import { Search, CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface DetektifLiterasiGameProps {
  game: Game;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
}

export const DetektifLiterasiGame: React.FC<DetektifLiterasiGameProps> = ({
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
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<Array<{ id: number; letter: string; used: boolean }>>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [groupScores, setGroupScores] = useState<Record<string, number>>({});

  const currentQuestion = game.questions[currentIndex] || {
    id: 'empty',
    prompt: 'Teka-Teki Kata Rahasia',
    options: [],
    correctAnswer: 'PATIN',
    letterTiles: ['P', 'A', 'T', 'I', 'N'],
  };

  const targetWord = currentQuestion.correctAnswer.toUpperCase().replace(/\s+/g, '');

  // Setup letter tiles (scrambled)
  useEffect(() => {
    const letters = currentQuestion.letterTiles && currentQuestion.letterTiles.length > 0
      ? currentQuestion.letterTiles
      : targetWord.split('');

    // Scramble tiles
    const tilesWithId = letters.map((letter, index) => ({
      id: index,
      letter: letter.toUpperCase(),
      used: false,
    }));
    
    // Shuffle tiles
    const shuffled = [...tilesWithId].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setAssembledWord([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentIndex, targetWord]);

  const activeGroup = isGroupMode && groupNames.length > 0 
    ? groupNames[currentIndex % groupNames.length]
    : playerName;

  // Handle click on available tile to place into word slot
  const handleSelectTile = (tileId: number, letter: string) => {
    if (isAnswered) return;

    setAvailableTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, used: true } : t))
    );
    const newWord = [...assembledWord, letter];
    setAssembledWord(newWord);

    // Auto check if all letters are placed
    if (newWord.length === targetWord.length) {
      checkWord(newWord.join(''));
    }
  };

  // Remove letter from assembled word
  const handleRemoveTile = (index: number, letter: string) => {
    if (isAnswered) return;

    const newWord = [...assembledWord];
    newWord.splice(index, 1);
    setAssembledWord(newWord);

    // Free the tile in available tiles
    let freed = false;
    setAvailableTiles((prev) =>
      prev.map((t) => {
        if (!freed && t.used && t.letter === letter) {
          freed = true;
          return { ...t, used: false };
        }
        return t;
      })
    );
  };

  // Reset assembled word in current question
  const handleResetCurrentWord = () => {
    if (isAnswered) return;
    setAssembledWord([]);
    setAvailableTiles((prev) => prev.map((t) => ({ ...t, used: false })));
  };

  const checkWord = (wordAttempt: string) => {
    setIsAnswered(true);
    const correct = wordAttempt.toUpperCase() === targetWord;
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
        readAloudText={`${currentQuestion.prompt}. Susunlah huruf-huruf menjadi kata yang tepat.`}
      />

      {/* Main Detective Literary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200/90 shadow-md space-y-8 text-center">
        
        {/* Detective Clue Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold">
          <Search className="w-4 h-4 text-indigo-600" />
          <span>Misi Detektif: Susun Huruf Menjadi Kata</span>
        </div>

        {/* Visual Clue */}
        {currentQuestion.visualHint && (
          <div className="flex items-center justify-center p-6 bg-gradient-to-tr from-sky-50 to-indigo-50 rounded-2xl border border-indigo-100 max-w-sm mx-auto">
            <span className="text-6xl sm:text-7xl filter drop-shadow-md select-none">
              {currentQuestion.visualHint}
            </span>
          </div>
        )}

        {/* Prompt */}
        <div className="space-y-1">
          <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900">
            {currentQuestion.prompt}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Ketuk huruf-huruf di bawah secara berurutan untuk menyusun kata rahasia!
          </p>
        </div>

        {/* Target Word Slots (Assembled Word) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
          {Array.from({ length: targetWord.length }).map((_, idx) => {
            const letter = assembledWord[idx];
            return (
              <button
                key={idx}
                type="button"
                disabled={!letter || isAnswered}
                onClick={() => letter && handleRemoveTile(idx, letter)}
                className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl font-display font-black text-2xl sm:text-3xl flex items-center justify-center transition-all ${
                  letter
                    ? isAnswered
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-200'
                        : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                      : 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-md hover:scale-95 cursor-pointer'
                    : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-300'
                }`}
                title={letter ? 'Ketuk untuk mengembalikan huruf' : undefined}
              >
                {letter || ''}
              </button>
            );
          })}
        </div>

        {/* Reset assembled button (if not finished) */}
        {!isAnswered && assembledWord.length > 0 && (
          <div>
            <button
              onClick={handleResetCurrentWord}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Susunan Huruf</span>
            </button>
          </div>
        )}

        {/* Available Letter Tiles to Tap with Rainbow Colors */}
        {!isAnswered && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pilihan Huruf Detektif Ceria:
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {availableTiles.map((tile, tIdx) => {
                const rainbowTiles = [
                  'bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-600 shadow-rose-200',
                  'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-amber-600 shadow-amber-200',
                  'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-emerald-600 shadow-emerald-200',
                  'bg-gradient-to-b from-sky-400 to-sky-500 text-white border-sky-600 shadow-sky-200',
                  'bg-gradient-to-b from-purple-400 to-purple-500 text-white border-purple-600 shadow-purple-200',
                  'bg-gradient-to-b from-teal-400 to-teal-500 text-white border-teal-600 shadow-teal-200',
                ];
                const activeRainbow = rainbowTiles[tIdx % rainbowTiles.length];

                return (
                  <button
                    key={tile.id}
                    disabled={tile.used}
                    onClick={() => handleSelectTile(tile.id, tile.letter)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-display font-black text-2xl sm:text-3xl border-2 transition-all duration-150 flex items-center justify-center ${
                      tile.used
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-default opacity-40 shadow-none'
                        : `${activeRainbow} shadow-md hover:scale-110 active:scale-95 cursor-pointer`
                    }`}
                  >
                    {tile.letter}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer Feedback Banner */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <CheckCircle2 className={`w-8 h-8 shrink-0 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <h4 className="font-display font-black text-lg">
                  {isCorrect
                    ? currentQuestion.feedbackCorrect || `Hebat Detektif! Kata rahasianya: ${targetWord}! 🔍🎉`
                    : `Hampir Tepat! Kata rahasianya adalah: ${targetWord}`}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  {isCorrect ? 'Kemampuan membacamu sungguh luar biasa!' : 'Tetap semangat, perhatikan susunan hurufnya ya!'}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-300 transition-all hover:scale-105 shrink-0"
            >
              <span>{currentIndex + 1 < game.questions.length ? 'Kata Rahasia Berikutnya' : 'Lihat Hasil Akhir'}</span>
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
