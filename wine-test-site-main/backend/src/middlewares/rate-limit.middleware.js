import rateLimit from 'express-rate-limit';

import { env } from '../config/env.js';

const buildRateLimitError = (message) => ({
  success: false,
  statusCode: 429,
  message,
  errors: [],
});

const createLimiter = ({
  windowMs,
  max,
  message,
  skipSuccessfulRequests = false,
}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (_req, res) => {
      res.status(429).json(buildRateLimitError(message));
    },
  });

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 200 : 1000,
  message: 'Too many requests. Please try again in a few minutes.',
});

export const authLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 15 : 50,
  skipSuccessfulRequests: true,
  message:
    'Too many authentication attempts. Please wait a few minutes and try again.',
});
