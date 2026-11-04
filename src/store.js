import { useSyncExternalStore } from 'react';
import { DEFAULT_ROUTINE } from './routine';
import { mondayOf, todayISO, uid } from './utils';

// Todo se guarda en el propio móvil (localStorage).
const KEY = 'entreno:v1';

const initial = () => ({
  version: 1,
  sessions: [],
  settings: { cycleStart: mondayOf(todayISO()) },
  // Por fecha: { type: 'pesas' | 'descanso', eaten: { c1: true }, option: { c1: 1 }, supplements: { creatina: true } }
  nutrition: {},
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...initial(), ...saved, settings: { ...initial().settings, ...saved.settings } };
    }
  } catch {
    // datos corruptos o almacenamiento bloqueado: se empieza de cero
  }
  return initial();
}

let state = load();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sin espacio o modo privado: los datos siguen en memoria
  }
  listeners.forEach((l) => l());
}

function update(fn) {
  const draft = structuredClone(state);
  fn(draft);
  commit(draft);
}

export function useAppState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export const getRoutine = (s = state) => s.routine ?? DEFAULT_ROUTINE;

const emptySet = () => ({ w: '', r: '', done: false });

// Reutiliza un entreno sin terminar del mismo día si existe.
export function startSession(dayId, week) {
  const open = state.sessions.find((s) => s.dayId === dayId && !s.finishedAt && s.date === todayISO());
  if (open) return open.id;
  const id = uid();
  update((d) => {
    d.sessions.push({ id, dayId, week, date: todayISO(), startedAt: Date.now(), finishedAt: null, sets: {}, note: '' });
  });
  return id;
}

function withRows(session, exId, count) {
  session.sets[exId] ??= Array.from({ length: count }, emptySet);
  return session.sets[exId];
}

export function updateSet(sessionId, exId, count, idx, patch) {
  update((d) => {
    const s = d.sessions.find((x) => x.id === sessionId);
    const rows = withRows(s, exId, count);
    rows[idx] = { ...rows[idx], ...patch };
  });
}

export function addSet(sessionId, exId, count) {
  update((d) => {
    const s = d.sessions.find((x) => x.id === sessionId);
    withRows(s, exId, count).push(emptySet());
  });
}

export function removeSet(sessionId, exId, count) {
  update((d) => {
    const s = d.sessions.find((x) => x.id === sessionId);
    const rows = withRows(s, exId, count);
    if (rows.length > 1) rows.pop();
  });
}

export function updateSession(id, patch) {
  update((d) => {
    Object.assign(d.sessions.find((x) => x.id === id), patch);
  });
}

export function deleteSession(id) {
  update((d) => {
    d.sessions = d.sessions.filter((x) => x.id !== id);
  });
}

export function setSettings(patch) {
  update((d) => {
    Object.assign(d.settings, patch);
  });
}

// Pesas o descanso: lo que se eligió ese día; si no, pesas si ese día hay entreno.
export function dayType(s, date) {
  const chosen = s.nutrition?.[date]?.type;
  if (chosen) return chosen;
  return s.sessions.some((x) => x.date === date) ? 'pesas' : null;
}

function updateDay(date, fn) {
  update((d) => {
    d.nutrition ??= {};
    d.nutrition[date] ??= {};
    fn(d.nutrition[date]);
  });
}

export const setDayType = (date, type) => updateDay(date, (n) => (n.type = type));

export const toggleMeal = (date, mealId) =>
  updateDay(date, (n) => {
    n.eaten ??= {};
    n.eaten[mealId] = !n.eaten[mealId];
  });

export const setMealOption = (date, mealId, idx) =>
  updateDay(date, (n) => {
    n.option ??= {};
    n.option[mealId] = idx;
  });

export const toggleSupplement = (date, id) =>
  updateDay(date, (n) => {
    n.supplements ??= {};
    n.supplements[id] = !n.supplements[id];
  });

export function exportData() {
  return JSON.stringify({ app: 'entreno', exportedAt: new Date().toISOString(), ...state }, null, 2);
}

export function importData(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data.sessions)) throw new Error('El archivo no es una copia de Entreno.');
  const { app, exportedAt, ...rest } = data;
  commit({ ...initial(), ...rest, settings: { ...initial().settings, ...rest.settings } });
}

export function resetAll() {
  commit(initial());
}
