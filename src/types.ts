/**
 * CERIA CLASS - Types & Data Models
 * Cerdas, Interaktif, dan Asyik Belajar
 * SDN 32 Rantau Bayur - Dinda Noer Alita, S.Pd.
 */

export type NavigationTab = 
  | 'dashboard' 
  | 'play' 
  | 'game-maker' 
  | 'students' 
  | 'bank-materi' 
  | 'reports' 
  | 'about';

export type GameType = 
  | 'kuis-kilat' 
  | 'pasangkan-aku' 
  | 'petualangan-misi' 
  | 'detektif-literasi' 
  | 'detektif-numerasi';

export type DifficultyLevel = 
  | 'mulai-belajar'      // Tingkat 1: Huruf, angka, visual, petunjuk eksplisit
  | 'sedang-berkembang'  // Tingkat 2: Suku kata, kata sederhana, hitungan dasar
  | 'tantangan';        // Tingkat 3: Kalimat sederhana, soal cerita ringan

export type Subject = 
  | 'Bahasa Indonesia' 
  | 'Matematika' 
  | 'Pendidikan Pancasila' 
  | 'Muatan Lokal Banyuasin';

export type GradeLevel = 'Kelas 1' | 'Kelas 2' | 'Kelas 3';

export interface PairMatchItem {
  id: string;
  left: string;
  leftHint?: string;
  right: string;
  rightHint?: string;
}

export interface Question {
  id: string;
  prompt: string;
  visualHint?: string; // Emoji, simbol, atau ilustrasi teks (misal: 🐟 🐟 🐟, 🌾 🌾, 🔺)
  options: string[];   // Opsi jawaban untuk pilihan ganda
  correctAnswer: string;
  hint?: string;       // Bantuan ramah untuk siswa yang membutuhkan
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  // Khusus Pasangkan Aku
  pairs?: PairMatchItem[];
  // Khusus Detektif Literasi (susun huruf)
  letterTiles?: string[];
  // Khusus Detektif Numerasi
  targetCount?: number;
  geometricShape?: 'lingkaran' | 'segitiga' | 'persegi' | 'persegi-panjang';
}

export interface Game {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  learningGoal: string;
  gameType: GameType;
  difficulty: DifficultyLevel;
  timePerQuestionSec?: number; // 0 = tanpa batas waktu
  questions: Question[];
  isDemo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: GradeLevel;
  groupName?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface GameSessionResult {
  id: string;
  gameId: string;
  gameTitle: string;
  subject: Subject;
  topic: string;
  gameType: GameType;
  difficulty: DifficultyLevel;
  playerName: string;
  isGroupMode: boolean;
  groupNames?: string[];
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercent: number;
  starsEarned: number; // 1, 2, atau 3
  durationSeconds: number;
  completedAt: string;
  missedTopicsSummary?: string[];
}

export interface MaterialItem {
  id: string;
  subject: Subject;
  grade: GradeLevel;
  topic: string;
  subtopic: string;
  description: string;
  visualExample: string;
  keyConcepts: string[];
  difficulty: DifficultyLevel;
  sampleQuestions: Question[];
}

export interface AppSettings {
  projectorMode: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  teacherName: string;
}
