import { defineStore } from 'pinia';
import api from '../api/axios';
import { useQuizStore } from './quiz';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    courses: [],
    quizzes: [],
    allSubmissions: [],
    totalStudents: 0,
    incomingScholars: [],
    loading: false,
    error: null,
  }),
  
  getters: {
    globalAverage: (state) => {
      if (state.allSubmissions.length === 0) return 0;
      const total = state.allSubmissions.reduce((acc, sub) => acc + ((sub.score / sub.totalQuestions) * 100), 0);
      return Math.round(total / state.allSubmissions.length);
    }
  },

  actions: {
    async fetchCoreData() {
      this.loading = true;
      this.error = null;
      try {
        const quizStore = useQuizStore();
        const [cRes, qRes, sCountRes, sListRes] = await Promise.all([
          api.get('/courses'),
          api.get('/quizzes'),
          api.get('/students/count'),
          api.get('/students')
        ]);
        
        this.courses = cRes.data;
        this.quizzes = qRes.data;
        this.totalStudents = sCountRes.data.count;
        this.incomingScholars = sListRes.data;
        
        const subsData = await quizStore.fetchAllSubmissions();
        this.allSubmissions = subsData || [];
      } catch (err) {
        console.error('[ADMIN_STORE_FETCH_ERR]:', err);
        this.error = err.response?.data?.message || 'Failed to fetch admin data';
      } finally {
        this.loading = false;
      }
    },
  }
});
