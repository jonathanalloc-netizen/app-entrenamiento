// Rutina de entrenamiento de Lucía. Formato de los campos en src/routine.js.

export const REST_DAY_NOTE = 'Sal a andar 45 min (en ayunas o no) todos los días menos los 2 de cardio específico.';

// Semana a semana: [series, objetivo] para las semanas 1-4.
const wk = (...rows) => Object.fromEntries(rows.map(([sets, target], i) => [i + 1, { sets, target }]));
const same = (sets, target) => wk([sets, target], [sets, target], [sets, target], [sets, target]);
// Fuerza: 4×10, 4×8, 4×6 y 7×5.
const heavy = () => wk([4, '10 reps'], [4, '8 reps'], [4, '6 reps'], [7, '5 reps']);

const WARMUP = 'Calienta con 3×6 en el primer ejercicio y haz una serie de aproximación en el resto, con las mismas repeticiones. Las reps bajan cada semana: usa cada vez cargas mayores.';

export const CARDIO = {
  title: 'Cardio · HIIT en bici (32 min)',
  note: '2 días a la semana, entre los días de pesas.',
  steps: [
    '5 min subiendo la intensidad',
    '6 min: 20″ sprint / 40″ recuperación activa',
    '10 min al 70 %',
    '6 min: 20″ sprint / 40″ recuperación activa',
    '5 min bajando la intensidad',
  ],
};

