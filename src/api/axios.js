import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, 
  withCredentials: true, // Crucial for sending HttpOnly cookies
});

// 🛡️ REQUEST INTERCEPTOR: Attach token from localStorage
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// 🛡️ RESPONSE INTERCEPTOR: Silent Refresh Flow on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh via cookie
        const { data } = await axios.get(`${api.defaults.baseURL}/auth/refresh`, {
          withCredentials: true
        });

        // Update local storage user token
        const user = JSON.parse(localStorage.getItem('user')) || {};
        user.token = data.token;
        localStorage.setItem('user', JSON.stringify(user));

        // Let the rest of the application know token is refreshed
        onRefreshed(data.token);
        
        // Reset subcribers array
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.warn('[SESSION EXPIRED]: Silent refresh failed, clearing local state.');
        localStorage.removeItem('user');
        refreshSubscribers = [];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
