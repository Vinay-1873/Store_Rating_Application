import api from './api';

export const getOwnerDashboard = async () => {
  const response = await api.get('/owner/dashboard');
  return response.data;
};