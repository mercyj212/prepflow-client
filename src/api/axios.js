import axios from 'axios';
import { getStoredUser } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  withCredentials: true,
});

const COLD_START_RETRY_DELAYS = [1200, 2500, 4500];
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);
const RETRYABLE_STATUSES = new Set([408, 425, 429, 502, 503, 504]);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableColdStartError = (error) => {
  const config = error.config || {};
  const method = (config.method || 'get').toLowerCase();
  const status = error.response?.status;

  if (config.skipColdStartRetry || !RETRYABLE_METHODS.has(method)) return false;
  if (!error.response) return true;
  return RETRYABLE_STATUSES.has(status);
};

api.interceptors.request.use((config) => {
  const user = getStoredUser();
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (originalRequest && isRetryableColdStartError(error)) {
      originalRequest._coldStartRetryCount = originalRequest._coldStartRetryCount || 0;
      const delay = COLD_START_RETRY_DELAYS[originalRequest._coldStartRetryCount];

      if (delay) {
        originalRequest._coldStartRetryCount += 1;
        await sleep(delay);
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
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
        const { data } = await axios.get(`${api.defaults.baseURL}/auth/refresh`, {
          withCredentials: true
        });

        const user = {
          ...(getStoredUser() || {}),
          ...data,
          token: data.token,
        };
        localStorage.setItem('user', JSON.stringify(user));

        onRefreshed(data.token);
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.warn('[SESSION EXPIRED]: Silent refresh failed, clearing local state.');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('prepflow:session-expired'));
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const warmUpApi = () => {
  return api.get('/health', {
    timeout: 15000,
    skipColdStartRetry: false
  }).catch((error) => {
    console.info('[API WARMUP]: Backend is still waking up.', error.message);
  });
};

export default api;
