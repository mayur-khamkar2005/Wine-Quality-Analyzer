import apiClient from './client.js';

export const getAdminOverview = async () => {
  const response = await apiClient.get('/admin/overview');
  return response.data;
};

export const getAdminUsers = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/admin/users', {
    params: { page, limit },
  });

  return response.data;
};

export const getAdminRecords = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/admin/records', {
    params: { page, limit },
  });

  return response.data;
};
