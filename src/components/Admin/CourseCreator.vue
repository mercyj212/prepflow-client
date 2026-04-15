<template>
  <NeoCard variant="depressed" class="p-8">
    <h2 class="text-xl font-semibold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-[11px] font-black">
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <BookPlus :size="16" class="text-zinc-500" />
      </div>
      Initialize Course
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Conceptual Title</label>
        <input v-model="form.title" required type="text" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none" placeholder="e.g. Advanced Bio-Chemistry">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Executive Summary</label>
        <textarea v-model="form.description" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none h-24 resize-none" placeholder="Enter course overview..."></textarea>
      </div>

      <!-- Hierarchy Dropdowns -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Path</label>
          <select v-model="form.path" @change="onPathChange" class="w-full h-12 px-4 text-sm bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none text-zinc-900 dark:text-zinc-100 shadow-neo-inner">
            <option value="">Select Path</option>
            <option value="university">University</option>
            <option value="polytechnic">Polytechnic</option>
            <option value="entrance">Entrance Exams</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Faculty</label>
          <select v-model="form.faculty" @change="onFacultyChange" :disabled="!form.path" class="w-full h-12 px-4 text-sm bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none text-zinc-900 dark:text-zinc-100 shadow-neo-inner disabled:opacity-40">
            <option value="">{{ faculties.length ? 'Select Faculty' : (form.path ? 'No faculties' : 'Select path first') }}</option>
            <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Department</label>
          <select v-model="form.department" :disabled="!form.faculty" class="w-full h-12 px-4 text-sm bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none text-zinc-900 dark:text-zinc-100 shadow-neo-inner disabled:opacity-40">
            <option value="">{{ departments.length ? 'Select Department' : (form.faculty ? 'No departments' : 'Select faculty first') }}</option>
            <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Level</label>
        <select v-model="form.level" class="w-full h-12 px-4 text-sm bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none text-zinc-900 dark:text-zinc-100 shadow-neo-inner">
          <option value="">Select Level</option>
          <option v-for="l in availableLevels" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <div class="flex items-center gap-4 p-4 bg-[var(--neo-bg)] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-neo-inner transition-all">
        <div class="relative inline-flex items-center cursor-pointer">
          <input 
            id="notify-students" 
            v-model="form.notifyStudents" 
            type="checkbox" 
            class="w-5 h-5 rounded-md border-zinc-300 dark:border-zinc-700 text-brand focus:ring-brand/20 bg-white dark:bg-zinc-900"
          >
        </div>
        <label for="notify-students" class="text-[10px] font-black text-zinc-500 cursor-pointer select-none uppercase tracking-[0.2em] flex items-center gap-2">
          <span>Broadcast to Registry</span>
          <Bell :size="12" class="text-zinc-400" />
        </label>
      </div>
      <button type="submit" :disabled="loading" class="w-full h-14 bg-zinc-900 dark:bg-white hover:-translate-y-1 text-white dark:text-zinc-900 font-black rounded-2xl transition-all shadow-neo-pill disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span>{{ loading ? 'Establishing Protocol...' : 'Launch Curriculum' }}</span>
        <ArrowRight v-if="!loading" :size="16" />
      </button>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { BookPlus, Bell, ArrowRight } from 'lucide-vue-next';
import NeoCard from '../common/NeoCard.vue';
import api from '../../api/axios';

const props = defineProps({
  loading: Boolean
});

const emit = defineEmits(['create']);

const faculties = ref([]);
const departments = ref([]);

const form = ref({
  title: '',
  description: '',
  path: '',
  faculty: '',
  department: '',
  level: '',
  notifyStudents: false
});

const availableLevels = computed(() => {
  if (form.value.path === 'university') return ['100L', '200L', '300L', '400L', '500L'];
  if (form.value.path === 'polytechnic') return ['ND1', 'ND2', 'HND1', 'HND2'];
  return ['100L', '200L', '300L', '400L', '500L'];
});

const onPathChange = async () => {
  form.value.faculty = '';
  form.value.department = '';
  form.value.level = '';
  departments.value = [];
  if (form.value.path) {
    try {
      const { data } = await api.get(`/faculties?path=${form.value.path}`);
      faculties.value = data;
    } catch (err) { faculties.value = []; }
  } else {
    faculties.value = [];
  }
};

const onFacultyChange = async () => {
  form.value.department = '';
  if (form.value.faculty) {
    try {
      const { data } = await api.get(`/departments?faculty=${form.value.faculty}`);
      departments.value = data;
    } catch (err) { departments.value = []; }
  } else {
    departments.value = [];
  }
};

const handleSubmit = () => {
  const payload = {
    title: form.value.title,
    description: form.value.description,
    notifyStudents: form.value.notifyStudents,
  };
  if (form.value.department) payload.department = form.value.department;
  if (form.value.level) payload.level = form.value.level;
  if (form.value.path) payload.path = form.value.path;

  emit('create', payload);
  form.value = { title: '', description: '', path: '', faculty: '', department: '', level: '', notifyStudents: false };
  faculties.value = [];
  departments.value = [];
};
</script>
