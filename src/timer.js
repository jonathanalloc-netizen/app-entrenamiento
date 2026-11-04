import { useSyncExternalStore } from 'react';

// Temporizador de descanso global: sobrevive a cambios de pantalla.
let timer = null; // { endAt, total, label }
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export function startTimer(seconds, label = '') {
  if (!seconds) return;
  timer = { endAt: Date.now() + seconds * 1000, total: seconds, label };
  emit();
}

export function addTime(seconds) {
  if (!timer) return;
  timer = { ...timer, endAt: timer.endAt + seconds * 1000, total: Math.max(1, timer.total + seconds) };
  emit();
}

export function stopTimer() {
  timer = null;
  emit();
}

export function useTimer() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => timer,
  );
}

let audio;
export function alarm() {
  navigator.vibrate?.([250, 120, 250, 120, 400]);
  try {
    audio ??= new AudioContext();
    [0, 0.25, 0.5].forEach((t) => {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, audio.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + t + 0.18);
      o.connect(g).connect(audio.destination);
      o.start(audio.currentTime + t);
      o.stop(audio.currentTime + t + 0.2);
    });
  } catch {
    // sin audio disponible
  }
}
