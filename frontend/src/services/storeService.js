import api from './api';

export const getExploreStores = async (params) => {
  const response = await api.get('/stores/explore', { params });
  return response.data;
};