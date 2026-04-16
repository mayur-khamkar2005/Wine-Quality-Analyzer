import { z } from 'zod';

const boundedNumber = (label, min, max) =>
  z.coerce
    .number()
    .min(min, `${label} must be at least ${min}`)
    .max(max, `${label} must be at most ${max}`);

export const wineInputSchema = z
  .object({
    fixedAcidity: boundedNumber('Fixed acidity', 0, 25),
    volatileAcidity: boundedNumber('Volatile acidity', 0, 2),
    citricAcid: boundedNumber('Citric acid', 0, 2),
    residualSugar: boundedNumber('Residual sugar', 0, 30),
    chlorides: boundedNumber('Chlorides', 0, 1),
    freeSulfurDioxide: boundedNumber('Free sulfur dioxide', 0, 150),
    totalSulfurDioxide: boundedNumber('Total sulfur dioxide', 0, 300),
    density: boundedNumber('Density', 0.98, 1.1),
    pH: boundedNumber('pH', 2.5, 4.5),
    sulphates: boundedNumber('Sulphates', 0, 3),
    alcohol: boundedNumber('Alcohol', 0, 20),
  })
  .strict();
