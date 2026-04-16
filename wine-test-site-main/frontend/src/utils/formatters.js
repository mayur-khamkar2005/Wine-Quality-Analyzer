const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  try {
    const dateValue = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(dateValue.getTime())) {
      return 'N/A';
    }

    return dateTimeFormatter.format(dateValue);
  } catch {
    return 'N/A';
  }
};

export const formatNumericValue = (
  value,
  {
    fallback = 'N/A',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    suffix = '',
  } = {},
) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  try {
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return `${formatter.format(numericValue)}${suffix}`;
  } catch {
    return fallback;
  }
};

export const formatScaleValue = (
  value,
  scale,
  options = {},
) => {
  const fallback = options.fallback || 'N/A';
  const formattedValue = formatNumericValue(value, {
    fallback,
    ...options,
  });

  return formattedValue === fallback ? fallback : `${formattedValue}/${scale}`;
};

export const formatMetricName = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Metric';
  }

  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (character) => character.toUpperCase());
};

export const getCategoryClassName = (category = '') => {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory === 'excellent') {
    return 'pill pill--excellent';
  }

  if (normalizedCategory === 'good') {
    return 'pill pill--good';
  }

  if (normalizedCategory === 'average') {
    return 'pill pill--average';
  }

  if (normalizedCategory === 'poor') {
    return 'pill pill--poor';
  }

  return 'pill pill--muted';
};
