import apiClient from './client.js';

export const loginUser = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
