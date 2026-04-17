<template>
  <NeoCard variant="depressed" class="p-8">
    <h2 class="text-xl font-semibold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-[11px] font-black">
      <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <ClipboardList :size="16" class="text-zinc-500" />
      </div>
      Add Practice Test
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Filter by Level</label>
          <div class="relative">
            <select v-model="form.level" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none appearance-none cursor-pointer">
              <option value="">All Levels</option>
              <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown :size="14" />
            </div>
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Select Course</label>
          <div class="relative">
            <select v-model="form.course" required class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none appearance-none cursor-pointer">
              <option value="" disabled>Select a course...</option>
              <option v-for="c in filteredCourses" :key="c._id" :value="c._id">{{ c.title }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown :size="14" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Test Title</label>
        <input v-model="form.title" required type="text" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none" placeholder="e.g. Mid-Term Assessment">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Time Limit (minutes)</label>
        <input v-model="form.timeLimit" type="number" min="1" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none">
      </div>
      <button type="submit" :disabled="loading" class="w-full h-14 bg-zinc-900 dark:bg-white hover:-translate-y-1 text-white dark:text-zinc-900 font-black rounded-2xl transition-all shadow-neo-pill disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span>{{ loading ? 'Creating Test...' : 'Create Test' }}</span>
        <ArrowRight v-if="!loading" :size="16" />
      </button>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ClipboardList, ArrowRight, ChevronDown } from 'lucide-vue-next';
import NeoCard from '../common/NeoCard.vue';

const props = defineProps({
  loading: Boolean,
  courses: Array
});

const emit = defineEmits(['create']);

const levels = ['100L', '200L', '300L', '400L', '500L', 'ND1', 'ND2', 'HND1', 'HND2', 'JAMB', 'WAEC', 'NECO', 'POST-UTME'];

const form = ref({
  course: '',
  level: '',
  title: '',
  timeLimit: 30
});

const filteredCourses = computed(() => {
  if (!form.value.level) return props.courses;
  return props.courses.filter(c => c.level === form.value.level);
});

const handleSubmit = () => {
  emit('create', { ...form.value });
  form.value = { course: '', level: '', title: '', timeLimit: 30 };
};
</script>
