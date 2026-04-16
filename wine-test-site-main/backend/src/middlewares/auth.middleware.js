import jwt from 'jsonwebtoken';

import { PUBLIC_USER_SELECT } from '../constants/projections.js';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const authorizationHeader = req.headers.authorization || '';
  const parts = authorizationHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    throw new ApiError(401, 'Authentication token is missing or malformed');
  }

  const token = parts[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new ApiError(401, 'Authentication token is invalid or expired');
  }

  const user = await User.findById(decodedToken.userId)
    .select(PUBLIC_USER_SELECT)
    .lean();

  if (!user) {
    throw new ApiError(401, 'Authenticated user no longer exists');
  }

  req.user = user;
  return next();
});

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to access this resource'),
      );
    }

    return next();
  };
