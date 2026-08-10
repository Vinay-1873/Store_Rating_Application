import api from './api';

export const submitStoreRating = async (storeId, value) => {
  const response = await api.post('/ratings', { storeId, value });
  return response.data;
};