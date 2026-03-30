import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://prepflow-server.onrender.com/api',
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    token: (state) => state.user?.token,
  },
  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/register', userData);
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/login', { email, password });
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
