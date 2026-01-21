import axios from 'axios';
import { supabase } from './supabase';

const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid.
      // Sign out from supabase to clear client state and redirect to login
      await supabase.auth.signOut();
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);
