<template>
  <NeoCard variant="depressed" class="p-8 border-brand/20 relative overflow-hidden">
    <!-- Context Indicator -->
    <div class="absolute top-0 right-0 px-6 py-2 bg-zinc-900 dark:bg-white rounded-bl-3xl">
       <span class="text-[10px] font-black text-white dark:text-zinc-900 uppercase tracking-widest">Creator 2.0</span>
    </div>

    <h2 class="text-xl font-black mb-10 flex items-center gap-3 text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
      <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
        <BookPlus :size="20" class="text-brand" />
      </div>
      Register New <span class="text-brand ml-2">Academic Course</span>
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-10">
      
      <!-- LAYER 01: Institutional Hierarchy (Dependent Chain) -->
      <section class="space-y-6">
        <div class="flex items-center gap-3 mb-4">
           <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
           <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">01. Hierarchy Positioning</span>
           <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Institution Type -->
          <div class="space-y-2 opacity-60">
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Institution Type (Locked)</label>
            <select v-model="form.path" required disabled class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none appearance-none cursor-not-allowed">
              <option value="polytechnic">Polytechnic</option>
            </select>
          </div>

          <!-- Faculty -->
          <div class="space-y-2 opacity-60">
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">School / Faculty (Locked)</label>
            <select v-model="form.faculty" required disabled class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none appearance-none cursor-not-allowed">
              <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
            </select>
          </div>

          <!-- Department -->
          <div class="space-y-2 opacity-60">
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Department (Locked)</label>
            <select v-model="form.department" required disabled class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none appearance-none cursor-not-allowed">
              <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
            </select>
          </div>

          <!-- Level -->
          <div class="space-y-2 opacity-60">
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Academic Level (Locked)</label>
            <select v-model="form.level" required disabled class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none appearance-none cursor-not-allowed">
              <option value="ND1">ND1</option>
            </select>
          </div>
        </div>
      </section>

      <!-- LAYER 02: Content Details -->
      <section class="space-y-6">
        <div class="flex items-center gap-3 mb-4">
           <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
           <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">02. Course Identification</span>
           <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Course Full Title</label>
            <input v-model="form.title" required type="text" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none" placeholder="e.g. Logic and Philosophy">
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Course Code</label>
            <input v-model="form.code" type="text" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none" placeholder="e.g. GST 101">
          </div>
        </div>

        <div>
           <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Short Description</label>
           <textarea v-model="form.description" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none h-24 resize-none" placeholder="Briefly describe what this course covers..."></textarea>
        </div>
      </section>

      <!-- Footer Actions -->
      <div class="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="form.notifyStudents" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            <span class="ml-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Broadcast to Students</span>
          </label>
        </div>

        <button type="submit" :disabled="loading" class="w-full md:w-auto min-w-[240px] h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl">
          <span>{{ loading ? 'Saving Information...' : 'Create Course Asset' }}</span>
          <ArrowRight v-if="!loading" :size="16" />
        </button>
      </div>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { BookPlus, ArrowRight } from 'lucide-vue-next';
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
  code: '',
  description: '',
  path: 'polytechnic',
  faculty: '',
  department: '',
  level: 'ND1',
  notifyStudents: false
});

const availableLevels = computed(() => {
  if (form.value.path === 'university') return ['100L', '200L', '300L', '400L', '500L'];
  if (form.value.path === 'polytechnic') return ['ND1', 'ND2', 'HND1', 'HND2'];
  return [];
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
      
      // Auto-set default level if empty
      if (!form.value.level) {
        if (form.value.path === 'polytechnic') form.value.level = 'ND1';
        else if (form.value.path === 'university') form.value.level = '100L';
      }
    } catch (err) { departments.value = []; }
  } else {
    departments.value = [];
  }
};

// Automatic level detection from course title/code
onMounted(async () => {
  if (form.value.path) {
    try {
      const { data } = await api.get(`/faculties?path=${form.value.path}`);
      faculties.value = data;
      
      const ict = data.find(f => f.name.toLowerCase().includes('ict'));
      if (ict) {
        form.value.faculty = ict._id;
        // Fetch departments
        const { data: dData } = await api.get(`/departments?faculty=${ict._id}`);
        departments.value = dData;
        const cs = dData.find(d => d.name.toLowerCase().includes('computer science'));
        if (cs) {
          form.value.department = cs._id;
        }
      }
    } catch (err) { console.error('Creator Setup Error:', err); }
  }
});

const handleSubmit = () => {
  const payload = { ...form.value };
  emit('create', payload);
  // Reset non-locked fields only
  form.value.title = '';
  form.value.code = '';
  form.value.description = '';
  form.value.notifyStudents = false;
};
</script>
