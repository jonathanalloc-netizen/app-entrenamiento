// Rutina del mes. Cada día tiene bloques (grupo muscular, superserie, serie gigante…)
// y cada bloque sus ejercicios.
//   sets:     filas de series que aparecen por defecto (se pueden añadir/quitar)
//   target:   reps / indicaciones
//   rest:     descanso en segundos (lo usa el temporizador); restText lo detalla
//   weeks:    variaciones por semana del ciclo (1-4) que sustituyen target/rest/sets
//   unit:     'kg' por defecto; 'kg/lado' cuando se apunta el peso de un lado
//   noWeight: ejercicio con peso corporal (solo reps)
//   from:     en series gigantes/triseries, pasada en la que entra el ejercicio

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
};

export const BLOCK_KINDS = {
  normal: null,
  superset: 'Superserie',
  triset: 'Triserie',
  giant: 'Serie gigante',
};

export const REST_DAY_NOTE = 'Los días de descanso sal a andar 1 h a buen ritmo.';

const pressMultiWeeks = {
  1: { target: '12 → 10 reps · sube el peso en cada serie', rest: 90 },
  2: { target: '10 → 8 reps · sube el peso en cada serie', rest: 120 },
  3: { target: '12 reps · mismo peso las 4 últimas · sin llegar al fallo', rest: 60 },
  4: { target: '10 → 7 reps · sube el peso · supera tus marcas de la semana 2', rest: 120 },
};

