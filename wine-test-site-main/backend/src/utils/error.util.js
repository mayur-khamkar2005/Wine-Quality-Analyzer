import { ApiError } from './ApiError.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const toValidationErrors = (error) =>
  Object.values(error?.errors || {}).map((issue) => ({
    field: issue.path,
    message: issue.message,
  }));

const toDuplicateFieldList = (error) =>
  Object.keys(error?.keyValue || {}).filter(Boolean);

export const toApiError = (error, options = {}) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.code === DUPLICATE_KEY_ERROR_CODE) {
    const duplicateFields = toDuplicateFieldList(error);
    const duplicateFieldLabel = duplicateFields.join(', ') || 'value';

    return new ApiError(
      409,
      options.duplicateMessage ||
        `A record with this ${duplicateFieldLabel} already exists`,
    );
  }

  if (error?.name === 'ValidationError') {
    return new ApiError(
      400,
      options.validationMessage || 'Validation failed',
      toValidationErrors(error),
    );
  }

  if (error?.name === 'CastError') {
    return new ApiError(
      400,
      options.castMessage || `Invalid ${error.path || 'request value'}`,
    );
  }

  if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
    return new ApiError(401, 'Authentication token is invalid or expired');
  }

  return new ApiError(
    options.statusCode || 500,
    options.fallbackMessage || 'Internal server error',
  );
};
