// Plan de alimentación de Lucía. Cada comida tiene una o varias opciones;
// cada opción es una lista de alimentos { qty, food }.

const i = (qty, food) => ({ qty, food });

export const NUTRITION = {
  name: 'Plan de alimentación',
  summary: '4 días de pesas · días de descanso, core y cardio',
  tips: ['Deja unas 3 h entre comidas', 'El peso es siempre en crudo', 'Respeta las cantidades indicadas'],
  supplements: [
    { id: 'creatina', name: 'Creatina', amount: '6 g al día' },
    { id: 'ashwagandha-am', name: 'Ashwagandha · mañana', amount: '150-300 mg' },
    { id: 'ashwagandha-pm', name: 'Ashwagandha · noche', amount: '150-300 mg' },
    { id: 'magnesio-am', name: 'Magnesio · mañana', amount: '150 mg' },
    { id: 'magnesio-pm', name: 'Magnesio · noche', amount: '150 mg' },
  ],
  supplementsNote: 'Ashwagandha: empieza con 150 mg por toma y súbele 50 mg cada 2 semanas hasta llegar a 300 mg.',
  plans: {
    pesas: {
      label: 'Día de pesas',
      short: 'Pesas',
      meals: [
        {
          id: 'c1',
          name: 'Comida 1',
          options: [
            [
              i('300 ml', 'leche de almendra light'),
              i('60 g', 'pan integral con 5 ml de aceite de oliva'),
              i('15 g', 'crema de cacahuete o frutos secos'),
              i('75 g', 'jamón serrano o lomo embuchado'),
            ],
          ],
        },
        {
          id: 'c2',
          name: 'Comida 2',
          options: [[i('2 rebanadas', 'pan de molde integral'), i('50 g', 'lacón fresco')]],
        },
        {
          id: 'c3',
          name: 'Comida 3',
          options: [
            [
              i('150 g', 'salmón a la plancha o emperador'),
              i('100 g', 'verdura'),
              i('30 g', 'arroz o pasta'),
              i('1', 'pudding proteico'),
            ],
          ],
        },
        {
          id: 'c4',
          name: 'Comida 4',
          options: [[i('150 g', 'queso fresco batido light'), i('1', 'plátano')]],
        },
        {
          id: 'c5',
          name: 'Comida 5',
          options: [
            [
              i('150 g', 'merluza o 120 g de pollo a la plancha'),
              i('150 g', 'verdura'),
              i('1', 'mousse proteica con 2 onzas de chocolate 85 %'),
            ],
          ],
        },
      ],
    },
    descanso: {
      label: 'Día de descanso, core y cardio',
      short: 'Descanso',
      meals: [
        {
          id: 'c1',
          name: 'Comida 1',
          options: [
            [
              i('80 g', 'jamón serrano'),
              i('2 rebanadas', 'pan Wasa'),
              i('1', 'yogur desnatado'),
              i('250 ml', 'bebida de almendra light'),
              i('', 'Café o infusión'),
            ],
          ],
        },
        {
          id: 'c2',
          name: 'Comida 2',
          options: [[i('150 g', 'queso fresco batido light'), i('1 onza', 'chocolate 85 %')]],
        },
        {
          id: 'c3',
          name: 'Comida 3',
          options: [
            [
              i('150 g', 'atún al natural o pollo a la plancha'),
              i('200 g', 'patata en conserva Ybarra'),
              i('200 g', 'verdura'),
              i('1', 'yogur proteico'),
            ],
          ],
        },
        {
          id: 'c4',
          name: 'Comida 4',
          options: [[i('1', 'pudding proteico'), i('15 g', 'frutos secos naturales o crema de cacahuete orgánica')]],
        },
        {
          id: 'c5',
          name: 'Comida 5',
          options: [
            [
              i('120 g', 'ternera o salmón a la plancha'),
              i('300 g', 'verdura'),
              i('1', 'yogur proteico con 10 g de crema de cacahuete'),
            ],
          ],
        },
      ],
    },
  },
};
