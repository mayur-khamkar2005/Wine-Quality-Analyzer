import { PUBLIC_USER_SELECT } from '../constants/projections.js';
import { User } from '../models/user.model.js';
import { WineRecord } from '../models/wineRecord.model.js';
import { toApiError } from '../utils/error.util.js';
import { serializeUser, serializeWineRecord } from '../utils/serializers.js';

const userLookupPipeline = (sourceField) => [
  {
    $lookup: {
      from: 'users',
      let: { userId: sourceField },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$userId'],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1,
            lastLoginAt: 1,
            updatedAt: 1,
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true,
    },
  },
];

export const getAdminOverview = async () => {
  try {
    const [totalUsers, recentUsers, overviewResult] = await Promise.all([
      User.countDocuments(),
      User.find()
        .select(PUBLIC_USER_SELECT)
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      WineRecord.aggregate([
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  totalPredictions: { $sum: 1 },
                  averageScore: { $avg: '$prediction.score' },
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
            topUsers: [
              {
                $group: {
                  _id: '$user',
                  predictionCount: { $sum: 1 },
                  averageScore: { $avg: '$prediction.score' },
                  lastPredictionAt: { $max: '$createdAt' },
                },
              },
              { $sort: { predictionCount: -1, lastPredictionAt: -1 } },
              { $limit: 5 },
              ...userLookupPipeline('$_id'),
              {
                $project: {
                  _id: 0,
                  userId: {
                    $cond: [
                      { $ifNull: ['$user._id', false] },
                      { $toString: '$user._id' },
                      null,
                    ],
                  },
                  name: '$user.name',
                  email: '$user.email',
                  role: '$user.role',
                  predictionCount: 1,
                  averageScore: { $round: ['$averageScore', 1] },
                  lastPredictionAt: 1,
                },
              },
            ],
            recentRecords: [
              { $sort: { createdAt: -1 } },
              { $limit: 8 },
              ...userLookupPipeline('$user'),
            ],
          },
        },
      ]),
    ]);

    const overview = overviewResult[0] || {};
    const stats = overview.stats?.[0] || {
      totalPredictions: 0,
      averageScore: 0,
    };

    return {
      stats: {
        totalUsers,
        totalPredictions: stats.totalPredictions || 0,
        averageScore: Number((stats.averageScore || 0).toFixed(1)),
      },
      categoryBreakdown: (overview.categoryBreakdown || []).map((item) => ({
        category: item._id,
        count: item.count,
      })),
      recentUsers: recentUsers.map((user) => serializeUser(user)),
      topUsers: overview.topUsers || [],
      recentRecords: (overview.recentRecords || []).map((record) =>
        serializeWineRecord(record),
      ),
    };
  } catch (error) {
    throw toApiError(error, {
      fallbackMessage: 'Failed to fetch admin overview',
    });
  }
};

export const getAdminUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      User.find()
        .select(PUBLIC_USER_SELECT)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    const userIds = users.map((user) => user._id);

    const userStats = userIds.length
      ? await WineRecord.aggregate([
          {
            $match: {
              user: { $in: userIds },
            },
          },
          {
            $group: {
              _id: '$user',
              predictionCount: { $sum: 1 },
              averageScore: { $avg: '$prediction.score' },
              lastPredictionAt: { $max: '$createdAt' },
            },
          },
        ])
      : [];

    const statsByUser = new Map(
      userStats.map((stat) => [
        stat._id.toString(),
        {
          predictionCount: stat.predictionCount,
          averageScore: Number((stat.averageScore || 0).toFixed(1)),
          lastPredictionAt: stat.lastPredictionAt || null,
        },
      ]),
    );

    return {
      users: users.map((user) => ({
        ...serializeUser(user),
        analytics: statsByUser.get(user._id.toString()) || {
          predictionCount: 0,
          averageScore: 0,
          lastPredictionAt: null,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error) {
    throw toApiError(error, {
      fallbackMessage: 'Failed to fetch admin users',
    });
  }
};

export const getAdminRecords = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  try {
    const [records, total] = await Promise.all([
      WineRecord.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', PUBLIC_USER_SELECT)
        .lean(),
      WineRecord.countDocuments(),
    ]);

    return {
      records: records.map((record) => serializeWineRecord(record)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error) {
    throw toApiError(error, {
      fallbackMessage: 'Failed to fetch admin records',
    });
  }
};
