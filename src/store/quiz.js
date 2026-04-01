import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null,
    mySubmissions: [],
  }),
  actions: {
    async fetchQuizzes() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/quizzes');
        this.quizzes = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch quizzes';
      } finally {
        this.loading = false;
      }
    },
    async fetchQuizById(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        this.currentQuiz = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch quiz';
      } finally {
        this.loading = false;
      }
    },
    async fetchStudyQuizById(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/quizzes/${id}/study`);
        this.currentQuiz = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch study quiz';
      } finally {
        this.loading = false;
      }
    },
    async submitQuiz(quizId, answers, timeTaken, totalQuestions) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/submissions', {
          quizId,
          answers,
          timeTaken,
          totalQuestions,
        });
        return data; // Return submission result
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to submit quiz';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchMySubmissions() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/submissions/my-submissions');
        this.mySubmissions = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch submissions';
      } finally {
        this.loading = false;
      }
    },
    async fetchAllSubmissions() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/submissions');
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch all submissions';
        return [];
      } finally {
        this.loading = false;
      }
    },
  },
});
