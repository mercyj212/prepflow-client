import { defineStore } from 'pinia';
import api from '../api/axios';

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNotesByCourse(courseId) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/notes/${courseId}`);
        this.notes = data;
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch notes';
        this.notes = [];
        return [];
      } finally {
        this.loading = false;
      }
    },
    clearNotes() {
      this.notes = [];
    }
  },
});
