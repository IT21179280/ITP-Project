import api from './api';

export const getStaff = async (params = {}) => {
  const response = await api.get('/staff', { params });
  return response.data;
};

export const getStaffById = async (id) => {
  const response = await api.get(`/staff/${id}`);
  return response.data;
};

export const createStaff = async (payload) => {
  const response = await api.post('/staff', payload);
  return response.data;
};

export const updateStaff = async (id, payload) => {
  const response = await api.put(`/staff/${id}`, payload);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await api.delete(`/staff/${id}`);
  return response.data;
};
