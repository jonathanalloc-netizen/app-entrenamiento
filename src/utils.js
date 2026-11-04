export const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36);

// Fechas como 'YYYY-MM-DD' en hora local.
export function toISO(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
export function fromISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export const todayISO = () => toISO(new Date());
export function addDays(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function mondayOf(iso) {
  const d = fromISO(iso);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return toISO(d);
}
export const daysBetween = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 86400000);

// Semana del ciclo (1..n) según el lunes en que empezó.
export function cycleWeek(start, iso = todayISO(), weeks = 4) {
  const w = Math.floor(daysBetween(mondayOf(start), mondayOf(iso)) / 7);
  return (((w % weeks) + weeks) % weeks) + 1;
}

export function num(v) {
  if (v === '' || v == null) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export const fmtNum = (n, digits = 1) =>
  n == null ? '–' : n.toLocaleString('es-ES', { maximumFractionDigits: digits });

export function fmtVolume(n) {
  if (!n) return '0 kg';
  if (n >= 10000) return `${fmtNum(n / 1000, 1)} t`;
  return `${fmtNum(n, 0)} kg`;
}

const dfShort = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const dfLong = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const dfMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
export const fmtShort = (iso) => dfShort.format(fromISO(iso)).replace('.', '');
export const fmtLong = (iso) => dfLong.format(fromISO(iso));
export const fmtMonth = (iso) => dfMonth.format(fromISO(iso));

export function fmtRest(sec) {
  if (!sec) return 'Sin descanso';
  if (sec < 60) return `${sec}″`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}′${s}″` : `${m}′`;
}

export function fmtClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function fmtDuration(ms) {
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;
}

// 1RM estimado (Epley).
export const e1rm = (w, r) => (r <= 1 ? w : w * (1 + r / 30));
