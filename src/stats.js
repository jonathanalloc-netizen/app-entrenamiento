import { e1rm, mondayOf, num } from './utils';

const byDateDesc = (a, b) => (b.date === a.date ? b.startedAt - a.startedAt : b.date < a.date ? -1 : 1);

// Series con algún dato apuntado.
export function filledSets(session, exId) {
  return (session.sets?.[exId] ?? [])
    .map((s) => ({ w: num(s.w), r: num(s.r) }))
    .filter((s) => s.w != null || s.r != null);
}

export const sessionHasData = (session) => Object.keys(session.sets ?? {}).some((id) => filledSets(session, id).length);

// Última vez que se hizo el ejercicio (para sugerir pesos).
export function lastPerformance(sessions, exId, excludeId) {
  const prev = [...sessions].sort(byDateDesc).find((s) => s.id !== excludeId && filledSets(s, exId).length);
  return prev ? { session: prev, rows: prev.sets[exId] } : null;
}

export function summarize(sets) {
  let maxW = null, volume = 0, reps = 0, best = null;
  for (const { w, r } of sets) {
    if (w != null) maxW = Math.max(maxW ?? 0, w);
    if (r != null) reps += r;
    if (w != null && r != null) {
      volume += w * r;
      best = Math.max(best ?? 0, e1rm(w, r));
    }
  }
  return { maxW, volume, reps, e1rm: best, count: sets.length };
}

// Progresión semanal de un ejercicio: una entrada por semana (lunes).
export function weeklyExercise(sessions, exId) {
  const weeks = new Map();
  for (const s of sessions) {
    const sets = filledSets(s, exId);
    if (!sets.length) continue;
    const key = mondayOf(s.date);
    const w = weeks.get(key) ?? { week: key, sets: [], sessions: [] };
    w.sets.push(...sets);
    w.sessions.push(s);
    weeks.set(key, w);
  }
  return [...weeks.values()]
    .map((w) => ({ week: w.week, sessions: w.sessions, ...summarize(w.sets) }))
    .sort((a, b) => (a.week < b.week ? -1 : 1));
}

export function sessionVolume(session) {
  let v = 0, sets = 0;
  for (const id of Object.keys(session.sets ?? {})) {
    const s = summarize(filledSets(session, id));
    v += s.volume;
    sets += s.count;
  }
  return { volume: v, sets };
}

export function weekTotals(sessions, monday) {
  const list = sessions.filter((s) => mondayOf(s.date) === monday && sessionHasData(s));
  return {
    sessions: list,
    volume: list.reduce((a, s) => a + sessionVolume(s).volume, 0),
    days: new Set(list.map((s) => s.date)),
  };
}

export const sortedSessions = (sessions) => [...sessions].sort(byDateDesc);
