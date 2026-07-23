import { defineStore } from 'pinia';
import api from '../api/axios';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null,
    progressMetrics: null,
    publicStats: null,   // { totalQuestions, totalQuizzes }
    mySubmissions: [],
    educationPath: localStorage.getItem('educationPath') || null,
    selectedDepartment: null,
    selectedLevel: null,
    // ── Hierarchy State ──────────────────────────────────
    faculties: [],
    departments: [],
    courses: [],
  }),
  actions: {
    async fetchQuizzes(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (filters.department) params.append('department', filters.department);
        if (filters.level) params.append('level', filters.level);
        if (filters.path) params.append('path', filters.path);
        if (filters.course) params.append('course', filters.course);
        if (filters.courses) params.append('courses', filters.courses);
        const query = params.toString() ? `?${params.toString()}` : '';
        const { data } = await api.get(`/quizzes${query}`);
        this.quizzes = data;
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch quizzes';
        return [];
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
        return data; 
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
    async fetchProgressMetrics() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/submissions/progress');
        this.progressMetrics = data;
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch progress metrics';
      } finally {
        this.loading = false;
      }
    },
    async fetchPublicStats() {
      try {
        const { data } = await api.get('/quizzes/stats');
        this.publicStats = data;
        return data;
      } catch (err) {
        console.warn('[QUIZ_STORE] Could not fetch public stats:', err.message);
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
    async fetchLatestSubmission(quizId) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/submissions/quiz/${quizId}`);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch the latest result';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchSubmissionById(submissionId) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/submissions/${submissionId}`);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch the specific result';
        throw err;
      } finally {
        this.loading = false;
      }
    },


    // ── Hierarchy Actions ──────────────────────────────────
    async fetchFaculties(path) {
      if (this.faculties.length > 0 && (!path || this.faculties[0]?.path === path)) {
        return this.faculties;
      }
      try {
        const query = path ? `?path=${path}` : '';
        const { data } = await api.get(`/faculties${query}`);
        this.faculties = data;
        return data;
      } catch (err) {
        console.error('[FACULTIES_FETCH_ERR]:', err);
        return [];
      }
    },
    async fetchDepartments(facultyId) {
      const id = (facultyId && typeof facultyId === 'object') ? (facultyId._id || facultyId.id) : facultyId;
      if (this.departments.length > 0 && id) {
        const cachedFacultyId = typeof this.departments[0]?.faculty === 'object' 
          ? this.departments[0].faculty._id 
          : this.departments[0]?.faculty;
        if (cachedFacultyId === id) return this.departments;
      }
      try {
        const query = id ? `?faculty=${id}` : '';
        const { data } = await api.get(`/departments${query}`);
        this.departments = data;
        return data;
      } catch (err) {
        console.error('[DEPTS_FETCH_ERR]:', err);
        return [];
      }
    },
    async fetchCoursesByDepartment(departmentId, level) {
      try {
        const params = new URLSearchParams();
        if (departmentId) params.append('department', departmentId);
        if (level) params.append('level', level);
        const query = params.toString() ? `?${params.toString()}` : '';
        const { data } = await api.get(`/courses${query}`);
        this.courses = data;
        return data;
      } catch (err) {
        console.error('[COURSES_FETCH_ERR]:', err);
        return [];
      }
    },

    setEducationPath(path) {
      this.educationPath = path;
      localStorage.setItem('educationPath', path);
    },
    setDepartment(dept) {
      this.selectedDepartment = dept;
    },
    setLevel(level) {
      this.selectedLevel = level;
    }
  },
});

