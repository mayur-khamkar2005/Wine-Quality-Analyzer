export const wineSections = [
  {
    title: 'Acidity Profile',
    description: 'Core acidity indicators that shape balance and freshness.',
    fields: [
      {
        name: 'fixedAcidity',
        label: 'Fixed Acidity',
        min: 0,
        max: 25,
        step: 0.1,
        placeholder: '7.4',
        helper: 'g/dm3',
      },
      {
        name: 'volatileAcidity',
        label: 'Volatile Acidity',
        min: 0,
        max: 2,
        step: 0.01,
        placeholder: '0.70',
        helper: 'g/dm3',
      },
      {
        name: 'citricAcid',
        label: 'Citric Acid',
        min: 0,
        max: 2,
        step: 0.01,
        placeholder: '0.00',
        helper: 'g/dm3',
      },
      {
        name: 'pH',
        label: 'pH',
        min: 2.5,
        max: 4.5,
        step: 0.01,
        placeholder: '3.51',
        helper: 'pH level',
      },
    ],
  },
  {
    title: 'Structure & Balance',
    description: 'Density, sugar, and mineral markers that influence body.',
    fields: [
      {
        name: 'residualSugar',
        label: 'Residual Sugar',
        min: 0,
        max: 30,
        step: 0.1,
        placeholder: '1.9',
        helper: 'g/dm3',
      },
      {
        name: 'chlorides',
        label: 'Chlorides',
        min: 0,
        max: 1,
        step: 0.001,
        placeholder: '0.076',
        helper: 'g/dm3',
      },
      {
        name: 'density',
        label: 'Density',
        min: 0.98,
        max: 1.1,
        step: 0.0001,
        placeholder: '0.9978',
        helper: 'g/cm3',
      },
      {
        name: 'sulphates',
        label: 'Sulphates',
        min: 0,
        max: 3,
        step: 0.01,
        placeholder: '0.56',
        helper: 'g/dm3',
      },
    ],
  },
  {
    title: 'Fermentation Signals',
    description: 'Sulfur and alcohol markers that shift quality outcomes.',
    fields: [
      {
        name: 'freeSulfurDioxide',
        label: 'Free Sulfur Dioxide',
        min: 0,
        max: 150,
        step: 1,
        placeholder: '11',
        helper: 'mg/dm3',
      },
      {
        name: 'totalSulfurDioxide',
        label: 'Total Sulfur Dioxide',
        min: 0,
        max: 300,
        step: 1,
        placeholder: '34',
        helper: 'mg/dm3',
      },
      {
        name: 'alcohol',
        label: 'Alcohol',
        min: 0,
        max: 20,
        step: 0.1,
        placeholder: '9.4',
        helper: '% vol',
      },
    ],
  },
];

export const wineFields = wineSections.flatMap((section) => section.fields);

export const createInitialWineForm = () =>
  wineFields.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.name]: '',
    }),
    {},
  );

export const initialWineForm = createInitialWineForm();
