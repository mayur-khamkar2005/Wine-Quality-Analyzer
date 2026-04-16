import mongoose from 'mongoose';

import { ApiError } from '../utils/ApiError.js';
import { toApiError } from '../utils/error.util.js';
import { WineRecord } from '../models/wineRecord.model.js';
import { serializeWineRecord } from '../utils/serializers.js';

const toObjectId = (value) => new mongoose.Types.ObjectId(value.toString());

export const getDashboardSummary = async (userId) => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const normalizedUserId = toObjectId(userId);

  try {
    const [dashboardResult, recentPredictions] =
      await Promise.all([
        WineRecord.aggregate([
          { $match: { user: normalizedUserId } },
          {
            $facet: {
              stats: [
                {
                  $group: {
                    _id: null,
                    totalPredictions: { $sum: 1 },
                    averageScore: { $avg: '$prediction.score' },
                    bestScore: { $max: '$prediction.score' },
                  },
                },
              ],
              categoryBreakdown: [
                {
                  $group: {
                    _id: '$prediction.category',
                    count: { $sum: 1 },
                  },
                },
                { $sort: { count: -1, _id: 1 } },
              ],
              scoreTrend: [
                {
                  $group: {
                    _id: {
                      $dateToString: {
                        format: '%Y-%m',
                        date: '$createdAt',
                      },
                    },
                    averageScore: { $avg: '$prediction.score' },
                    count: { $sum: 1 },
                  },
                },
                { $sort: { _id: 1 } },
                {
                  $project: {
                    _id: 0,
                    label: '$_id',
                    averageScore: { $round: ['$averageScore', 1] },
                    count: 1,
                  },
                },
              ],
            },
          },
        ]),
        WineRecord.find({ user: normalizedUserId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    const dashboard = dashboardResult[0] || {};
    const stats = dashboard.stats?.[0] || {
      totalPredictions: 0,
      averageScore: 0,
      bestScore: 0,
    };

    return {
      stats: {
        totalPredictions: stats.totalPredictions,
        averageScore: Number((stats.averageScore || 0).toFixed(1)),
        bestScore: stats.bestScore || 0,
        mostCommonCategory: dashboard.categoryBreakdown?.[0]?._id || 'N/A',
        lastPredictionAt: recentPredictions[0]?.createdAt || null,
      },
      categoryBreakdown: (dashboard.categoryBreakdown || []).map((item) => ({
        category: item._id,
        count: item.count,
      })),
      scoreTrend: dashboard.scoreTrend || [],
      recentPredictions: recentPredictions.map((record) =>
        serializeWineRecord(record),
      ),
    };
  } catch (error) {
    throw toApiError(error, {
      fallbackMessage: 'Failed to fetch dashboard summary',
    });
  }
};
