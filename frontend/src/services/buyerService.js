import api from './api';

export const getBuyers = async (params = {}) => {
  const response = await api.get('/buyers', { params });
  return response.data;
};

export const getBuyerById = async (id) => {
  const response = await api.get(`/buyers/${id}`);
  return response.data;
};

export const createBuyer = async (payload) => {
  const response = await api.post('/buyers', payload);
  return response.data;
};

export const updateBuyer = async (id, payload) => {
  const response = await api.put(`/buyers/${id}`, payload);
  return response.data;
};

export const deleteBuyer = async (id) => {
  const response = await api.delete(`/buyers/${id}`);
  return response.data;
};
