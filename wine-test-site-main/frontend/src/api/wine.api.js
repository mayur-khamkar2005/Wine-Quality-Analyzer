import apiClient from './client.js';

export const createPrediction = async (payload) => {
  const response = await apiClient.post('/wines/predict', payload);
  return response.data;
};

export const getPredictionHistory = async ({
  page = 1,
  limit = 10,
  category,
} = {}) => {
  const response = await apiClient.get('/wines', {
    params: {
      page,
      limit,
      ...(category ? { category } : {}),
    },
  });

  return response.data;
};

export const getAllPredictionHistory = async ({
  limit = 200,
  category,
} = {}) => {
  const firstPageResponse = await getPredictionHistory({
    page: 1,
    limit,
    category,
  });
  const totalPages = Math.max(
    Number.parseInt(firstPageResponse?.data?.pagination?.pages, 10) || 1,
    1,
  );

  if (totalPages === 1) {
    return firstPageResponse;
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getPredictionHistory({
        page: index + 2,
        limit,
        category,
      }),
    ),
  );

  const allRecords = [
    ...(firstPageResponse?.data?.records || []),
    ...remainingResponses.flatMap((response) => response?.data?.records || []),
  ];

  return {
    ...firstPageResponse,
    data: {
      ...firstPageResponse.data,
      records: allRecords,
      pagination: {
        ...firstPageResponse?.data?.pagination,
        page: 1,
        pages: totalPages,
        total: Math.max(
          Number.parseInt(firstPageResponse?.data?.pagination?.total, 10) || 0,
          allRecords.length,
        ),
      },
    },
  };
};

export const getDashboardSummary = async () => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
};
