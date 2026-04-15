<template>
  <div v-for="course in courses" :key="course._id" 
       class="bg-[var(--neo-surface)] border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden hover:shadow-neo-md transition-all duration-500 group mb-8">
    <div class="p-8 flex items-center gap-7">
      <div class="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white shadow-neo-inner transition-all duration-500">
        <svg class="w-7 h-7 text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-[19px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-none mb-3 group-hover:text-brand transition-colors">{{ course.title }}</h3>
        <p class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
          <span class="text-zinc-500 dark:text-zinc-500">{{ quizzesCount(course._id) }} Tests</span>
          <span class="w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full"></span>
          <span>{{ course.materials?.length || 0 }} Course Materials</span>
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button @click="emit('upload', course._id)" class="w-11 h-11 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-brand rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Upload Material">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </button>
        <button @click="emit('rename', course)" class="w-11 h-11 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Rename Course">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </button>
        <button @click="emit('delete', course._id)" class="w-11 h-11 bg-rose-50 dark:bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Delete Course">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Materials List -->
    <div v-if="course.materials?.length" class="px-8 pb-8 space-y-3">
      <div v-for="mat in course.materials" :key="mat._id" 
           @click="emit('preview', mat)"
           class="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group/mat shadow-neo-inner cursor-pointer hover:border-brand/30 transition-all">
        <div class="flex items-center gap-5 min-w-0">
          <span class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-neo shrink-0 text-xl">{{ mat.type === 'pdf' ? '📄' : '🖼️' }}</span>
          <div class="min-w-0">
            <p class="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-widest truncate">{{ mat.name }}</p>
            <a :href="mat.url" target="_blank" class="text-[9px] font-black text-brand hover:underline uppercase tracking-[0.2em] mt-1 inline-block">Open</a>
          </div>
        </div>
        <button @click.stop="emit('delete-material', course._id, mat._id)" 
                class="w-8 h-8 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover/mat:opacity-100 shadow-xl">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courses: Array,
  quizzes: Array
});

const emit = defineEmits(['upload', 'rename', 'delete', 'delete-material', 'preview']);

const quizzesCount = (courseId) => {
  return props.quizzes.filter(q => (q.course?._id || q.course) === courseId).length;
};
</script>
