import { defineStore } from 'pinia';
import api from '../api/axios';

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
          console.error('️ SMTP DISPATCH ERROR:', err.response.data.serverDiagnostic);
        }
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
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('️ SMTP DISPATCH ERROR:', err.response.data.serverDiagnostic);
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
        // 🛡️ Added Diagnostic check for recovery emails
        if (data?.serverDiagnostic && data.serverDiagnostic !== 'success') {
          console.info('📡 RECOVERY DISPATCH WARNING:', data.serverDiagnostic);
        }
        return data;
      } catch (err) {
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('📡 RECOVERY DISPATCH ERROR:', err.response.data.serverDiagnostic);
        }
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
        
        // 🛡️ Log diagnostic for the Welcome Email dispatch
        if (data.serverDiagnostic && data.serverDiagnostic !== 'success') {
          console.info('ℹ️ WELCOME EMAIL DELAY:', data.serverDiagnostic);
        }

        if (data.token) {
          this.user = {
            _id: data._id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            isVerified: true,
            token: data.token
          };
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

    async resendOTP(email) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/resend-otp', { email });
        return data;
      } catch (err) {
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('️ SMTP DISPATCH ERROR:', err.response.data.serverDiagnostic);
        }
        this.error = err.response?.data?.message || 'Failed to resend code';
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
