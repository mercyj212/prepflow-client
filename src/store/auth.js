import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://prepflow-server.onrender.com/api',
  timeout: 15000, // Enforce strict 15-second timeout to prevent infinite hangs
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && state.user.isVerified,
    token: (state) => state.user?.token,
  },
  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/register', userData);
        return data; 
      } catch (err) {
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('️ SMTP DISPATCH ERRROR:', err.response.data.serverDiagnostic);
        }
        this.error = err.response?.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async verifyOTP(email, otp) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Verification failed';
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
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('️ SMTP DISPATCH ERRROR:', err.response.data.serverDiagnostic);
        }
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async forgotPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Request failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(token, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put(`/auth/reset-password/${token}`, { password });
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Reset failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async verifyOTP(email, otp) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        // After verification, log the user in automatically if token is returned
        if (data.token) {
          // Fetch full user profile or store minimal info
          this.user = { ...this.user, isVerified: true, token: data.token };
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Verification failed';
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
