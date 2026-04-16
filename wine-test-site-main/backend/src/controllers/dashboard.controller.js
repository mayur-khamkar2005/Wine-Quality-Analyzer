import { getDashboardSummary } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user._id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { summary },
        'Dashboard summary fetched successfully',
      ),
    );
});
