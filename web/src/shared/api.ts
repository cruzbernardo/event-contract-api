import axios from 'axios';
import { useAuthStore } from '../modules/auth/auth.store';

const baseURL = (globalThis as any).__API_URL__ || (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});


