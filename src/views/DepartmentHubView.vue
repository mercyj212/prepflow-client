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
          {{ hubTitle }}
        </h1>
        <p class="text-[16px] font-normal text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
          {{ hubDescription }}
        </p>
      </header>

      <!-- Department/Exam Body Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in items"
          :key="item.slug"
          @click="selectItem(item.slug)"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-8 h-full flex flex-col border-[0.5px] border-zinc-100 dark:border-white/5">
            <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-500">
                <component 
                  :is="getIconComponent(item.slug)" 
                  :size="24" 
                  :stroke-width="1.5"
                  class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors"
                />
              </div>
              <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            
            <h3 class="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-zinc-500 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
              {{ item.description }}
            </p>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowRight,
  Settings,
  FlaskConical,
  Stethoscope,
  Palette,
  Scale,
  BarChart3,
  FileText,
  GraduationCap,
  ScrollText,
  School
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const path = computed(() => route.params.path || quizStore.educationPath || 'university');

const pathTitle = computed(() => {
  const titles = { 'university': 'University', 'polytechnic': 'Polytechnic', 'entrance': 'Entrance Exams' };
  return titles[path.value] || 'Courses';
});

const hubTitle = computed(() => {
  return path.value === 'entrance' ? 'Exam Bodies' : 'Departments';
});

const hubDescription = computed(() => {
  return path.value === 'entrance' 
    ? 'Select an examination body to access specific subject past questions and mocks.'
    : 'Choose your department to find relevant courses and materials for your level.';
});

const items = computed(() => {
  if (path.value === 'entrance') {
    return [
      { title: 'JAMB', slug: 'jamb', description: 'Unified Tertiary Matriculation Examination (UTME) prep.' },
      { title: 'WAEC', slug: 'waec', description: 'West African Examinations Council senior school cert.' },
      { title: 'NECO', slug: 'neco', description: 'National Examinations Council senior school cert.' },
      { title: 'Post-UTME', slug: 'post-utme', description: 'University-specific entrance assessment materials.' }
    ];
  } else {
    return [
      { title: 'Engineering', slug: 'engineering', description: 'Civil, Mechanical, Electrical, and Systems Engineering.' },
      { title: 'Sciences', slug: 'sciences', description: 'Computer Science, Physics, Chemistry, and Biology.' },
      { title: 'Health Sciences', slug: 'health', description: 'Medicine, Pharmacy, Nursing, and Anatomy.' },
      { title: 'Arts & Humanities', slug: 'arts', description: 'English, History, Philosophy, and Fine Arts.' },
      { title: 'Social Sciences', slug: 'social', description: 'Economics, Psychology, Political Science, and Sociology.' },
      { title: 'Management', slug: 'management', description: 'Accounting, Business Admin, Finance, and Marketing.' }
    ];
  }
});

const getIconComponent = (slug) => {
  const iconMap = {
    'engineering': Settings,
    'sciences': FlaskConical,
    'health': Stethoscope,
    'arts': Palette,
    'social': Scale,
    'management': BarChart3,
    'jamb': FileText,
    'waec': GraduationCap,
    'neco': ScrollText,
    'post-utme': School
  };
  return iconMap[slug] || FileText;
};

const selectItem = (slug) => {
  quizStore.setDepartment(slug);
  router.push(`/subjects/${path.value}/${slug}`);
};
</script>
