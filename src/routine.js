// Rutina del mes. Cada día tiene bloques (grupo muscular, superserie, serie gigante…)
// y cada bloque sus ejercicios.
//   sets:     filas de series que aparecen por defecto (se pueden añadir/quitar)
//   target:   reps / indicaciones
//   rest:     descanso en segundos (lo usa el temporizador); restText lo detalla
//   weeks:    variaciones por semana del ciclo (1-4) que sustituyen target/rest/sets
//   unit:     'kg' por defecto; 'kg/lado' cuando se apunta el peso de un lado
//   noWeight: ejercicio con peso corporal (solo reps)
//   from:     en series gigantes/triseries, pasada en la que entra el ejercicio
// Un día puede llevar `note` (indicaciones generales) y un bloque `note`/`restText`.

export const GROUPS = {
  pecho: { label: 'Pectoral', color: '#ff7a59' },
  abdomen: { label: 'Abdomen', color: '#f2b233' },
  cuadriceps: { label: 'Cuádriceps', color: '#8b6cf6' },
  femoral: { label: 'Femoral', color: '#b05ce8' },
  brazo: { label: 'Bíceps y tríceps', color: '#3b82f6' },
  gemelo: { label: 'Gemelo', color: '#14b8a6' },
  dorsal: { label: 'Dorsal', color: '#5b6cf0' },
  gluteo: { label: 'Glúteo', color: '#ec4899' },
  hombro: { label: 'Hombro', color: '#f97316' },
  pierna: { label: 'Pierna', color: '#8b6cf6' },
  espalda: { label: 'Espalda', color: '#5b6cf0' },
  triceps: { label: 'Tríceps', color: '#0ea5e9' },
  biceps: { label: 'Bíceps', color: '#3b82f6' },
  core: { label: 'Abdomen y lumbar', color: '#f2b233' },
};

export const BLOCK_KINDS = {
  normal: null,
  superset: 'Superserie',
  triset: 'Triserie',
  giant: 'Serie gigante',
};

// La rutina y la dieta de cada persona están en src/profiles/<perfil>/ (alias @profile).
import * as profileRoutine from '@profile/routine';

export const DEFAULT_ROUTINE = profileRoutine.ROUTINE;
export const REST_DAY_NOTE = profileRoutine.REST_DAY_NOTE;
// Opcional: sesión de cardio fija ({ title, note, steps }).
export const CARDIO = profileRoutine.CARDIO ?? null;

// Lo que toca hacer en un ejercicio una semana concreta del ciclo.
export function resolveExercise(ex, block, week) {
  const w = ex.weeks?.[week] ?? {};
  return {
    ...ex,
    group: ex.group ?? block.group,
    target: w.target ?? ex.target ?? '',
    sets: w.sets ?? ex.sets ?? 3,
    rest: w.rest ?? ex.rest ?? block.rest ?? 60,
    restText: w.restText ?? ex.restText ?? block.restText,
  };
}

export function allExercises(routine) {
  const out = [];
  for (const day of routine.days)
    for (const block of day.blocks)
      for (const ex of block.exercises) out.push({ ...ex, group: ex.group ?? block.group, day });
  return out;
}

export const dayHasWeeks = (day) => day.blocks.some((b) => b.exercises.some((e) => e.weeks));
