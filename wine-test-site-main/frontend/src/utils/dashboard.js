import { normalizePredictionRecordList } from './predictionRecords.js';

const RANGE_CONFIG = {
  weekly: {
    key: 'weekly',
    label: '7 Days',
    caption: 'Short-term momentum',
    days: 7,
    granularity: 'day',
  },
  monthly: {
    key: 'monthly',
    label: '30 Days',
    caption: 'Monthly performance',
    days: 30,
    granularity: 'day',
  },
  yearly: {
    key: 'yearly',
    label: '12 Months',
    caption: 'Long-range trend',
    days: 365,
    granularity: 'month',
  },
};

const DAY_MS = 24 * 60 * 60 * 1000;

const dayFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  year: '2-digit',
});

const rangeFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const createDayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const createMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const roundToOne = (value) => Number(value.toFixed(1));

const getAverageScore = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return 0;
  }

  const total = records.reduce(
    (sum, record) => sum + (record?.prediction?.score || 0),
    0,
  );
  return roundToOne(total / records.length);
};

const getUniqueDayCount = (records) => {
  if (!Array.isArray(records)) {
    return 0;
  }
  return new Set(records.map((record) => createDayKey(record?.createdAtDate))).size;
};

const getReferenceDate = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return new Date();
  }

  const firstRecord = records[0];
  if (!firstRecord?.createdAtDate) {
    return new Date();
  }

  return firstRecord.createdAtDate;
};

const getRangeConfig = (rangeKey) =>
  RANGE_CONFIG[rangeKey] || RANGE_CONFIG.monthly;

const getRangeWindow = (records, rangeKey) => {
  const config = getRangeConfig(rangeKey);
  const referenceDate = getReferenceDate(records);

  if (config.granularity === 'month') {
    const end = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const start = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - 11,
      1,
      0,
      0,
      0,
      0,
    );
    return { config, start, end };
  }

  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end.getTime() - (config.days - 1) * DAY_MS);
  start.setHours(0, 0, 0, 0);

  return { config, start, end };
};

const buildDayBuckets = (start, end) => {
  const buckets = [];

  for (
    let cursor = new Date(start);
    cursor <= end;
    cursor = new Date(cursor.getTime() + DAY_MS)
  ) {
    buckets.push({
      key: createDayKey(cursor),
      label: dayFormatter.format(cursor),
      date: new Date(cursor),
    });
  }

  return buckets;
};

const buildMonthBuckets = (start, end) => {
  const buckets = [];

  for (
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    cursor <= end;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  ) {
    buckets.push({
      key: createMonthKey(cursor),
      label: monthFormatter.format(cursor),
      date: new Date(cursor),
    });
  }

  return buckets;
};

const buildAlcoholInsights = (records) => {
  const bands = [
    {
      key: 'light',
      label: 'lighter wines',
      predicate: (record) =>
        typeof record.inputs.alcohol === 'number' &&
        record.inputs.alcohol < 11.5,
    },
    {
      key: 'balanced',
      label: 'balanced wines',
      predicate: (record) =>
        typeof record.inputs.alcohol === 'number' &&
        record.inputs.alcohol >= 11.5 && record.inputs.alcohol < 13.5,
    },
    {
      key: 'strong',
      label: 'strong wines',
      predicate: (record) =>
        typeof record.inputs.alcohol === 'number' &&
        record.inputs.alcohol >= 13.5,
    },
  ]
    .map((band) => {
      const matchingRecords = records.filter(band.predicate);

      return {
        ...band,
        count: matchingRecords.length,
        averageScore: getAverageScore(matchingRecords),
      };
    })
    .filter((band) => band.count > 0)
    .sort(
      (left, right) =>
        right.averageScore - left.averageScore || right.count - left.count,
    );

  return bands[0] || null;
};

const buildMomentumInsight = (records) => {
  if (records.length < 4) {
    return null;
  }

  const chronologicalRecords = [...records].sort(
    (left, right) => left.createdAtDate - right.createdAtDate,
  );
  const splitIndex = Math.floor(chronologicalRecords.length / 2);
  const previousPeriod = chronologicalRecords.slice(0, splitIndex);
  const currentPeriod = chronologicalRecords.slice(splitIndex);

  if (!previousPeriod.length || !currentPeriod.length) {
    return null;
  }

  const previousAverage = getAverageScore(previousPeriod);
  const currentAverage = getAverageScore(currentPeriod);
  const rawDelta = roundToOne(currentAverage - previousAverage);

  if (rawDelta === 0) {
    return {
      percentage: 0,
      rawDelta,
      direction: 'flat',
      previousAverage,
      currentAverage,
    };
  }

  const percentage =
    previousAverage === 0
      ? 100
      : Math.round(Math.abs((rawDelta / previousAverage) * 100));

  return {
    percentage,
    rawDelta,
    direction: rawDelta > 0 ? 'up' : 'down',
    previousAverage,
    currentAverage,
  };
};

export const DASHBOARD_RANGE_OPTIONS = Object.values(RANGE_CONFIG);

