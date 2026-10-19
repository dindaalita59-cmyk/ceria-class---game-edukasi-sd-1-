/**
 * CERIA CLASS - LocalStorage, Backup & CSV Export Utility
 * Safe storage management, schema validation, CSV RFC-4180 escaping
 */

import { Game, GameSessionResult, Student, AppSettings } from '../types';

const STORAGE_KEYS = {
  GAMES: 'ceria_games_v1',
  STUDENTS: 'ceria_students_v1',
  RESULTS: 'ceria_results_v1',
  SETTINGS: 'ceria_settings_v1',
};

export const defaultSettings: AppSettings = {
  projectorMode: false,
  soundEnabled: true,
  voiceEnabled: true,
  teacherName: 'Dinda Noer Alita, S.Pd.',
};

/**
 * Safe LocalStorage Get
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Gagal membaca localStorage [${key}]:`, e);
    return fallback;
  }
}

/**
 * Safe LocalStorage Set
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Gagal menyimpan ke localStorage [${key}]. Penyimpanan mungkin penuh:`, e);
    return false;
  }
}

// Helpers for specific collections
export function loadSavedGames(fallback: Game[]): Game[] {
  const data = getStorageItem<Game[]>(STORAGE_KEYS.GAMES, []);
  return data && data.length > 0 ? data : fallback;
}

export function saveGames(games: Game[]): boolean {
  return setStorageItem(STORAGE_KEYS.GAMES, games);
}

export function loadSavedStudents(fallback: Student[]): Student[] {
  const data = getStorageItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
  return data && data.length > 0 ? data : fallback;
}

export function saveStudents(students: Student[]): boolean {
  return setStorageItem(STORAGE_KEYS.STUDENTS, students);
}

export function loadSessionResults(): GameSessionResult[] {
  return getStorageItem<GameSessionResult[]>(STORAGE_KEYS.RESULTS, []);
}

export function saveSessionResult(result: GameSessionResult): boolean {
  const current = loadSessionResults();
  const updated = [result, ...current];
  return setStorageItem(STORAGE_KEYS.RESULTS, updated);
}

export function clearSessionResults(): boolean {
  return setStorageItem(STORAGE_KEYS.RESULTS, []);
}

export function loadAppSettings(): AppSettings {
  return getStorageItem<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
}

export function saveAppSettings(settings: AppSettings): boolean {
  return setStorageItem(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * RFC 4180 CSV cell escaper
 */
function escapeCsvCell(value: string | number | boolean | undefined | null): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Export results to genuine downloadable CSV file
 */
export function exportResultsToCsv(results: GameSessionResult[]): void {
  const headers = [
    'No',
    'Tanggal & Waktu',
    'Nama Siswa / Kelompok',
    'Mode Permainan',
    'Judul Game',
    'Mata Pelajaran',
    'Materi',
    'Tingkat Kesulitan',
    'Tipe Game',
    'Total Soal',
    'Jumlah Benar',
    'Jumlah Salah',
    'Skor (%)',
    'Bintang Diraih',
    'Durasi (Detik)',
    'Catatan Formatif',
  ];

  const rows = results.map((r, index) => {
    const dateFormatted = new Date(r.completedAt).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const formativeNote = r.scorePercent >= 80 
      ? 'Capaian Sangat Baik. Siap materi lanjutan.'
      : r.scorePercent >= 60 
      ? 'Berkembang Sesuai Harapan. Terus berlatih.'
      : 'Perlu Pendampingan Tambahan pada materi ini.';

    return [
      escapeCsvCell(index + 1),
      escapeCsvCell(dateFormatted),
      escapeCsvCell(r.playerName),
      escapeCsvCell(r.isGroupMode ? 'Kelompok' : 'Individu'),
      escapeCsvCell(r.gameTitle),
      escapeCsvCell(r.subject),
      escapeCsvCell(r.topic),
      escapeCsvCell(r.difficulty),
      escapeCsvCell(r.gameType),
      escapeCsvCell(r.totalQuestions),
      escapeCsvCell(r.correctCount),
      escapeCsvCell(r.wrongCount),
      escapeCsvCell(r.scorePercent),
      escapeCsvCell(r.starsEarned),
      escapeCsvCell(r.durationSeconds),
      escapeCsvCell(formativeNote),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ceria_class_laporan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export full JSON backup
 */
export function exportBackupJson(games: Game[], students: Student[], results: GameSessionResult[]): void {
  const backupData = {
    app: 'CERIA CLASS',
    version: '1.0.0',
    institution: 'SDN 32 Rantau Bayur',
    developer: 'Dinda Noer Alita, S.Pd.',
    exportedAt: new Date().toISOString(),
    games,
    students,
    results,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `ceria_class_cadangan_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate and import JSON backup
 */
export interface ImportResult {
  success: boolean;
  message: string;
  importedGames?: Game[];
  importedStudents?: Student[];
  importedResults?: GameSessionResult[];
}

export function validateAndParseBackup(jsonText: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Format file tidak valid. Pastikan file berformat JSON cadangan CERIA CLASS.' };
    }

    if (!Array.isArray(parsed.games) && !Array.isArray(parsed.students) && !Array.isArray(parsed.results)) {
      return { success: false, message: 'Struktur data cadangan tidak memiliki daftar game, siswa, atau riwayat hasil belajar.' };
    }

    return {
      success: true,
      message: 'File cadangan valid dan siap dipulihkan.',
      importedGames: Array.isArray(parsed.games) ? parsed.games : undefined,
      importedStudents: Array.isArray(parsed.students) ? parsed.students : undefined,
      importedResults: Array.isArray(parsed.results) ? parsed.results : undefined,
    };
  } catch {
    return { success: false, message: 'Gagal membaca berkas JSON. Berkas mungkin rusak atau tidak sesuai format.' };
  }
}
