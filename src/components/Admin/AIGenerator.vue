<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-2xl transition-all relative overflow-hidden group">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 dark:from-indigo-400/5 to-transparent pointer-events-none"></div>
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>
    
    <header class="mb-10 relative z-10 flex items-center justify-between">
      <div>
        <h2 class="text-[12px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-2">
          <div class="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          Generative AI Lab
        </h2>
        <p class="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-11">Synthesize academic assessments from raw data</p>
      </div>
      
      <div v-if="loading" class="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl animate-pulse">
        <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
        <span class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Processing Context...</span>
      </div>
    </header>

    <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Assessment Path</label>
          <div class="relative">
            <select v-model="form.quizId" required class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm appearance-none cursor-pointer">
              <option value="" disabled>Select destination quiz...</option>
              <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }} ({{ q.questions?.length || 0 }} Qs)</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Generation Depth</label>
          <div class="relative">
            <input v-model="form.count" required type="number" min="1" max="200" class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm">
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Questions</span>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Source Material Feed</label>
        <div class="group/textarea relative">
          <textarea v-model="form.material" 
            class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-[28px] px-8 py-6 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm h-48 font-mono resize-none leading-relaxed" 
            placeholder="Paste your lecture notes, documents, or curriculum data here..."></textarea>
          <div class="absolute bottom-6 right-8 text-[9px] font-black uppercase tracking-widest text-zinc-300 pointer-events-none group-focus-within/textarea:text-indigo-400 transition-colors">
            RAW TEXT FEED
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Visual & Document Context</label>
          <span class="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">{{ files.length }}/10 Slices Uplinked</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label v-if="files.length < 10" 
            class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[28px] cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all group/upload shrink-0 bg-transparent">
            <div class="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover/upload:scale-110 group-hover/upload:bg-indigo-500 group-hover/upload:text-white transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/upload:text-zinc-600 dark:group-hover/upload:text-zinc-300">Add Image/PDF</span>
            <input type="file" multiple accept="image/*,.pdf" class="hidden" @change="onFileChange" />
          </label>

          <div v-for="(f, i) in files" :key="i" 
            class="relative flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 rounded-[22px] group/file shadow-sm hover:shadow-md transition-all hover:border-indigo-500/30">
            <div class="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 text-xl">
              {{ f.type.includes('pdf') ? '📄' : '🖼️' }}
            </div>
            <div class="flex-1 min-w-0 pr-4">
              <p class="text-[10px] font-black text-zinc-600 dark:text-zinc-300 truncate uppercase tracking-widest">{{ f.name }}</p>
              <p class="text-[8px] font-bold text-zinc-400 uppercase">{{ (f.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
            <button @click="removeFile(i)" type="button" 
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/file:opacity-100 transition-all hover:scale-110 shadow-lg">
              &times;
            </button>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" :disabled="loading || !form.quizId" 
          class="w-full relative group/btn overflow-hidden bg-indigo-600 dark:bg-indigo-500 text-white font-black py-6 px-10 rounded-[28px] transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-50 disabled:grayscale">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] animate-gradient opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative flex justify-center items-center gap-4 text-[12px] uppercase tracking-[0.3em]">
            <svg v-if="!loading" class="w-5 h-5 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <div v-else class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Synthesizing...' : 'Execute AI Synthesis' }}</span>
          </div>
        </button>
        <p v-if="!form.quizId" class="text-center mt-4 text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Select a destination quiz to begin synthesis</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: Boolean,
  quizzes: Array
});

const emit = defineEmits(['generate']);

const form = ref({
  quizId: '',
  material: '',
  count: 60
});

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
  // Clear file list after start to signify processing if needed, 
  // though usually we keep it until success. Dashboard handles loading state.
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