export const ROUTINE = {
  id: 'lucia-rutina-1',
  name: 'Rutina 1',
  cycleWeeks: 4,
  days: [
    {
      id: 'd1',
      name: 'Día 1',
      title: 'Gym 1 · Pierna, pecho y hombro',
      groups: ['pierna', 'pecho', 'hombro', 'gemelo', 'core'],
      note: WARMUP,
      blocks: [
        {
          title: 'Pierna',
          group: 'pierna',
          exercises: [{ id: 'l-sentadilla-pesada', name: 'Sentadilla (pesada)', rest: 120, weeks: heavy() }],
        },
        {
          title: 'Pecho',
          group: 'pecho',
          exercises: [
            {
              id: 'l-press-banca',
              name: 'Press de banca',
              rest: 120,
              weeks: wk([4, '15 reps'], [4, '10 reps'], [4, '8 reps'], [4, '8 reps']),
            },
          ],
        },
        {
          title: 'Aperturas + fondos',
          kind: 'superset',
          group: 'pecho',
          rest: 90,
          exercises: [
            {
              id: 'l-aperturas-inclinadas',
              name: 'Aperturas inclinadas',
              weeks: wk([3, '12 reps'], [3, '12 reps'], [3, '10 reps'], [3, '8 reps']),
            },
            { id: 'l-fondos-triceps-cerrados', name: 'Fondos de tríceps cerrados', group: 'triceps', sets: 3, target: '15 reps' },
          ],
        },
        {
          title: 'Laterales + pájaros',
          kind: 'superset',
          group: 'hombro',
          rest: 90,
          exercises: [
            {
              id: 'l-elevaciones-laterales',
              name: 'Elevaciones laterales con mancuernas',
              weeks: wk([3, '15 reps'], [3, '12 reps'], [3, '12 reps'], [3, '10 reps']),
            },
            {
              id: 'l-pajaros-maquina',
              name: 'Pájaros en máquina',
              weeks: wk([3, '20 reps'], [3, '20 reps'], [3, '15 reps'], [3, '15 reps']),
            },
          ],
        },
        {
          title: 'Pierna',
          group: 'pierna',
          exercises: [
            {
              id: 'l-subida-banco',
              name: 'Subida a banco con peso y rodilla arriba',
              rest: 120,
              weeks: wk([4, '12 reps'], [4, '10 reps'], [4, '8 reps'], [4, '8 reps']),
            },
          ],
        },
        {
          title: 'Cuádriceps + isquio',
          kind: 'superset',
          group: 'pierna',
          rest: 90,
          exercises: [
            { id: 'l-cuadriceps-maquina', name: 'Cuádriceps en máquina', group: 'cuadriceps', sets: 4, target: '20 reps' },
            { id: 'l-isquio-tumbado', name: 'Isquio tumbado', group: 'femoral', sets: 4, target: '15 reps' },
          ],
        },
        {
          title: 'Gemelo',
          group: 'gemelo',
          exercises: [
            {
              id: 'l-talones-sentado',
              name: 'Elevación de talones sentado',
              sets: 5,
              target: '20 → 15 reps · sube el peso en las 2-3 primeras y mantén · fallo en las 3 últimas',
              rest: 60,
              notes: 'Lo más pesado que puedas, aguantando un instante arriba y estirando por completo abajo. Nada de acortar recorridos.',
            },
            {
              id: 'l-talones-pie',
              name: 'Elevación de talones de pie',
              sets: 4,
              target: '50 reps del tirón, a máxima velocidad',
              rest: 45,
              notes: 'Recorrido completo, sin parciales. Muy poco peso (o ninguno) y respeta los 45″: se busca congestión.',
            },
          ],
        },
        {
          title: 'Tabla + crunches',
          kind: 'superset',
          group: 'core',
          rest: 45,
          exercises: [
            { id: 'l-tabla', name: 'Tabla', sets: 4, target: '1 min', noWeight: true, notes: 'Apunta los segundos en "Reps".' },
            { id: 'l-crunches-declinados', name: 'Crunches declinados', sets: 4, target: '25 reps', noWeight: true },
          ],
        },
        {
          title: 'Lumbar',
          group: 'core',
          exercises: [{ id: 'l-hiperextensiones', name: 'Hiperextensiones con peso', sets: 4, target: '20 reps', rest: 60 }],
        },
      ],
    },
    {
      id: 'd2',
      name: 'Día 2',
      title: 'Gym 2 · Hombro, pierna y espalda',
      groups: ['hombro', 'pierna', 'espalda', 'core'],
      note: WARMUP,
      blocks: [
        {
          title: 'Hombro',
          group: 'hombro',
          exercises: [{ id: 'l-press-hombro', name: 'Press de hombro', rest: 120, weeks: heavy() }],
        },
        {
          title: 'Pierna',
          group: 'pierna',
          exercises: [
            {
              id: 'l-zancadas-andando',
              name: 'Zancadas andando',
              rest: 120,
              weeks: wk([3, '15 reps'], [4, '10 reps'], [4, '8 reps'], [4, '8 reps']),
            },
          ],
        },
        {
          title: 'Jalón + remo',
          kind: 'superset',
          group: 'espalda',
          rest: 90,
          exercises: [
            {
              id: 'l-jalon-pecho',
              name: 'Jalón al pecho',
              weeks: wk([3, '12 reps'], [3, '12 reps'], [3, '10 reps'], [3, '8 reps']),
            },
            { id: 'l-remo-punta', name: 'Remo en punta', sets: 3, target: '10 reps' },
          ],
        },
        {
          title: 'Pierna',
          group: 'pierna',
          exercises: [
            { id: 'l-thruster-barra', name: 'Thruster con barra', rest: 120, weeks: heavy() },
            {
              id: 'l-prensa',
              name: 'Prensa (pies a la anchura de los hombros)',
              sets: 4,
              target: 'Pirámide 16 / 14 / 12 / 10 reps · sube el peso en cada serie',
              rest: 120,
            },
          ],
        },
        {
          title: 'Frontales + remo al cuello + face pull',
          kind: 'triset',
          group: 'hombro',
          rest: 90,
          exercises: [
            { id: 'l-frontales-mancuerna', name: 'Elevaciones frontales con mancuerna', sets: 4, target: '20 reps' },
            { id: 'l-remo-cuello', name: 'Remo al cuello', sets: 4, target: '15 reps' },
            { id: 'l-face-pull', name: 'Face pull', sets: 4, target: '20 reps' },
          ],
        },
        {
          title: 'Abdomen',
          group: 'core',
          exercises: [{ id: 'l-rueda', name: 'Rueda abdominal', sets: 4, target: '10 reps', rest: 60, noWeight: true }],
        },
        {
          title: 'Tabla lateral + twist',
          kind: 'superset',
          group: 'core',
          rest: 60,
          exercises: [
            { id: 'l-tabla-lateral', name: 'Tabla lateral', sets: 4, target: '30″', noWeight: true, notes: 'Apunta los segundos en "Reps".' },
            { id: 'l-twist-peso', name: 'Twist con peso', sets: 4, target: '30 reps' },
          ],
        },
        {
          title: 'Lumbar',
          group: 'core',
          exercises: [
            { id: 'l-superman', name: 'Isométrico superman', sets: 4, target: '45″', rest: 60, noWeight: true, notes: 'Apunta los segundos en "Reps".' },
          ],
        },
      ],
    },
    {
      id: 'd3',
      name: 'Día 3',
      title: 'Gym 3 · Torso, pierna y gemelo',
      groups: ['pecho', 'espalda', 'pierna', 'gemelo'],
      note: WARMUP,
      blocks: [
        {
          title: 'Press + remo',
          kind: 'superset',
          group: 'pecho',
          rest: 120,
          exercises: [
            { id: 'l-press-mancuerna', name: 'Press con mancuerna', sets: 4, target: '12 reps' },
            { id: 'l-remo-una-mano', name: 'Remo a una mano', group: 'espalda', sets: 4, target: '12 reps' },
          ],
        },
        {
          title: 'Remo con barra + Gironda',
          kind: 'superset',
          group: 'espalda',
          rest: 120,
          exercises: [
            {
              id: 'l-remo-barra',
              name: 'Remo con barra',
              weeks: wk([3, '15 reps'], [3, '12 reps'], [3, '12 reps'], [3, '10 reps']),
            },
            {
              id: 'l-remo-gironda',
              name: 'Remo Gironda',
              weeks: wk([3, '20 reps'], [3, '20 reps'], [3, '15 reps'], [3, '15 reps']),
            },
          ],
        },
        {
          title: 'Pull over + goblet',
          kind: 'superset',
          group: 'espalda',
          rest: 60,
          exercises: [
            {
              id: 'l-pull-over',
              name: 'Pull over',
              weeks: wk([3, '12 reps'], [3, '12 reps'], [3, '10 reps'], [3, '8 reps']),
            },
            {
              id: 'l-sentadilla-goblet',
              name: 'Sentadilla goblet',
              group: 'pierna',
              weeks: wk([3, '12 reps'], [3, '10 reps'], [3, '8 reps'], [3, '6 reps']),
            },
          ],
        },
        {
          title: 'Cuádriceps + femoral',
          kind: 'superset',
          group: 'pierna',
          rest: 90,
          exercises: [
            {
              id: 'l-cuadriceps-maquina',
              name: 'Cuádriceps en máquina',
              group: 'cuadriceps',
              weeks: wk([3, '15 reps'], [3, '15 reps'], [3, '12 reps'], [3, '12 reps']),
            },
            {
              id: 'l-femoral-maquina',
              name: 'Femoral en máquina',
              group: 'femoral',
              weeks: wk([3, '15 reps'], [3, '15 reps'], [3, '12 reps'], [3, '12 reps']),
            },
          ],
        },
        {
          title: 'Búlgara + sumo',
          kind: 'superset',
          group: 'pierna',
          rest: 60,
          exercises: [
            {
              id: 'l-sentadilla-bulgara',
              name: 'Sentadilla búlgara',
              weeks: wk([4, '10 reps'], [4, '10 reps'], [5, '10 reps'], [5, '10 reps']),
            },
            {
              id: 'l-sentadilla-sumo',
              name: 'Sentadilla sumo con mancuerna',
              weeks: wk([4, '15 reps'], [4, '15 reps'], [5, '15 reps'], [5, '15 reps']),
            },
          ],
        },
        {
          title: 'Pecho',
          group: 'pecho',
          exercises: [
            { id: 'l-fondos-paralelas', name: 'Fondos de pecho en paralelas', sets: 3, target: 'Sin llegar al fallo', rest: 90 },
          ],
        },
        {
          title: 'Gemelo de pie + sentado',
          kind: 'superset',
          group: 'gemelo',
          rest: 45,
          restText: 'Mínimo entre ejercicios · 45-60″ entre superseries (30″ antes de la última)',
          note: 'Aproximación: 30 reps muy ligero → 25-30 más pesado → 25 reps con un peso que te permitiría 30-35. Efectivas: 20-25 (a 3-4 del fallo) → 60″ → 15-20 al fallo → 45″ → baja un 20 % y al fallo → 30″ → baja otro 20 % y al fallo.',
          exercises: [
            { id: 'l-gemelo-pie', name: 'Gemelo de pie', sets: 7, target: '3 de aproximación (30 / 25-30 / 25) + 20-25 · 15-20 al fallo · 2 bajadas del 20 % al fallo' },
            { id: 'l-gemelo-sentado', name: 'Gemelo sentado', sets: 7, target: 'Mismas reps que el gemelo de pie' },
          ],
        },
      ],
    },
    {
      id: 'd4',
      name: 'Día 4',
      title: 'Pump brazo',
      groups: ['triceps', 'biceps', 'core'],
      blocks: [
        {
          title: 'Tríceps',
          group: 'triceps',
          exercises: [
            {
              id: 'l-jalon-agarre-invertido',
              name: 'Jalón en polea agarre invertido',
              sets: 4,
              target: '12 – 15 reps · fallo en las 2 últimas',
              rest: 60,
              notes: 'Barra corta y recta. Muy estricto: cuerpo recto, codos pegados y 1″ en la contracción máxima. En las series al fallo, que te ayuden en el último tercio si hace falta.',
            },
          ],
        },
        {
          title: 'Press francés + press cerrado',
          kind: 'superset',
          group: 'triceps',
          rest: 90,
          restText: 'Mínimo entre ejercicios · 90″ entre superseries',
          note: 'Los dos ejercicios con el mismo peso, sin soltar la barra.',
          exercises: [
            {
              id: 'l-press-frances-z',
              name: 'Press francés con barra Z',
              sets: 4,
              target: '12 – 15 reps · sube el peso · las 2 últimas a 1-2 reps del fallo',
            },
            { id: 'l-press-cerrado', name: 'Press cerrado', sets: 4, target: '12 – 15 reps · al fallo al menos las 2 últimas' },
          ],
        },
        {
          title: 'Tríceps',
          group: 'triceps',
          exercises: [
            {
              id: 'l-fondos-bancas',
              name: 'Fondos entre bancas',
              sets: 3,
              target: '20 reps peso corporal · 1 disco de 20 kg al fallo · 2 discos al fallo + descendente',
              rest: 90,
              notes: 'Solo pasa a 2 discos si en la segunda serie llegas a 20 reps; si no, repite con 1. En la última, al llegar al fallo quita todo el peso y sigue hasta el fallo.',
            },
          ],
        },
        {
          title: 'Bíceps',
          group: 'biceps',
          exercises: [
            {
              id: 'l-curl-alterno',
              name: 'Curl alterno con mancuernas de pie',
              sets: 4,
              target: '12 → 10 reps · sube el peso · fallo en las 2 últimas',
              rest: 60,
              notes: 'Muy estricto, codo pegado al costado y supinando al máximo arriba. Sin inercia: usa un peso bajo.',
            },
            {
              id: 'l-curl-scott',
              name: 'Curl Scott con mancuerna a un brazo',
              sets: 4,
              target: '1 × 10 (a 1-2 del fallo) + 3 series de 8 → 6 subiendo el peso · fallo en las 2 últimas',
              rest: 60,
              notes: 'Lento, concentrándote en apretar. Recorrido amplio sin forzar el estiramiento.',
            },
            {
              id: 'l-curl-polea-alta',
              name: 'Curl desde polea alta a dos brazos',
              sets: 4,
              target: '12 – 15 reps · aguanta un instante en la contracción',
              rest: 60,
              notes: 'Desde la polea de cruces. Lento en la subida y en la bajada.',
            },
          ],
        },
        {
          title: 'Abdomen y lumbar',
          group: 'core',
          exercises: [
            { id: 'l-elevaciones-piernas', name: 'Elevaciones de piernas colgado', sets: 3, target: '15 reps', rest: 60, noWeight: true },
            { id: 'l-crunches', name: 'Crunches', sets: 4, target: '40 reps', rest: 60, noWeight: true },
            { id: 'l-hiperextensiones', name: 'Hiperextensiones con peso', sets: 4, target: '15 reps', rest: 60 },
          ],
        },
      ],
    },
  ],
};
