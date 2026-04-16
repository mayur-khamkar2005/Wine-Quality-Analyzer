import {
  createPredictionRecord,
  getUserHistory,
} from '../services/wine.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createPrediction = asyncHandler(async (req, res) => {
  const record = await createPredictionRecord({
    userId: req.user._id,
    inputs: req.body,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { record }, 'Prediction generated successfully'),
    );
});

export const getHistory = asyncHandler(async (req, res) => {
  const { page, limit, category = '' } = req.query;

  const history = await getUserHistory({
    userId: req.user._id,
    page,
    limit,
    category,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, history, 'Prediction history fetched successfully'),
    );
});
