// Plan de alimentación. Cada comida tiene una o varias opciones;
// cada opción es una lista de alimentos { qty, food }.

const i = (qty, food) => ({ qty, food });

export const NUTRITION = {
  name: 'Plan de alimentación',
  summary: '5 días de pesas · 2 días de descanso / cardio',
  tips: ['Deja unas 3 h entre comidas', 'El peso es siempre en crudo', 'Respeta las cantidades indicadas'],
  supplements: [{ id: 'creatina', name: 'Creatina', amount: '10 g al día' }],
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
              i('80 g', 'pan integral con 5 ml de aceite de oliva'),
              i('90 g', 'lacón o jamón cocido'),
            ],
            [
              i('50 g', 'cereales bajos en azúcar'),
              i('50 g', 'proteína en polvo'),
              i('10 g', 'crema de cacahuete'),
              i('250 ml', 'bebida de almendra light'),
            ],
          ],
        },
        {
          id: 'c2',
          name: 'Comida 2',
          options: [[i('2 rebanadas', 'pan de molde integral'), i('60 g', 'lacón fresco'), i('15 g', 'nueces')]],
        },
        {
          id: 'c3',
          name: 'Comida 3',
          options: [[i('200 g', 'salmón a la plancha o emperador'), i('100 g', 'verdura'), i('50 g', 'arroz o pasta')]],
        },
        {
          id: 'c4',
          name: 'Comida 4',
          options: [[i('250 g', 'queso fresco batido light'), i('1', 'plátano')]],
        },
        {
          id: 'c5',
          name: 'Comida 5',
          options: [
            [
              i('180 g', 'merluza o 150 g de pollo a la plancha'),
              i('150 g', 'verdura'),
              i('1', 'mousse proteica con 15 g de crema de cacahuete'),
            ],
          ],
        },
      ],
    },
    descanso: {
      label: 'Día de descanso / cardio',
      short: 'Descanso',
      meals: [
        {
          id: 'c1',
          name: 'Comida 1',
          options: [
            [
              i('90 g', 'jamón serrano'),
              i('4', 'tortitas de arroz o maíz'),
              i('1', 'yogur desnatado'),
              i('250 ml', 'bebida de almendra light'),
              i('', 'Café o infusión'),
            ],
          ],
        },
        {
          id: 'c2',
          name: 'Comida 2',
          options: [[i('250 g', 'queso fresco batido light'), i('15 g', 'crema de cacahuete o nueces')]],
        },
        {
          id: 'c3',
          name: 'Comida 3',
          options: [
            [i('200 g', 'atún al natural o pollo a la plancha'), i('50 g', 'arroz o pasta integral'), i('200 g', 'verdura')],
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
              i('150 g', 'ternera o salmón a la plancha'),
              i('300 g', 'verdura'),
              i('1', 'yogur proteico con 5 g de crema de cacahuete'),
            ],
          ],
        },
      ],
    },
  },
};
