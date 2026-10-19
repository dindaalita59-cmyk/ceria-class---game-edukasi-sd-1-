/**
 * CERIA CLASS - Sound & Speech Synthesizer
 * Uses Web Audio API & Speech Synthesis for 100% offline, zero-asset audio
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play cheerful positive sound for correct answer
 */
export function playCorrectSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Arpeggio C5 -> E5 -> G5 -> C6
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    osc.frequency.setValueAtTime(783.99, now + 0.16);
    osc.frequency.setValueAtTime(1046.50, now + 0.24);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    // Ignore audio error gracefully
  }
}

/**
 * Play gentle, warm encouraging tone for try-again (non-punitive)
 */
export function playTryAgainSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Soft gentle step G4 -> E4 (warm, friendly)
    osc.frequency.setValueAtTime(392.00, now);
    osc.frequency.setValueAtTime(329.63, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Ignore audio error gracefully
  }
}

/**
 * Play victory fanfare when finishing a game
 */
export function playFanfareSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.14 },
      { f: 1046.50, t: 0.38, d: 0.4 },
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + note.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + note.d);
    });
  } catch {
    // Ignore audio error gracefully
  }
}

/**
 * Text-to-speech in Indonesian for early elementary readers (Kelas 1-3)
 */
export function speakIndonesian(text: string, enabled = true) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9; // Slightly slower for primary kids
    utterance.pitch = 1.1; // Friendly tone

    // Try finding Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id') || v.name.includes('Indonesian'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis error handled gracefully
  }
}
