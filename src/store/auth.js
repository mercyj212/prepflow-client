import { defineStore } from 'pinia';
import api, { setAccessToken } from '../api/axios';
import { getStoredUser } from '../utils/storage';

const persistUser = (user) => {
  const { token, ...safeUser } = user;
  localStorage.setItem('user', JSON.stringify(safeUser));
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser(),
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
        if (data.token) {
          this.user = data;
          setAccessToken(data.token);
          persistUser(data);
        }
        return data; 
      } catch (err) {
        if (err.response?.data?.serverDiagnostic && err.response.data.serverDiagnostic !== 'success') {
          console.error('️ DISPATCH WARNING:', err.response.data.serverDiagnostic);
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
        setAccessToken(data.token);
        persistUser(data);
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
        if (data.token) {
          this.user = {
            _id: data._id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            nickname: data.nickname,
            profilePicture: data.profilePicture,
            isVerified: true,
            token: data.token
          };
          setAccessToken(data.token);
          persistUser(this.user);
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
        this.error = err.response?.data?.message || 'Failed to resend code';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle(idToken) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/google', { idToken });
        this.user = data;
        setAccessToken(data.token);
        persistUser(data);
        return data;
      } catch (err) {
        console.error('[AUTH STORE][GOOGLE ERROR]:', err.response?.data || err.message);
        this.error = err.response?.data?.message || 'Google Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(formData) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put('/auth/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        this.user = {
          ...this.user,
          ...data
        };
        setAccessToken(data.token);
        persistUser(this.user);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Avatar upload failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateNickname(nickname) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put('/auth/profile/nickname', { nickname });
        this.user = {
          ...this.user,
          ...data
        };
        setAccessToken(data.token);
        persistUser(this.user);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Nickname update failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.warn('[AUTH] Backend logout failed or already logged out', err);
      } finally {
        this.user = null;
        setAccessToken(null);
        localStorage.removeItem('user');
      }
    },
  },
});
