import { ApiError } from '../utils/ApiError.js';

export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new ApiError(
          400,
          'Validation failed',
          result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        ),
      );
    }

    req[source] = result.data;
    return next();
  };
