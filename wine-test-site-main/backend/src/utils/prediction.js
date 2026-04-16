const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const linearScore = (value, min, max, invert = false) => {
  const normalizedValue = clamp((value - min) / (max - min), 0, 1);
  return invert ? 1 - normalizedValue : normalizedValue;
};

const idealRangeScore = (value, min, max) => {
  if (value >= min && value <= max) {
    return 1;
  }

  const distance = value < min ? min - value : value - max;
  const span = Math.max(max - min, 1);
  return clamp(1 - distance / span, 0, 1);
};

export const calculateWinePrediction = (inputs) => {
  if (!inputs || typeof inputs !== 'object') {
    throw new Error('Invalid inputs: expected an object with wine chemistry values');
  }

  const requiredFields = [
    'fixedAcidity', 'volatileAcidity', 'citricAcid', 'residualSugar',
    'chlorides', 'freeSulfurDioxide', 'totalSulfurDioxide',
    'density', 'pH', 'sulphates', 'alcohol'
  ];

  for (const field of requiredFields) {
    if (inputs[field] === undefined || inputs[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
    if (Number.isNaN(Number(inputs[field]))) {
      throw new Error(`Invalid value for ${field}: must be a number`);
    }
  }

  const weightedMetrics = {
    fixedAcidity: {
      score: idealRangeScore(inputs.fixedAcidity, 5.5, 9.5),
      weight: 0.08,
    },
    volatileAcidity: {
      score: linearScore(inputs.volatileAcidity, 0.1, 1.2, true),
      weight: 0.16,
    },
    citricAcid: {
      score: idealRangeScore(inputs.citricAcid, 0.2, 0.55),
      weight: 0.08,
    },
    residualSugar: {
      score: idealRangeScore(inputs.residualSugar, 1.5, 9),
      weight: 0.07,
    },
    chlorides: {
      score: linearScore(inputs.chlorides, 0.02, 0.15, true),
      weight: 0.1,
    },
    freeSulfurDioxide: {
      score: idealRangeScore(inputs.freeSulfurDioxide, 10, 45),
      weight: 0.07,
    },
    totalSulfurDioxide: {
      score: idealRangeScore(inputs.totalSulfurDioxide, 50, 160),
      weight: 0.08,
    },
    density: {
      score: linearScore(inputs.density, 0.99, 1.004, true),
      weight: 0.08,
    },
    pH: {
      score: idealRangeScore(inputs.pH, 3.1, 3.5),
      weight: 0.08,
    },
    sulphates: {
      score: idealRangeScore(inputs.sulphates, 0.45, 0.8),
      weight: 0.1,
    },
    alcohol: {
      score: linearScore(inputs.alcohol, 8, 14.5),
      weight: 0.1,
    },
  };

  const normalizedScore = Object.values(weightedMetrics).reduce(
    (total, metric) => total + metric.score * metric.weight,
    0,
  );

  const score = Math.round(normalizedScore * 100);
  const rating = clamp(Math.round(normalizedScore * 9) + 1, 1, 10);

  let category = 'Poor';

  if (score >= 85) {
    category = 'Excellent';
  } else if (score >= 70) {
    category = 'Good';
  } else if (score >= 55) {
    category = 'Average';
  }

  return {
    score,
    rating,
    category,
    metrics: Object.entries(weightedMetrics).map(([name, metric]) => ({
      name,
      score: Math.round(metric.score * 100),
    })),
  };
};
