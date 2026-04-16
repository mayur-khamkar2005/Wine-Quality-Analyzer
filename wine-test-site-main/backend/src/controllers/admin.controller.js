import {
  getAdminOverview,
  getAdminRecords,
  getAdminUsers,
} from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (_req, res) => {
  const overview = await getAdminOverview();
  res
    .status(200)
    .json(
      new ApiResponse(200, { overview }, 'Admin overview fetched successfully'),
    );
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const users = await getAdminUsers({ page, limit });

  res
    .status(200)
    .json(new ApiResponse(200, users, 'Admin users fetched successfully'));
});

export const getRecords = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const records = await getAdminRecords({ page, limit });

  res
    .status(200)
    .json(new ApiResponse(200, records, 'Admin records fetched successfully'));
});
