const CATEGORY_OPTIONS = ['Poor', 'Average', 'Good', 'Excellent'];

const toFiniteNumber = (value) => {
  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const clampNumber = (value, minimum, maximum, fallback = minimum) => {
  const numericValue = toFiniteNumber(value);

  if (numericValue === null) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, numericValue));
};

const normalizeCategory = (value) => {
  if (typeof value !== 'string') {
    return 'Unknown';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Unknown';
  }

  const matchingCategory = CATEGORY_OPTIONS.find(
    (option) => option.toLowerCase() === trimmedValue.toLowerCase(),
  );

  return matchingCategory || trimmedValue;
};

const normalizeMetric = (metric, index) => {
  if (!metric || typeof metric !== 'object') {
    return null;
  }

  const name =
    typeof metric.name === 'string' && metric.name.trim()
      ? metric.name.trim()
      : `Metric ${index + 1}`;

  return {
    name,
    score: clampNumber(metric.score, 0, 100, 0),
  };
};

const normalizeInputs = (inputs) => {
  if (!inputs || typeof inputs !== 'object') {
    return {};
  }

  return {
    ...inputs,
    alcohol: toFiniteNumber(inputs.alcohol),
    pH: toFiniteNumber(inputs.pH),
    volatileAcidity: toFiniteNumber(inputs.volatileAcidity),
  };
};

const normalizePrediction = (prediction) => {
  if (!prediction || typeof prediction !== 'object') {
    return {
      category: 'Unknown',
      score: 0,
      rating: 0,
      metrics: [],
    };
  }

  const score = clampNumber(prediction.score, 0, 100, 0);
  const rating = toFiniteNumber(prediction.rating);

  return {
    ...prediction,
    category: normalizeCategory(prediction.category),
    score,
    rating: rating === null ? Number((score / 10).toFixed(1)) : clampNumber(rating, 0, 10, 0),
    metrics: Array.isArray(prediction.metrics)
      ? prediction.metrics
          .map(normalizeMetric)
          .filter(Boolean)
      : [],
  };
};

export const normalizePredictionRecord = (record, fallbackId = 'record-unknown') => {
  if (!record || typeof record !== 'object') {
    return null;
  }

  const safeId = typeof fallbackId === 'string' && fallbackId.trim()
    ? fallbackId
    : 'record-unknown';

  return {
    ...record,
    id:
      typeof record.id === 'string' && record.id.trim()
        ? record.id
        : safeId,
    prediction: normalizePrediction(record.prediction),
    inputs: normalizeInputs(record.inputs),
    createdAt: record.createdAt || null,
    updatedAt: record.updatedAt || null,
  };
};

export const normalizePredictionRecordList = (records = []) =>
  (Array.isArray(records) ? records : [])
    .map((record, index) =>
      normalizePredictionRecord(record, `record-${index + 1}`),
    )
    .filter(Boolean);

export const normalizePaginatedPredictionHistory = (payload) => {
  const safePayload = payload && typeof payload === 'object' ? payload : {};
  const records = normalizePredictionRecordList(safePayload?.records);
  const total = Math.max(
    Number.parseInt(safePayload?.pagination?.total, 10) || records.length,
    0,
  );
  const pages = Math.max(Number.parseInt(safePayload?.pagination?.pages, 10) || 1, 1);
  const page = Math.min(
    Math.max(Number.parseInt(safePayload?.pagination?.page, 10) || 1, 1),
    pages,
  );

  return {
    records,
    pagination: {
      page,
      pages,
      total,
    },
  };
};
