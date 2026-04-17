<template>
  <NeoCard variant="extruded" class="!rounded-[28px] p-8">
    <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-zinc-900 dark:border-white">
      <div>
        <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">
          {{ isEntrancePath ? 'Subject Management' : 'Course Management' }}
        </h2>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {{ isEntrancePath ? 'Define subjects for specific exam years' : 'Manage courses within departments' }}
        </p>
      </div>
    </div>

    <!-- Filters & Create Form -->
    <div class="space-y-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          v-model="selectedFaculty"
          @change="onFacultyChange"
          class="h-12 px-4 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white"
        >
          <option value="" disabled>Choose {{ isEntrancePath ? 'Exam Title' : 'Faculty' }}</option>
          <option v-for="fac in faculties" :key="fac._id" :value="fac._id">
            {{ fac.name }}
          </option>
        </select>

        <select
          v-model="selectedDepartment"
          @change="fetchCourses"
          :disabled="!selectedFaculty"
          class="h-12 px-4 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white disabled:opacity-40"
        >
          <option value="" disabled>Choose {{ isEntrancePath ? 'Year' : 'Department' }}</option>
          <option v-for="dept in departments" :key="dept._id" :value="dept._id">
            {{ dept.name }}
          </option>
        </select>
      </div>

      <form @submit.prevent="handleCreate" class="flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="newName"
            :disabled="!selectedDepartment"
            :placeholder="isEntrancePath ? 'Subject Name (e.g. Mathematics)' : 'Course Title (e.g. Bio-Chemistry)'"
            class="flex-1 h-12 px-5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white disabled:opacity-40"
          />
          <select
            v-model="newLevel"
            :disabled="!selectedDepartment"
            class="h-12 px-4 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white disabled:opacity-40 min-w-[120px]"
          >
            <option value="" disabled>Level</option>
            <option v-for="l in availableLevels" :key="l" :value="l">{{ l }}</option>
          </select>
          <button
            type="submit"
            :disabled="!newName.trim() || !selectedDepartment || loading"
            class="h-12 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus :size="14" />
            Add
          </button>
        </div>
        <p v-if="detectedLevelNote" class="text-[9px] font-black text-brand uppercase tracking-widest ml-2 animate-pulse">
          Auto-detected: {{ detectedLevelNote }}
        </p>
      </form>
    </div>

    <!-- Course List -->
    <div v-if="!selectedDepartment" class="py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
      <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select a {{ isEntrancePath ? 'year' : 'department' }} to manage its {{ isEntrancePath ? 'subjects' : 'courses' }}</p>
    </div>

    <div v-else-if="courses.length === 0" class="py-12 text-center">
      <p class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">No {{ isEntrancePath ? 'subjects' : 'courses' }} created yet for this selection</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="course in courses"
        :key="course._id"
        class="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 group"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Book v-if="!isEntrancePath" :size="18" :stroke-width="1.5" class="text-emerald-500" />
            <GraduationCap v-else :size="18" :stroke-width="1.5" class="text-emerald-500" />
          </div>
          <div>
            <p class="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs">{{ course.title }}</p>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              {{ isEntrancePath ? 'Subject' : 'Course' }}
              <span v-if="course.level" class="w-1 h-1 rounded-full bg-zinc-300"></span>
              <span v-if="course.level" class="text-brand">{{ course.level }}</span>
            </p>
          </div>
        </div>
        <button
          @click="handleDelete(course._id)"
          class="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </NeoCard>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Trash2, Book, GraduationCap } from 'lucide-vue-next';
import api from '../../api/axios';
import NeoCard from '../common/NeoCard.vue';

const faculties = ref([]);
const departments = ref([]);
const courses = ref([]);
const selectedFaculty = ref('');
const selectedDepartment = ref('');
const newName = ref('');
const newLevel = ref('');
const detectedLevelNote = ref('');
const loading = ref(false);

const availableLevels = computed(() => {
  if (isEntrancePath.value) return ['JAMB', 'WAEC', 'NECO', 'POST-UTME'];
  const fac = faculties.value.find(f => f._id === selectedFaculty.value);
  if (fac?.path === 'polytechnic') return ['ND1', 'ND2', 'HND1', 'HND2'];
  return ['100L', '200L', '300L', '400L', '500L'];
});

// Intelligent Level Detection
watch(newName, (val) => {
  if (!val || isEntrancePath.value) {
    detectedLevelNote.value = '';
    return;
  }

  const fac = faculties.value.find(f => f._id === selectedFaculty.value);
  const isPoly = fac?.path === 'polytechnic';

  // Check for digits 1-5
  const match = val.match(/\d/);
  if (match) {
    const num = match[0];
    if (num === '1') {
      newLevel.value = isPoly ? 'ND1' : '100L';
      detectedLevelNote.value = newLevel.value;
    } else if (num === '2') {
      newLevel.value = isPoly ? 'ND2' : '200L';
      detectedLevelNote.value = newLevel.value;
    } else if (num === '3') {
      newLevel.value = isPoly ? 'HND1' : '300L';
      detectedLevelNote.value = newLevel.value;
    } else if (num === '4') {
      newLevel.value = isPoly ? 'HND2' : '400L';
      detectedLevelNote.value = newLevel.value;
    } else if (num === '5') {
       newLevel.value = '500L';
       detectedLevelNote.value = '500L';
    }
  } else {
    detectedLevelNote.value = '';
  }
});

// Default Level on Department Selection
watch(selectedDepartment, (val) => {
  if (val && !newLevel.value) {
    const fac = faculties.value.find(f => f._id === selectedFaculty.value);
    if (fac?.path === 'polytechnic') newLevel.value = 'ND1';
    else if (fac?.path === 'university') newLevel.value = '100L';
  }
});

const isEntrancePath = computed(() => {
  if (!selectedFaculty.value) return false;
  const fac = faculties.value.find(f => f._id === selectedFaculty.value);
  return fac?.path === 'entrance';
});

const fetchFaculties = async () => {
  try {
    const { data } = await api.get('/faculties');
    faculties.value = data;
  } catch (err) {
    console.error('[FAC_FETCH_ERR]:', err);
  }
};

const onFacultyChange = async () => {
  selectedDepartment.value = '';
  courses.value = [];
  if (!selectedFaculty.value) return;
  
  try {
    const { data } = await api.get(`/departments?faculty=${selectedFaculty.value}`);
    departments.value = data;
  } catch (err) {
    console.error('[DEPT_FETCH_ERR]:', err);
  }
};

const fetchCourses = async () => {
  if (!selectedDepartment.value) return;
  try {
    const { data } = await api.get(`/courses?department=${selectedDepartment.value}`);
    courses.value = data;
  } catch (err) {
    console.error('[COURSE_FETCH_ERR]:', err);
  }
};

const handleCreate = async () => {
  if (!newName.value.trim() || !selectedDepartment.value) return;
  loading.value = true;
  try {
    const fac = faculties.value.find(f => f._id === selectedFaculty.value);
    await api.post('/courses', { 
      title: newName.value.trim(), 
      department: selectedDepartment.value,
      level: newLevel.value || null,
      path: fac?.path || 'university'
    });
    newName.value = '';
    newLevel.value = '';
    detectedLevelNote.value = '';
    await fetchCourses();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create course');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this subject/course?')) return;
  try {
    await api.delete(`/courses/${id}`);
    await fetchCourses();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete');
  }
};

onMounted(fetchFaculties);
</script>
