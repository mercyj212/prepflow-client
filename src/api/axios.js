import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, 
});

// 🛡️ REQUEST INTERCEPTOR: Attach token from localStorage
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// 🛡️ RESPONSE INTERCEPTOR: Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      console.warn('[SESSION EXPIRED]: Token rejected, clearing local state.');
      localStorage.removeItem('user');
      
      // Dynamic import to avoid circular dependency
      const { default: router } = await import('../router');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