export const normalizeHistoryRecords = (records = []) =>
  normalizePredictionRecordList(records)
    .map((record) => {
      const createdAtDate = new Date(record.createdAt);

      if (Number.isNaN(createdAtDate.getTime())) {
        return null;
      }

      return {
        ...record,
        createdAtDate,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.createdAtDate - left.createdAtDate);

export const filterRecordsByRange = (records, rangeKey) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const { start, end } = getRangeWindow(records, rangeKey);

  return records.filter(
    (record) => record?.createdAtDate >= start && record?.createdAtDate <= end,
  );
};

export const buildTrendSeries = (records, rangeKey) => {
  const { config, start, end } = getRangeWindow(records, rangeKey);
  const buckets =
    config.granularity === 'month'
      ? buildMonthBuckets(start, end)
      : buildDayBuckets(start, end);
  const filteredRecords = filterRecordsByRange(records, rangeKey);
  const aggregateMap = new Map();

  filteredRecords.forEach((record) => {
    const bucketKey =
      config.granularity === 'month'
        ? createMonthKey(record.createdAtDate)
        : createDayKey(record.createdAtDate);
    const currentBucket = aggregateMap.get(bucketKey) || {
      totalScore: 0,
      count: 0,
      bestScore: 0,
    };

    currentBucket.totalScore += record.prediction.score;
    currentBucket.count += 1;
    currentBucket.bestScore = Math.max(
      currentBucket.bestScore,
      record.prediction.score,
    );
    aggregateMap.set(bucketKey, currentBucket);
  });

  return buckets.map((bucket) => {
    const bucketData = aggregateMap.get(bucket.key);

    if (!bucketData) {
      return {
        label: bucket.label,
        averageScore: 0,
        count: 0,
        bestScore: 0,
      };
    }

    return {
      label: bucket.label,
      averageScore: roundToOne(bucketData.totalScore / bucketData.count),
      count: bucketData.count,
      bestScore: bucketData.bestScore,
    };
  });
};

export const buildCategoryBreakdown = (records) =>
  Object.entries(
    records.reduce((categoryMap, record) => {
      const category = record.prediction.category;
      categoryMap[category] = (categoryMap[category] || 0) + 1;
      return categoryMap;
    }, {}),
  )
    .map(([category, count]) => ({
      category,
      count,
      share: Math.round((count / records.length) * 100),
    }))
    .sort(
      (left, right) =>
        right.count - left.count || left.category.localeCompare(right.category),
    );

export const buildDashboardSnapshot = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return {
      totalPredictions: 0,
      averageScore: 0,
      bestScore: 0,
      mostCommonCategory: 'N/A',
      activeDays: 0,
      qualityRate: 0,
    };
  }

  const categoryBreakdown = buildCategoryBreakdown(records);
  const qualityCount = records.filter((record) =>
    ['Good', 'Excellent'].includes(record.prediction.category),
  ).length;

  return {
    totalPredictions: records.length,
    averageScore: getAverageScore(records),
    bestScore: Math.max(...records.map((record) => record.prediction.score)),
    mostCommonCategory: categoryBreakdown[0]?.category || 'N/A',
    activeDays: getUniqueDayCount(records),
    qualityRate: Math.round((qualityCount / records.length) * 100),
  };
};

export const buildDashboardInsights = (records, rangeKey) => {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  const insights = [];
  const momentum = buildMomentumInsight(records);
  const topCategory = buildCategoryBreakdown(records)[0];
  const topAlcoholBand = buildAlcoholInsights(records);
  const bestRecord = records.reduce(
    (bestSoFar, record) =>
      record.prediction.score > bestSoFar.prediction.score ? record : bestSoFar,
    records[0],
  );

  if (momentum) {
    insights.push({
      id: 'momentum',
      eyebrow: 'Momentum',
      tone: momentum.direction === 'down' ? 'amber' : 'emerald',
      title:
        momentum.direction === 'flat'
          ? 'Average quality is holding steady'
          : `Average score ${momentum.direction === 'up' ? 'increased' : 'softened'} by ${momentum.percentage}%`,
      description:
        momentum.direction === 'flat'
          ? `Both halves of this ${getRangeConfig(rangeKey).label.toLowerCase()} window are averaging around ${momentum.currentAverage}/100.`
          : `The current part of the range is averaging ${momentum.currentAverage}/100 versus ${momentum.previousAverage}/100 earlier in the period.`,
    });
  }

  if (topAlcoholBand) {
    insights.push({
      id: 'alcohol-band',
      eyebrow: 'Pattern',
      tone: 'violet',
      title: `Best performance is showing up in ${topAlcoholBand.label}`,
      description: `${topAlcoholBand.label.charAt(0).toUpperCase() + topAlcoholBand.label.slice(1)} are averaging ${topAlcoholBand.averageScore}/100 in this view.`,
    });
  }

  if (topCategory) {
    insights.push({
      id: 'category-share',
      eyebrow: 'Mix',
      tone: 'sky',
      title: `${topCategory.category} is leading the quality mix`,
      description: `${topCategory.share}% of predictions in this window landed in the ${topCategory.category.toLowerCase()} band.`,
    });
  }

  insights.push({
    id: 'best-record',
    eyebrow: 'Highlight',
    tone: 'rose',
    title: `Peak score reached ${bestRecord.prediction.score}/100`,
    description: `The strongest recent result was recorded on ${rangeFormatter.format(bestRecord.createdAtDate)} with a ${bestRecord.prediction.category.toLowerCase()} classification.`,
  });

  return insights.slice(0, 3);
};

export const formatRangeWindow = (records, rangeKey) => {
  if (!Array.isArray(records) || records.length === 0) {
    return 'Waiting for your first saved prediction';
  }

  const { config, start, end } = getRangeWindow(records, rangeKey);

  if (config.granularity === 'month') {
    return `${monthFormatter.format(start)} - ${monthFormatter.format(end)}`;
  }

  return `${rangeFormatter.format(start)} - ${rangeFormatter.format(end)}`;
};

export const getRangeOption = (rangeKey) => getRangeConfig(rangeKey);
