<template>
  <NeoCard variant="depressed" class="p-10 relative overflow-hidden group">
    <!-- Background Ambient Glows -->
    <div class="absolute -right-20 -top-20 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

    <header class="mb-12 relative z-10 flex items-center justify-between">
      <div>
        <h2 class="text-[12px] font-black text-brand uppercase tracking-[0.4em] flex items-center gap-3 mb-2">
          <div class="p-2 bg-brand/10 rounded-xl">
            <Zap :size="20" />
          </div>
          Generative AI Lab
        </h2>
        <p class="text-[11px] font-black italic text-zinc-400 uppercase tracking-widest ml-12">AI Generation Settings</p>
      </div>
      
      <div v-if="loading" class="flex items-center gap-3 px-5 py-2.5 bg-brand/5 border border-brand/20 rounded-2xl animate-pulse">
        <span class="w-1.5 h-1.5 bg-brand rounded-full"></span>
        <span class="text-[9px] font-black text-brand uppercase tracking-[0.2em]">Processing...</span>
      </div>
    </header>

    <form @submit.prevent="handleSubmit" class="space-y-10 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Level Filter -->
        <div class="space-y-3">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Filter by Year/Track</label>
          <div class="relative">
            <select v-model="form.level" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-neo-inner appearance-none cursor-pointer">
              <option value="">All Levels</option>
              <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown :size="16" />
            </div>
          </div>
        </div>

        <div class="md:col-span-2 space-y-3">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Target Practice Test</label>
          <div class="relative">
            <select v-model="form.quizId" required class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-neo-inner appearance-none cursor-pointer">
              <option value="" disabled>Select a practice test...</option>
              <option v-for="q in filteredQuizzes" :key="q._id" :value="q._id">{{ formatQuizOption(q) }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown :size="16" />
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Num. Questions</label>
          <div class="relative">
            <input v-model="form.count" required type="number" min="1" max="200" class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-neo-inner">
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between ml-1">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Source Text</label>
          <button 
            v-if="form.material" 
            type="button" 
            @click="form.material = ''" 
            class="text-[9px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Trash2 :size="14" />
            Clear Text
          </button>
        </div>
        <div class="group/textarea relative">
          <textarea v-model="form.material" 
            class="w-full bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-[32px] px-8 py-8 text-[15px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-neo-inner h-56 font-mono resize-none leading-relaxed" 
            placeholder="Paste your study material here..."></textarea>
          <div class="absolute bottom-8 right-10 text-[9px] font-black uppercase tracking-widest text-zinc-300 pointer-events-none group-focus-within/textarea:text-brand transition-colors">
            Input Text
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div class="flex items-center justify-between px-1">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Upload Files</label>
          <span class="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{{ files.length }}/10 Files</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <label v-if="files.length < 10" 
            class="flex flex-col items-center justify-center p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] cursor-pointer hover:bg-brand/5 hover:border-brand/40 transition-all group/upload shrink-0 bg-transparent">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:bg-brand group-hover/upload:text-white shadow-neo transition-all">
              <Plus :size="24" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover/upload:text-brand">Add Files</span>
            <input type="file" multiple accept="image/*,.pdf" class="hidden" @change="onFileChange" />
          </label>

          <div v-for="(f, i) in files" :key="i" 
            class="relative flex items-center gap-4 p-5 bg-[var(--neo-bg)] border border-zinc-200 dark:border-zinc-800 rounded-[24px] group/file shadow-neo-inner hover:border-brand/40 transition-all h-[92px]">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-neo">
              <FileText v-if="f.type.includes('pdf')" :size="20" class="text-zinc-500" />
              <Image v-else :size="20" class="text-zinc-500" />
            </div>
            <div class="flex-1 min-w-0 pr-4">
              <p class="text-[10px] font-black text-zinc-800 dark:text-zinc-200 truncate uppercase tracking-widest">{{ f.name }}</p>
              <p class="text-[8px] font-bold text-zinc-400 uppercase">{{ (f.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
            <button @click="removeFile(i)" type="button" 
              class="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/file:opacity-100 transition-all hover:scale-110 shadow-xl z-20">
              <X :size="12" :stroke-width="2.5" />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-6">
        <button type="submit" :disabled="loading || !form.quizId" 
          class="w-full h-16 relative group/btn overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[28px] transition-all shadow-neo-pill disabled:opacity-50 disabled:grayscale">
          <div class="absolute inset-0 bg-brand/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          
          <div class="relative flex justify-center items-center gap-4 text-[12px] font-black uppercase tracking-[0.4em]">
            <Zap v-if="!loading" :size="20" class="group-hover/btn:rotate-12 transition-transform" />
            <div v-else class="w-5 h-5 border-3 border-zinc-500/30 border-t-brand rounded-full animate-spin"></div>
            <span>{{ loading ? 'Generating Questions...' : 'Generate Questions' }}</span>
          </div>
        </button>
        <p v-if="!form.quizId" class="text-center mt-5 text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] animate-pulse">Please select a test</p>
      </div>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Zap, ChevronDown, Trash2, Plus, FileText, Image, X } from 'lucide-vue-next';
import NeoCard from '../common/NeoCard.vue';

const props = defineProps({
  loading: Boolean,
  quizzes: Array
});

const emit = defineEmits(['generate']);

const levels = ['100L', '200L', '300L', '400L', '500L', 'ND1', 'ND2', 'HND1', 'HND2', 'JAMB', 'WAEC', 'NECO', 'POST-UTME'];

const form = ref({
  quizId: '',
  level: '',
  material: '',
  count: 60
});

const filteredQuizzes = computed(() => {
  const quizzes = form.value.level ? props.quizzes.filter(q => {
    const courseLevel = q.course?.level || '';
    return courseLevel === form.value.level;
  }) : props.quizzes;

  return [...quizzes].sort((a, b) => {
    const left = `${a.course?.department?.name || ''} ${a.title || ''}`;
    const right = `${b.course?.department?.name || ''} ${b.title || ''}`;
    return left.localeCompare(right);
  });
});

const formatQuizOption = (quiz) => {
  const level = quiz.course?.level || 'N/A';
  const department = quiz.course?.department?.name || 'No Department';
  return `${level} - ${department} - ${quiz.title}`;
};

const files = ref([]);

const onFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const remaining = 10 - files.value.length;
  files.value.push(...selectedFiles.slice(0, remaining));
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const handleSubmit = () => {
  if (!form.value.quizId) return;
  emit('generate', { ...form.value, files: files.value });
};
</script>

<style scoped>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  animation: gradient 3s ease infinite;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
</style>
