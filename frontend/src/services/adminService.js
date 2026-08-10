import api from './api';
export const getAdminStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};

export const getAllUsers = async (params) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getAllStores = async (params) => {
  const response = await api.get('/stores', { params });
  return response.data;
};

export const createStore = async (storeData) => {
  const response = await api.post('/stores', storeData);
  return response.data;
};