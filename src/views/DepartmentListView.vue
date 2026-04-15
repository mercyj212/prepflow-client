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
          Choose a department to access its courses and study materials.
        </p>
      </header>

      <!-- Loading -->
      <NeoLoader v-if="loading" label="Loading departments..." />

      <!-- Empty State -->
      <div v-else-if="departments.length === 0" class="py-32 text-center">
        <div class="w-16 h-16 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 shadow-neo-inner">
          <Layers :size="32" :stroke-width="1.2" class="text-zinc-300" />
        </div>
        <p class="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">No departments in this faculty yet.</p>
        <p class="text-[11px] text-zinc-400 mt-2">Ask your admin to configure departments.</p>
      </div>

      <!-- Department Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="dept in departments"
          :key="dept._id"
          @click="selectDepartment(dept._id)"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-8 h-full flex flex-col border-[0.5px] border-zinc-100 dark:border-white/5">
            <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500">
                <Layers :size="24" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
              </div>
              <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            
            <h3 class="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-zinc-500 transition-colors">
              {{ dept.name }}
            </h3>
            <p v-if="dept.description" class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
              {{ dept.description }}
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
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const loading = ref(true);
const departments = ref([]);
const facultyName = ref('');

const path = computed(() => route.params.path || 'university');
const facultyId = computed(() => route.params.facultyId);

const pathName = computed(() => {
  const names = { 'university': 'University', 'polytechnic': 'Polytechnic', 'entrance': 'Entrance Exams' };
  return names[path.value] || path.value;
});

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch faculty name
    const faculties = await quizStore.fetchFaculties(path.value);
    const fac = faculties.find(f => f._id === facultyId.value);
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
