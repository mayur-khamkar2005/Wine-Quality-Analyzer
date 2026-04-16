import { USER_ROLES } from '../constants/roles.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { toApiError } from '../utils/error.util.js';
import { serializeUser } from '../utils/serializers.js';
import { generateAccessToken } from '../utils/token.js';

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    throw new ApiError(400, 'Name must be at least 2 characters long');
  }

  const existingUser = await User.findOne({ email: trimmedEmail })
    .select('_id')
    .lean();

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  try {
    const lastLoginAt = new Date();
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
      role: USER_ROLES.USER,
      lastLoginAt,
    });

    return {
      user: serializeUser(user),
      token: generateAccessToken(user),
    };
  } catch (error) {
    throw toApiError(error, {
      duplicateMessage: 'An account with this email already exists',
      fallbackMessage: 'Failed to create user',
    });
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const trimmedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: trimmedEmail }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  try {
    const lastLoginAt = new Date();
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt } });
    user.lastLoginAt = lastLoginAt;

    return {
      user: serializeUser(user),
      token: generateAccessToken(user),
    };
  } catch (error) {
    throw toApiError(error, {
      fallbackMessage: 'Failed to update login time',
    });
  }
};
