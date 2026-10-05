// src/services/api.ts
import axios from 'axios';
import { getStoredSession } from '../utils/authToken';

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  // Attach whichever session is active (admin, mentor or mentee)
  const token = getStoredSession()?.token;

  if (token) {
    if (!config.headers) config.headers = {} as any;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn('[api] 401 Unauthorized - token missing or expired');
      // optional: emit an event or redirect to login here
    }
    return Promise.reject(err);
  }
);

export default api;
