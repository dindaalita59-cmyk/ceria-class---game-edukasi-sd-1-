import React, { useState } from 'react';
import { Game, Question, GameType, DifficultyLevel, Subject, GradeLevel, PairMatchItem } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Eye, 
  Play, 
  Sparkles, 
  HelpCircle, 
  Check, 
  AlertTriangle,
  Lightbulb,
  X
} from 'lucide-react';

interface GameMakerProps {
  onSaveGame: (game: Game) => void;
  onPlayGameDirectly: (game: Game) => void;
  onCancel: () => void;
  existingGame?: Game | null;
}

export const GameMaker: React.FC<GameMakerProps> = ({
  onSaveGame,
  onPlayGameDirectly,
  onCancel,
  existingGame,
}) => {
  const [title, setTitle] = useState(existingGame?.title || '');
  const [grade, setGrade] = useState<GradeLevel>(existingGame?.grade || 'Kelas 1');
  const [subject, setSubject] = useState<Subject>(existingGame?.subject || 'Bahasa Indonesia');
  const [topic, setTopic] = useState(existingGame?.topic || '');
  const [learningGoal, setLearningGoal] = useState(existingGame?.learningGoal || '');
  const [gameType, setGameType] = useState<GameType>(existingGame?.gameType || 'kuis-kilat');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(existingGame?.difficulty || 'sedang-berkembang');
  const [timePerQuestionSec, setTimePerQuestionSec] = useState<number>(existingGame?.timePerQuestionSec || 0);

  // Questions array
  const [questions, setQuestions] = useState<Question[]>(
    existingGame?.questions && existingGame.questions.length > 0
      ? existingGame.questions
      : [
          {
            id: 'q-custom-1',
            prompt: 'Contoh soal pertama:',
            visualHint: '🍎',
            options: ['Opsi A', 'Opsi B', 'Opsi C'],
            correctAnswer: 'Opsi A',
            feedbackCorrect: 'Hebat! Jawabanmu benar!',
            feedbackIncorrect: 'Ayo coba lagi ya.',
            hint: 'Petunjuk ramah untuk membantu siswa.',
          },
        ]
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Question manipulation handlers
  const handleAddQuestion = () => {
    const newQ: Question = {
      id: 'q-' + Date.now(),
      prompt: '',
      visualHint: '',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C'],
      correctAnswer: 'Pilihan A',
      feedbackCorrect: 'Bagus sekali! Jawabanmu tepat!',
      feedbackIncorrect: 'Ayo coba lagi, kamu pasti bisa!',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      setValidationError('Game harus memiliki minimal 1 pertanyaan.');
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const copy = [...questions];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setQuestions(copy);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = questions.map((q, i) => (i === index ? { ...q, ...updates } : q));
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    const q = questions[qIndex];
    const prevOptionValue = q.options[optIndex];
    const newOptions = [...q.options];
    newOptions[optIndex] = value;

    // If the changed option was the correctAnswer, keep it synced
    let newCorrect = q.correctAnswer;
    if (q.correctAnswer === prevOptionValue) {
      newCorrect = value;
    }

    handleUpdateQuestion(qIndex, { options: newOptions, correctAnswer: newCorrect });
  };

  const handleAddOption = (qIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length >= 5) return;
    const newOptions = [...q.options, `Pilihan ${String.fromCharCode(65 + q.options.length)}`];
    handleUpdateQuestion(qIndex, { options: newOptions });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length <= 2) return;
    const removedValue = q.options[optIndex];
    const newOptions = q.options.filter((_, i) => i !== optIndex);
    
    // If the removed option was the correctAnswer, reset to first available option
    let newCorrect = q.correctAnswer;
    if (newCorrect === removedValue) {
      newCorrect = newOptions[0] || '';
    }

    handleUpdateQuestion(qIndex, { options: newOptions, correctAnswer: newCorrect });
  };

  // Validation
  const validateGame = (): boolean => {
    if (!title.trim()) {
      setValidationError('Nama permainan tidak boleh kosong.');
      return false;
    }
    if (!topic.trim()) {
      setValidationError('Materi pembelajaran tidak boleh kosong.');
      return false;
    }
    if (questions.length === 0) {
      setValidationError('Game harus memiliki minimal 1 soal.');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt.trim()) {
        setValidationError(`Soal nomor ${i + 1} belum memiliki teks pertanyaan.`);
        return false;
      }
      if (gameType !== 'pasangkan-aku') {
        if (!q.options || q.options.length < 2) {
          setValidationError(`Soal nomor ${i + 1} harus memiliki minimal 2 opsi jawaban.`);
          return false;
        }
        if (q.options.some((opt) => !opt.trim())) {
          setValidationError(`Soal nomor ${i + 1} memiliki opsi jawaban yang masih kosong.`);
          return false;
        }
        if (!q.correctAnswer.trim()) {
          setValidationError(`Soal nomor ${i + 1} belum ditentukan kunci jawabannya.`);
          return false;
        }
      }
    }

    setValidationError(null);
    return true;
  };

  const buildGameObject = (): Game => {
    return {
      id: existingGame?.id || 'game-' + Date.now(),
      title: title.trim(),
      grade,
      subject,
      topic: topic.trim(),
      learningGoal: learningGoal.trim() || `Siswa memahami konsep ${topic}`,
      gameType,
      difficulty,
      timePerQuestionSec,
      questions,
      createdAt: existingGame?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSave = () => {
    if (!validateGame()) return;
    const game = buildGameObject();
    onSaveGame(game);
    setSaveSuccessMessage('Game berhasil disimpan! Anda dapat memainkannya kapan saja.');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handlePlayNow = () => {
    if (!validateGame()) return;
    const game = buildGameObject();
    onSaveGame(game);
    onPlayGameDirectly(game);
  };

  // Smart Curriculum Auto-Generator for Teachers (AI Assistant / Template Generator)
  const handleGenerateQuestionsDraft = () => {
    // Generate high quality draft questions tailored to selected Subject, Grade, and Topic
    let generatedQuestions: Question[] = [];

    if (subject === 'Muatan Lokal Banyuasin') {
      generatedQuestions = [
        {
          id: 'q-gen-1',
          prompt: 'Ikan patin hidup di perairan tawar seperti sungai di daerah kita. Apa warna daging ikan patin?',
          visualHint: '🐟',
          options: ['Putih bersih dan lembut', 'Hitam pekat', 'Hijau tua'],
          correctAnswer: 'Putih bersih dan lembut',
          feedbackCorrect: 'Tepat sekali! Daging ikan patin berwarna putih, lembut, dan kaya omega-3 🐟',
          feedbackIncorrect: 'Perhatikan daging ikan patin yang sudah matang dimasak.',
        },
        {
          id: 'q-gen-2',
          prompt: 'Di manakah petani di Rantau Bayur menanam tanaman padi?',
          visualHint: '🌾 🚜',
          options: ['Di sawah', 'Di puncak gunung es', 'Di dalam gua'],
          correctAnswer: 'Di sawah',
          feedbackCorrect: 'Hebat! Sawah yang subur membentang di bumi Banyuasin 🌾',
          feedbackIncorrect: 'Tanaman padi membutuhkan air dan tanah lumpur sawah.',
        },
        {
          id: 'q-gen-3',
          prompt: 'Kendaraan air tradisional bermesin yang sering digunakan warga melintasi Sungai Musi adalah...',
          visualHint: '🚣',
          options: ['Perahu Ketek', 'Pesawat Udara', 'Mobil Truk'],
          correctAnswer: 'Perahu Ketek',
          feedbackCorrect: 'Pintar! Perahu ketek adalah angkutan khas sungai kito 🚣',
          feedbackIncorrect: 'Kendaraan ini berjalan di permukaan air sungai.',
        },
      ];
    } else if (subject === 'Matematika') {
      generatedQuestions = [
        {
          id: 'q-gen-4',
          prompt: 'Berapakah jumlah apel berikut?\n🍎 🍎 🍎 🍎',
          visualHint: '🍎 🍎 🍎 🍎',
          options: ['4', '3', '5'],
          correctAnswer: '4',
          targetCount: 4,
          feedbackCorrect: 'Hebat! Ada 4 buah apel manis 🍎',
          feedbackIncorrect: 'Ayo hitung pelan-pelan: 1, 2, 3, 4!',
        },
        {
          id: 'q-gen-5',
          prompt: 'Bandingkan: 5 pensil ... 2 pensil',
          visualHint: '✏️ 5 vs 2',
          options: ['Lebih banyak', 'Lebih sedikit', 'Sama banyak'],
          correctAnswer: 'Lebih banyak',
          feedbackCorrect: 'Tepat sekali! 5 lebih banyak daripada 2.',
          feedbackIncorrect: 'Lima jumlahnya lebih besar dibandingkan dua.',
        },
      ];
    } else {
      generatedQuestions = [
        {
          id: 'q-gen-6',
          prompt: 'Suku kata awal dari kata "BUKU" adalah...',
          visualHint: '📖',
          options: ['bu', 'ba', 'bi'],
          correctAnswer: 'bu',
          feedbackCorrect: 'Pintar! BU-ku diawali suku kata bu 📖',
          feedbackIncorrect: 'Dengarkan bunyi suku kata pertama: BU-ku.',
        },
        {
          id: 'q-gen-7',
          prompt: 'Huruf vokal pada kata "SITI" adalah...',
          visualHint: '👧',
          options: ['I', 'S', 'T'],
          correctAnswer: 'I',
          feedbackCorrect: 'Benar sekali! Huruf vokalnya adalah I.',
          feedbackIncorrect: 'Huruf vokal adalah a, i, u, e, o.',
        },
      ];
    }

    if (!title) {
      setTitle(`Latihan ${subject} - ${grade}`);
    }
    if (!topic) {
      setTopic(`Pengenalan Konsep Dasar ${subject}`);
    }
    setQuestions(generatedQuestions);
    setSaveSuccessMessage('Draf soal kurikulum otomatis berhasil dimuat! Guru dapat mengedit sesuai kebutuhan.');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editor Pembuat Game Edukasi</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl">
            Game Maker CERIA CLASS
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Rancang kuis dan permainan edukatif interaktif sesuai capaian kurikulum kelas 1-3 SD SDN 32 Rantau Bayur.
          </p>
        </div>

        {/* Quick Draf Generator */}
        <button
          type="button"
          onClick={handleGenerateQuestionsDraft}
          className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Bantu Buat Draf Soal</span>
        </button>
      </div>

      {/* Validation or Success Alerts */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Form Section 1: Informasi Permainan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs space-y-6">
        <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
          <span>1. Informasi Permainan & Capaian Pembelajaran</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-black text-slate-700 uppercase">Nama Permainan *</label>
            <input
              type="text"
              placeholder="Contoh: Kuis Ceria Mengenal Hewan Sungai Musi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 font-bold text-sm text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Kelas Sasaran</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 bg-white"
            >
              <option value="Kelas 1">Kelas 1 SD</option>
              <option value="Kelas 2">Kelas 2 SD</option>
              <option value="Kelas 3">Kelas 3 SD</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 bg-white"
            >
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Matematika">Matematika</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="Muatan Lokal Banyuasin">Muatan Lokal Banyuasin</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Materi Pokok *</label>
            <input
              type="text"
              placeholder="Contoh: Suku Kata ma, mi, mu atau Lambang Bilangan"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Tujuan Pembelajaran</label>
            <input
              type="text"
              placeholder="Contoh: Siswa dapat membaca kata dua suku kata dengan benar"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Jenis Permainan Mini Game</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as GameType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 bg-white"
            >
              <option value="kuis-kilat">Kuis Kilat (Pilihan Ganda Cepat)</option>
              <option value="pasangkan-aku">Pasangkan Aku (Mencocokkan Kartu)</option>
              <option value="petualangan-misi">Petualangan Misi (Pos Bertahap)</option>
              <option value="detektif-literasi">Detektif Literasi (Susun Huruf/Kata)</option>
              <option value="detektif-numerasi">Detektif Numerasi (Hitung & Geometri)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase">Tingkat Diferensiasi Awal</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 bg-white"
            >
              <option value="mulai-belajar">Mulai Belajar (Huruf, Angka, Visual)</option>
              <option value="sedang-berkembang">Sedang Berkembang (Suku Kata, Dasar)</option>
              <option value="tantangan">Tantangan (Kalimat & Soal Cerita)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Form Section 2: Editor Soal & Pertanyaan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
              2. Daftar Soal & Kunci Jawaban ({questions.length} Soal)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Pastikan setiap soal memiliki satu kunci jawaban yang benar dan umpan balik ramah.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>
        </div>

        {/* Questions Cards */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={q.id || qIndex}
              className="bg-amber-50/40 rounded-2xl p-5 sm:p-6 border-2 border-amber-200/70 space-y-4"
            >
              
              {/* Question Card Toolbar */}
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <span className="font-display font-black text-base text-amber-950">
                  Nomor {qIndex + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveQuestion(qIndex, 'up')}
                    disabled={qIndex === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white disabled:opacity-30"
                    title="Pindah ke Atas"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveQuestion(qIndex, 'down')}
                    disabled={qIndex === questions.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white disabled:opacity-30"
                    title="Pindah ke Bawah"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pertanyaan Soal *</label>
                <input
                  type="text"
                  placeholder="Ketik pertanyaan untuk siswa..."
                  value={q.prompt}
                  onChange={(e) => handleUpdateQuestion(qIndex, { prompt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 bg-white"
                />
              </div>

              {/* Visual Hint / Emoji */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Ilustrasi / Emoji / Petunjuk Visual (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 🐟 🐟 🐟 atau 🌾 atau 🍎"
                  value={q.visualHint || ''}
                  onChange={(e) => handleUpdateQuestion(qIndex, { visualHint: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 bg-white"
                />
              </div>

              {/* Opsi Jawaban & Kunci */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 uppercase">
                    Pilihan Jawaban (Pilih Lingkaran untuk Kunci Jawaban yang Benar):
                  </label>
                  {q.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIndex)}
                      className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Opsi</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isCorrect = q.correctAnswer.trim().toLowerCase() === opt.trim().toLowerCase() && opt.trim() !== '';

                    return (
                      <div key={optIndex} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(qIndex, { correctAnswer: opt })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                          title="Tandai sebagai kunci jawaban yang benar"
                        >
                          {isCorrect && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                          className={`flex-1 px-3.5 py-2 rounded-xl border text-sm font-bold bg-white ${
                            isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300'
                          }`}
                        />

                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(qIndex, optIndex)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Hapus Opsi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Umpan Balik Ramah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800">Umpan Balik Benar</label>
                  <input
                    type="text"
                    value={q.feedbackCorrect || ''}
                    placeholder="Hebat! Jawabanmu tepat sekali!"
                    onChange={(e) => handleUpdateQuestion(qIndex, { feedbackCorrect: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-800">Umpan Balik Coba Lagi</label>
                  <input
                    type="text"
                    value={q.feedbackIncorrect || ''}
                    placeholder="Ayo coba lagi, kamu pasti bisa!"
                    onChange={(e) => handleUpdateQuestion(qIndex, { feedbackIncorrect: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950 bg-white"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-amber-200 shadow-sm sticky bottom-4 z-40">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          Batal
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              if (validateGame()) setPreviewModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-sm border border-sky-200 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Game</span>
          </button>

          <button
            type="button"
            onClick={handlePlayNow}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-200"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Simpan & Mainkan!</span>
          </button>
        </div>
      </div>

      {/* Pratinjau Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-amber-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">Pratinjau Game</span>
                <h3 className="font-display font-extrabold text-xl text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500">{grade} · {subject} · {questions.length} Soal</p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 pr-1 text-sm">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                  <div className="font-black text-slate-900">
                    {idx + 1}. {q.prompt}
                  </div>
                  {q.visualHint && <div className="text-2xl text-center">{q.visualHint}</div>}
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl border ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt} {opt === q.correctAnswer ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPreviewModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