export const DEFAULT_ROUTINE = {
  id: 'rutina-mes-1',
  name: 'Rutina del mes',
  cycleWeeks: 4,
  days: [
    {
      id: 'd1',
      name: 'Día 1',
      title: 'Pectoral y abdomen',
      groups: ['pecho', 'abdomen'],
      blocks: [
        {
          title: 'Pectoral',
          group: 'pecho',
          note: '4 ejercicios de 5 series. Las cargas cambian cada semana. Fallo solo en la última serie de cada ejercicio (salvo en la semana 3).',
          exercises: [
            {
              id: 'press-vertical-barra',
              name: 'Press vertical con barra',
              sets: 5,
              weeks: {
                1: { target: '12 → 10 reps · sube el peso en cada serie', rest: 60 },
                2: { target: '10 → 8 reps · sube el peso en cada serie', rest: 90 },
                3: { target: '14 reps · mismo peso las 4 últimas · sin llegar al fallo', rest: 60 },
                4: { target: '10 → 7 reps · sube el peso · supera tus marcas de la semana 2', rest: 90 },
              },
            },
            { id: 'press-declinado-multipower', name: 'Press declinado en Multipower', sets: 5, weeks: pressMultiWeeks },
            { id: 'press-plano-barra', name: 'Press plano con barra', sets: 5, weeks: pressMultiWeeks },
            {
              id: 'aperturas-planas-mancuernas',
              name: 'Aperturas planas con mancuernas',
              sets: 5,
              weeks: {
                1: { target: '15 → 12 reps · sube el peso en cada serie', rest: 60 },
                2: { target: '12 → 10 reps · sube el peso en cada serie', rest: 60 },
                3: { target: '15 reps · mismo peso las 4 últimas · sin llegar al fallo', rest: 60 },
                4: { target: '5 series con el peso con el que terminaste la semana 1', rest: 60 },
              },
            },
          ],
        },
        {
          title: 'Abdomen',
          group: 'abdomen',
          exercises: [
            {
              id: 'encogimientos-polea-cuerda',
              name: 'Encogimientos en polea con cuerda',
              sets: 4,
              target: '20 → 15 reps · sube el peso · fallo en las 2 últimas',
              rest: 60,
              notes: 'De rodillas.',
            },
            {
              id: 'elevacion-cadera-tumbado',
              name: 'Elevación de cadera tumbado',
              sets: 4,
              target: '15 – 20 reps',
              rest: 45,
              noWeight: true,
              notes: 'Movimiento muy corto: solo despega el glúteo del suelo, con el resto de la espalda completamente apoyada.',
            },
          ],
        },
      ],
    },
    {
      id: 'd2',
      name: 'Día 2',
      title: 'Cuádriceps y femoral',
      groups: ['cuadriceps', 'femoral'],
      blocks: [
        {
          title: 'Extensiones + curl femoral',
          kind: 'superset',
          group: 'cuadriceps',
          rest: 90,
          restText: 'Mínimo entre ejercicios · ≤ 90″ entre superseries',
          note: '6 superseries. Sube el peso en las 5 primeras (en los dos ejercicios); la última con el mismo peso que la tercera.',
          exercises: [
            {
              id: 'extensiones-cuadriceps',
              name: 'Extensiones de cuádriceps',
              group: 'cuadriceps',
              sets: 6,
              target: '20 → 15 reps',
              notes: 'Explosivas, siempre con control y sin acortar el recorrido.',
            },
            {
              id: 'curl-femoral-tumbado',
              name: 'Curl femoral tumbado',
              group: 'femoral',
              sets: 6,
              target: '16 → 12 reps',
              notes: 'Estricto, con la negativa especialmente controlada y acentuando la contracción final.',
            },
          ],
        },
        {
          title: 'Cuádriceps',
          group: 'cuadriceps',
          exercises: [
            {
              id: 'sentadilla-multipower',
              name: 'Sentadilla en Multipower',
              sets: 15,
              unit: 'kg/lado',
              target: 'Series de 12 subiendo 5 kg/lado hasta 15 reps al fallo → sigue subiendo hasta 7-8 reps → baja 5 kg/lado hasta 30 kg/lado',
              rest: 90,
              restText: '60″ entre las 2 primeras · 90″ subiendo · 2′ en la fase pesada · ≤ 90″ bajando',
              notes: 'Empieza con 20 kg por lado. Tensión continua: no bloquees las rodillas al final. En total, al menos 15 series (alguna más contando las de aproximación).',
            },
          ],
        },
      ],
    },
    {
      id: 'd3',
      name: 'Día 3',
      title: 'Bíceps, tríceps y gemelo',
      groups: ['brazo', 'gemelo'],
      blocks: [
        {
          title: 'Brazo',
          kind: 'giant',
          group: 'brazo',
          rest: 90,
          restText: 'Sin descanso entre ejercicios · 90″ entre series gigantes',
          note: '4 pasadas; en cada una se añaden 2 ejercicios (hasta 10). El peso es lo de menos: técnica perfecta. Si llegas muy cómodo a las reps, sube el peso en la siguiente pasada.',
          exercises: [
            { id: 'curl-alterno-mancuernas', name: 'Curl alterno con mancuernas de pie', from: 1, sets: 4, target: '10 – 12 reps' },
            { id: 'jalon-polea-cuerda', name: 'Jalón en polea con cuerda', from: 1, sets: 4, target: '15 – 12 reps · aguanta 2″ la contracción final' },
            { id: 'curl-barra-z-pared', name: 'Curl barra Z con la espalda en la pared', from: 1, sets: 4, target: '8 – 10 reps · negativa de 3″' },
            { id: 'extensiones-polea-alta-nuca', name: 'Extensiones desde polea alta tras la cabeza', from: 1, sets: 4, target: '10 – 12 reps', notes: 'De pie.' },
            { id: 'curl-concentrado-dos-brazos', name: 'Curl concentrado a dos brazos con mancuerna', from: 2, sets: 3, target: '12 – 10 reps · aguanta 1″ arriba', notes: 'De pie.' },
            { id: 'jalon-polea-barra-v', name: 'Jalón en polea con barra en V', from: 2, sets: 3, target: '12 – 15 reps' },
            { id: 'curl-martillo-sentado', name: 'Curl martillo alterno sentado', from: 3, sets: 2, target: '12 – 10 reps', notes: 'Sentado sin respaldo.' },
            { id: 'press-frances-suelo', name: 'Press francés tumbado en el suelo', from: 3, sets: 2, target: '10 – 12 reps', notes: 'Llevando la barra por detrás de la cabeza.' },
            { id: 'curl-invertido-barra', name: 'Curl invertido con barra recta', from: 4, sets: 1, target: '14 – 18 reps' },
            { id: 'fondos-bancas-disco', name: 'Fondos entre bancas con disco', from: 4, sets: 1, target: 'Al fallo', notes: 'Disco de 20 kg sobre los muslos.' },
          ],
        },
        {
          title: 'Gemelo',
          group: 'gemelo',
          exercises: [
            {
              id: 'talones-pie-una-pierna',
              name: 'Elevación de talones de pie a una pierna',
              sets: 5,
              target: '1 × 50 con peso corporal + 4 series de 50 → 30 reps subiendo el peso · fallo en las 2 últimas',
              rest: 45,
              restText: '45″ tras la primera · sin descanso entre piernas · ≤ 45″ entre series',
              notes: 'Sujeta la mancuerna con la mano contraria a la pierna que trabaja.',
            },
            {
              id: 'talones-prensa',
              name: 'Elevación de talones en prensa',
              sets: 3,
              target: '1 × 20 + 2 series descendentes (2 bajadas + parciales)',
              rest: 120,
              restText: '60″ tras la primera · 2′ entre descendentes',
              notes: 'Usa la prensa de placas. Descendente: 8-10 reps muy lentas al fallo → quita ~30 % y haz todas las reps que puedas, con más ritmo → vuelve a quitar peso, reps explosivas → parciales hasta no mover los talones. Añade filas para apuntar las bajadas.',
            },
          ],
        },
      ],
    },
    {
      id: 'd4',
      name: 'Día 4',
      title: 'Dorsal y glúteo',
      groups: ['dorsal', 'gluteo'],
      blocks: [
        {
          title: 'Dorsal',
          group: 'dorsal',
          exercises: [
            {
              id: 'jalon-pecho-abierto',
              name: 'Jalón al pecho agarre abierto',
              sets: 8,
              target: '1-2 de calentamiento (15 → 12) · series de 10 subiendo 10 kg hasta 10 reps al fallo (4-5 series) · 1 al fallo + 2-3 forzadas · 1 al fallo + descendente (−30-40 %)',
              rest: 60,
              restText: '45″ calentamiento · ≤ 60″ en las de 10 · 90″ antes de las 2 finales',
              notes: 'En las series de 10 solo vas al fallo (o muy cerca) en la última. En la descendente, que te ayuden para completar al menos 5-6 reps.',
            },
            {
              id: 'remo-barra-t-pecho-apoyado',
              name: 'Remo con barra T y pecho apoyado',
              sets: 5,
              target: '12 → 10 reps · RIR 2-3 / 1-2 / 1-2 / fallo / fallo',
              rest: 90,
              notes: 'Estricto, sin dar tirones.',
            },
            {
              id: 'remo-gironda',
              name: 'Remo Gironda',
              sets: 3,
              target: '1 × 12-15 sin fallo + 2 descendentes con 2 bajadas (10-12 al fallo → −30 % → −30-40 %)',
              rest: 120,
              restText: '60″ tras la primera · 2′ entre descendentes',
              notes: 'Tronco recto todo el tiempo (como mucho, ligeramente inclinado). Mínimo 8-10 reps en cada bajada; usa los mismos pesos en las dos series. Añade filas para apuntar las bajadas.',
            },
            {
              id: 'jalon-polea-supino',
              name: 'Jalón desde polea agarre supino',
              sets: 4,
              target: '10 reps · las 3 últimas al fallo y con el mismo peso',
              rest: 90,
              notes: 'Peso alto. Baja la barra hasta la frente (no a la barbilla) y estira del todo arriba, incluso separando el glúteo del acolchado.',
            },
            {
              id: 'pullover-polea',
              name: 'Pull over en polea',
              sets: 4,
              target: '10 reps · negativa de 3″',
              rest: 90,
              notes: 'Sube el peso entre la 1ª y la 2ª serie y después lo mantienes. Peso moderado; baja todo lo que puedas sin forzar el hombro.',
            },
          ],
        },
        {
          title: 'Glúteo',
          group: 'gluteo',
          exercises: [
            {
              id: 'pull-through-polea',
              name: 'Pull through desde polea baja',
              sets: 4,
              target: '15 reps',
              rest: 45,
              notes: 'Espalda muy recta y rodillas extendidas: estira los isquios en la negativa y aprieta glúteos en la subida.',
            },
            {
              id: 'hip-thrust',
              name: 'Hip thrust',
              sets: 6,
              target: 'Series de 10 (2″ arriba) subiendo hasta 10 reps al fallo · después 3 series más con ese peso',
              rest: 60,
            },
            {
              id: 'subida-banco-step',
              name: 'Subida a banco step con mancuerna',
              sets: 3,
              target: '15 – 20 reps · mismo peso · fallo en las 2 últimas',
              rest: 0,
              restText: 'Sin descanso ni entre piernas ni entre series',
            },
          ],
        },
      ],
    },
    {
      id: 'd5',
      name: 'Día 5',
      title: 'Hombro y gemelo',
      groups: ['hombro', 'gemelo'],
      blocks: [
        {
          title: 'Hombro',
          kind: 'triset',
          group: 'hombro',
          rest: 60,
          restText: 'Mínimo entre ejercicios · 60″ entre triseries',
          note: '4 pasadas. Empieza con una carga muy ligera y sube el peso en cada pasada (al menos en las 2-3 primeras). Laterales y frontales muy estrictas; el press, más explosivo.',
          exercises: [
            { id: 'laterales-mancuernas-sentado', name: 'Elevaciones laterales sentado sin respaldo', sets: 4, target: '12 – 15 reps' },
            { id: 'frontales-sentado-respaldo', name: 'Frontales alternas sentado con respaldo', sets: 4, target: '10 – 12 reps', notes: 'Mismo peso que en las laterales.' },
            { id: 'press-militar-mancuernas-50', name: 'Press militar con mancuernas (banco a 50º)', sets: 4, target: 'Mínimo 10 – 12 reps' },
          ],
        },
        {
          title: 'Hombro',
          group: 'hombro',
          exercises: [
            {
              id: 'press-militar-una-mancuerna',
              name: 'Press militar con mancuerna a un brazo',
              sets: 4,
              target: '20 → 16 reps · sube el peso · fallo en las 2 últimas',
              rest: 60,
              restText: 'Mínimo entre brazos · 60″ entre series',
              notes: 'Baja la mancuerna hasta rozar el hombro.',
            },
            {
              id: 'remo-cuello-polea',
              name: 'Remo al cuello en polea (agarre cerrado)',
              sets: 4,
              target: '15 → 12 reps · sube el peso · fallo en las 2 últimas',
              rest: 60,
              notes: 'En la última serie, al llegar al fallo, sigue con repeticiones parciales.',
            },
            {
              id: 'frontales-tumbado-polea',
              name: 'Elevaciones frontales tumbado en polea baja',
              sets: 4,
              target: '12 – 15 reps · mismo peso · fallo en las 2 últimas',
              rest: 60,
              notes: 'Recorrido completo, hasta que los brazos queden paralelos al suelo.',
            },
            {
              id: 'laterales-polea-un-brazo',
              name: 'Laterales a un brazo en polea baja (por detrás)',
              sets: 3,
              target: '15 – 20 reps · mismo peso · fallo en las 2 últimas',
              rest: 0,
              restText: 'Sin descanso ni entre brazos ni entre series',
            },
            {
              id: 'laterales-sentado-respaldo-90',
              name: 'Elevaciones laterales sentado con respaldo a 90º',
              sets: 4,
              target: '20 → 15 reps · sube entre la 1ª y la 2ª · fallo en las 2 últimas',
              rest: 60,
              notes: 'Peso muy moderado, con los codos casi extendidos, hasta quedar paralelos al suelo. La última serie termina con parciales al fallo.',
            },
            {
              id: 'deltoides-posterior-maquina',
              name: 'Deltoides posterior en máquina',
              sets: 5,
              target: '25 → 20 reps · sube el peso en las 2-3 primeras y mantén',
              rest: 45,
              notes: 'Codos casi extendidos; aísla el deltoides posterior. Carga moderada y respeta los descansos.',
            },
          ],
        },
        {
          title: 'Gemelo',
          group: 'gemelo',
          exercises: [
            {
              id: 'talones-sentado',
              name: 'Elevación de talones sentado',
              sets: 5,
              target: '50 reps · fallo en las 3 últimas · micropausas de 5″ si no llegas',
              rest: 90,
              notes: 'Las 2 primeras de aproximación; intenta mantener la misma carga en las últimas. Rango completo y contracción completa; cuando te canses, sube la velocidad pero sin recortar el recorrido.',
            },
          ],
        },
      ],
    },
  ],
};

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
