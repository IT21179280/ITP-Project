import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message:
          'Cannot reach the server. Please make sure the backend is running and the API URL is correct.',
        errors: {},
        status: 0,
      });
    }

    const data = error.response.data || {};

    return Promise.reject({
      message: data.message || 'Something went wrong. Please try again.',
      errors: data.errors || {},
      status: error.response.status,
    });
  }
);

export default api;
