<template>
  <div class="p-6 md:p-10 max-w-[1700px] mx-auto animate-fade-inShadow space-y-10">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="max-w-2xl">
        <h1 class="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
          Course <span class="text-brand">Management</span>
        </h1>
        <div class="flex items-center gap-3 py-2 px-4 bg-brand/5 border border-brand/10 rounded-2xl w-fit mb-4">
          <ShieldCheck :size="16" class="text-brand" />
          <span class="text-[10px] font-black uppercase tracking-widest text-brand">Standardized Path: Polytechnic / School of ICT / Computer Science / ND1</span>
        </div>
        <p class="text-sm text-zinc-500 font-medium leading-relaxed">
          Manage academic materials for the standardized Computer Science ND1 curriculum. Dashboard is currently optimized for this controlled path.
        </p>
      </div>
      
      <button 
        @click="showCreator = !showCreator"
        class="h-14 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 shrink-0"
      >
        <Plus :size="18" />
        {{ showCreator ? 'Hide Creator' : 'Add New Course' }}
      </button>
    </div>

    <!-- Course Creator Section (Collapsible) -->
    <transition name="slide-up">
      <div v-if="showCreator" class="grid grid-cols-1 gap-8">
        <CourseCreator :loading="loading" @create="handleCreateCourse" />
      </div>
    </transition>

    <!-- Management Workspace -->
    <NeoCard variant="extruded" class="!rounded-[32px] overflow-hidden border-none">
      <!-- Filter Bar -->
      <div class="p-6 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Institution Type</label>
            <select v-model="filters.path" @change="onPathChange" class="w-full h-11 md:h-12 px-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none">
              <option value="">All Types</option>
              <option value="university">University</option>
              <option value="polytechnic">Polytechnic</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Faculty / School</label>
            <select v-model="filters.faculty" @change="onFacultyChange" :disabled="!filters.path" class="w-full h-11 md:h-12 px-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none disabled:opacity-40">
              <option value="">All Faculties</option>
              <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Department</label>
            <select v-model="filters.department" :disabled="!filters.faculty" class="w-full h-11 md:h-12 px-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none disabled:opacity-40">
              <option value="">All Departments</option>
              <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Academic Level</label>
            <select v-model="filters.level" :disabled="!filters.path" class="w-full h-11 md:h-12 px-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none disabled:opacity-40">
              <option value="">All Levels</option>
              <option v-for="l in availableLevels" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Course List Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-zinc-50/50 dark:bg-zinc-900/50">
              <th class="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-white/5">Course Information</th>
              <th class="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-white/5">Hierarchy</th>
              <th class="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-white/5">Status</th>
              <th class="px-6 md:px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="course in filteredCourses" :key="course._id" class="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-6 md:px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Book :size="18" class="text-zinc-500" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand transition-colors truncate max-w-[150px] md:max-w-none">{{ course.title }}</h4>
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{{ course.code || 'NO CODE' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 md:px-8 py-6">
                <div class="flex flex-col gap-1">
                  <span class="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 truncate max-w-[120px] md:max-w-none">{{ course.faculty?.name || 'No Faculty' }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-zinc-500">{{ course.path }}</span>
                    <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-brand/10 rounded text-brand">{{ course.level }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 md:px-8 py-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </td>
              <td class="px-6 md:px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="handleEdit(course)" class="p-2 md:p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    <Edit3 :size="15" />
                  </button>
                  <button @click="handleDelete(course._id)" class="p-2 md:p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-red-500 transition-all">
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCourses.length === 0">
              <td colspan="4" class="px-6 md:px-8 py-20 text-center">
                <div class="max-w-xs mx-auto">
                  <div class="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search :size="24" class="text-zinc-300" />
                  </div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-white mb-1">No courses found</h3>
                  <p class="text-xs text-zinc-500">Try adjusting your filters to find existing courses.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Book, Edit3, Trash2, Search, Filter, ShieldCheck } from 'lucide-vue-next';
import NeoCard from '../../components/common/NeoCard.vue';
import CourseCreator from '../../components/Admin/CourseCreator.vue';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';

const adminStore = useAdminStore();
const showCreator = ref(false);
const loading = ref(false);

const filters = ref({
  path: 'polytechnic',
  faculty: '',
  department: '',
  level: 'ND1'
});

const faculties = ref([]);
const departments = ref([]);

const filteredCourses = computed(() => {
  return adminStore.courses.filter(c => {
    if (c.path === 'entrance') return false; // Hide entrance exams in academic view
    if (filters.value.path && c.path !== filters.value.path) return false;
    if (filters.value.faculty && c.faculty?._id !== filters.value.faculty) return false;
    if (filters.value.department && c.department?._id !== filters.value.department) return false;
    if (filters.value.level && c.level !== filters.value.level) return false;
    return true;
  });
});

const availableLevels = computed(() => {
  if (filters.value.path === 'university') return ['100L', '200L', '300L', '400L', '500L'];
  if (filters.value.path === 'polytechnic') return ['ND1', 'ND2', 'HND1', 'HND2'];
  return [];
});

const onPathChange = async () => {
  if (filters.value.path) {
    try {
      const { data } = await api.get(`/faculties?path=${filters.value.path}`);
      faculties.value = data;
      
      // Auto-select School of ICT if it exists
      const ict = data.find(f => f.name.toLowerCase().includes('ict'));
      if (ict) {
        filters.value.faculty = ict._id;
        await onFacultyChange();
      }
    } catch (err) { faculties.value = []; }
  } else {
    faculties.value = [];
  }
};

const onFacultyChange = async () => {
  if (filters.value.faculty) {
    try {
      const { data } = await api.get(`/departments?faculty=${filters.value.faculty}`);
      departments.value = data;
      
      // Auto-select Computer Science if it exists
      const cs = data.find(d => d.name.toLowerCase().includes('computer science'));
      if (cs) {
        filters.value.department = cs._id;
      }
    } catch (err) { departments.value = []; }
  } else {
    departments.value = [];
  }
};

const handleCreateCourse = async (formData) => {
  loading.value = true;
  try {
    await api.post('/courses', formData);
    await adminStore.fetchCoreData();
    showCreator.value = false;
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create course');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this course?')) return;
  try {
    await api.delete(`/courses/${id}`);
    await adminStore.fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Delete failed');
  }
};

const handleEdit = (course) => {
  // Logic for opening edit modal/drawer
  alert('Edit logic coming soon');
};

onMounted(async () => {
  await adminStore.fetchCoreData();
  await onPathChange();
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
