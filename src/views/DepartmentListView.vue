<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
        <router-link to="/subjects" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Path</router-link>
        <span>/</span>
        <router-link :to="`/subjects/${path}`" class="hover:text-zinc-900 dark:hover:text-white transition-colors">{{ pathName }}</router-link>
        <span>/</span>
        <span class="text-zinc-900 dark:text-zinc-100">{{ facultyName }}</span>
      </nav>

      <!-- Header Section -->
      <header class="mb-16">
        <h1 class="text-[42px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-4">
          {{ facultyName }}
        </h1>
        <p class="text-[16px] font-normal text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
          {{ headerDescription }}
        </p>
      </header>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="p-8 h-48 rounded-[32px] border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
            <BaseSkeleton width="56px" height="56px" customClass="!rounded-[22px] mb-8" />
            <BaseSkeleton width="75%" height="24px" customClass="mb-3" />
            <BaseSkeleton width="50%" height="16px" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="visibleDepartments.length === 0" class="py-32 text-center">
        <div class="w-16 h-16 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 shadow-neo-inner">
          <Layers :size="32" :stroke-width="1.2" class="text-zinc-300" />
        </div>
        <p class="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">
          {{ path === 'entrance' ? 'No years found for this exam track.' : 'No departments in this faculty yet.' }}
        </p>
        <p class="text-[11px] text-zinc-400 mt-2">
          {{ path === 'entrance' ? 'Ask your admin to add exam years.' : 'Ask your admin to configure departments.' }}
        </p>
      </div>

      <!-- Department Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="dept in visibleDepartments"
          :key="dept._id"
          @click="selectDepartment(dept._id)"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-8 h-full flex flex-col border-[0.5px] border-zinc-100 dark:border-white/5">
            <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500">
                <span v-if="getDepartmentCard(dept)" class="text-[13px] font-black tracking-[0.1em] text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
                  {{ getDepartmentCard(dept).code }}
                </span>
                <Layers v-else :size="24" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
              </div>
              <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            
            <h3 class="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-zinc-500 transition-colors">
              {{ dept.name }}
            </h3>
            <div v-if="getDepartmentLevels(dept).length" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="level in getDepartmentLevels(dept)"
                :key="level"
                class="px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
              >
                {{ level }}
              </span>
            </div>
            <p class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
              {{ getDepartmentDescription(dept) }}
            </p>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight, Layers } from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import api from '../api/axios';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import {
  getIctDepartmentCard,
  getIctDepartmentLevels,
  isSchoolOfIct,
  sortIctDepartments
} from '../utils/ictStructure';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const loading = ref(true);
const departments = ref([]);
const facultyName = ref('');
const currentFaculty = ref(null);

const path = computed(() => route.params.path || 'university');
const facultyId = computed(() => route.params.facultyId);

const pathName = computed(() => {
  const names = { 'university': 'University', 'polytechnic': 'Polytechnic', 'entrance': 'Entrance Exams' };
  return names[path.value] || path.value;
});

const isIctFaculty = computed(() => isSchoolOfIct(currentFaculty.value));

const headerDescription = computed(() => {
  if (path.value === 'entrance') return 'Select an exam year to access subjects and past questions.';
  if (isIctFaculty.value) return 'Choose your ICT department. ND students use Computer Science, while HND students choose their specialization.';
  return 'Choose a department to access its courses and study materials.';
});

const visibleDepartments = computed(() => {
  return isIctFaculty.value ? sortIctDepartments(departments.value) : departments.value;
});

const getDepartmentCard = (dept) => {
  return isIctFaculty.value ? getIctDepartmentCard(dept) : null;
};

const getDepartmentLevels = (dept) => {
  return getDepartmentCard(dept)?.levels || [];
};

const getDepartmentDescription = (dept) => {
  return getDepartmentCard(dept)?.description || dept.description || 'Open this department to view courses and practice tests.';
};

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch faculty name
    const faculties = await quizStore.fetchFaculties(path.value);
    const fac = faculties.find(f => f._id === facultyId.value);
    currentFaculty.value = fac || null;
    facultyName.value = fac?.name || 'Faculty';

    // Fetch departments for this faculty
    departments.value = await quizStore.fetchDepartments(facultyId.value);
  } catch (err) {
    console.error('[DEPT_VIEW_ERR]:', err);
  } finally {
    loading.value = false;
  }
});

const selectDepartment = (deptId) => {
  router.push(`/subjects/${path.value}/${facultyId.value}/${deptId}`);
};
</script>
