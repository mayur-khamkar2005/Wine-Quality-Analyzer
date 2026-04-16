import {
  loginUser,
  registerUser,
} from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { serializeUser } from '../utils/serializers.js';

export const register = asyncHandler(async (req, res) => {
  const payload = await registerUser(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, payload, 'Account created successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const payload = await loginUser(req.body);
  res.status(200).json(new ApiResponse(200, payload, 'Login successful'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = serializeUser(req.user);
  res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Current user fetched successfully'));
});
