import { z } from 'zod';

const parseInteger = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? value : parsed;
};

const positiveInteger = (label, { defaultValue, max }) =>
  z.preprocess(
    parseInteger,
    z
      .number({
        invalid_type_error: `${label} must be a number`,
      })
      .int(`${label} must be a whole number`)
      .min(1, `${label} must be at least 1`)
      .max(max, `${label} must be at most ${max}`)
      .default(defaultValue),
  );

export const historyQuerySchema = z.object({
  page: positiveInteger('Page', { defaultValue: 1, max: 100000 }),
  limit: positiveInteger('Limit', { defaultValue: 10, max: 200 }),
  category: z.enum(['Poor', 'Average', 'Good', 'Excellent']).optional(),
});

export const adminPaginationQuerySchema = z.object({
  page: positiveInteger('Page', { defaultValue: 1, max: 100000 }),
  limit: positiveInteger('Limit', { defaultValue: 10, max: 50 }),
});
