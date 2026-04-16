import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { toApiError } from '../utils/error.util.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (error, _req, res, _next) => {
  const normalizedError = toApiError(error);
  const statusCode = normalizedError.statusCode || 500;
  const message = normalizedError.message || 'Internal server error';
  const errors = normalizedError.errors || [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(env.nodeEnv === 'development' ? { stack: error?.stack } : {}),
  });
};
