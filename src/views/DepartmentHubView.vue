<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
        <router-link to="/subjects" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Path</router-link>
        <span>/</span>
        <span class="text-zinc-900 dark:text-zinc-100">{{ pathTitle }}</span>
      </nav>

      <!-- Header Section -->
      <header class="mb-16">
        <h1 class="text-[42px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-4">
          Faculties
        </h1>
        <p class="text-[16px] font-normal text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
          Choose your faculty to explore its departments and available courses.
        </p>
      </header>

      <!-- Loading -->
      <NeoLoader v-if="loading" label="Loading faculties..." />

      <!-- Empty State -->
      <div v-else-if="visibleFaculties.length === 0" class="py-32 text-center">
        <div class="w-16 h-16 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 shadow-neo-inner">
          <Building2 :size="32" :stroke-width="1.2" class="text-zinc-300" />
        </div>
        <p class="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">No faculties available for this path yet.</p>
        <p class="text-[11px] text-zinc-400 mt-2">Ask your admin to set up the institution structure.</p>
      </div>

      <!-- Faculty Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="faculty in visibleFaculties"
          :key="faculty._id"
          @click="selectFaculty(faculty._id)"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-8 h-full flex flex-col border-[0.5px] border-zinc-100 dark:border-white/5">
            <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500">
                <Building2 :size="24" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
              </div>
              <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            
            <h3 class="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-zinc-500 transition-colors">
              {{ faculty.name }}
            </h3>
            <p v-if="faculty.description" class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
              {{ faculty.description }}
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
import { ArrowRight, Building2 } from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const loading = ref(true);
const faculties = ref([]);

const path = computed(() => route.params.path || quizStore.educationPath || 'university');

const visibleFaculties = computed(() => {
  const hasSchoolOfIct = faculties.value.some(f => f.name?.trim().toLowerCase() === 'school of ict');
  if (!hasSchoolOfIct) return faculties.value;
  return faculties.value.filter(f => f.name?.trim().toLowerCase() !== 'ict');
});

const pathTitle = computed(() => {
  const titles = { 'university': 'University', 'polytechnic': 'Polytechnic', 'entrance': 'Entrance Exams' };
  return titles[path.value] || 'Courses';
});

onMounted(async () => {
  loading.value = true;
  faculties.value = await quizStore.fetchFaculties(path.value);
  loading.value = false;
});

const selectFaculty = (facultyId) => {
  router.push(`/subjects/${path.value}/${facultyId}`);
};
</script>
