<template>
  <div v-for="course in courses" :key="course._id" 
       class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500 group mb-6">
    <div class="p-8 flex items-center gap-6">
      <div class="w-16 h-16 rounded-[22px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-all duration-500">
        <svg class="w-8 h-8 text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-2">{{ course.title }}</h3>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <span>{{ quizzesCount(course._id) }} Active Quizzes</span>
          <span class="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>{{ course.materials?.length || 0 }} Materials</span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="emit('upload', course._id)" class="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white rounded-[18px] transition-all" title="Upload Material">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
        </button>
        <button @click="emit('rename', course)" class="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white rounded-[18px] transition-all" title="Rename Course">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </button>
        <button @click="emit('delete', course._id)" class="p-3 bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-500 rounded-[18px] transition-all" title="Delete Course">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Materials List -->
    <div v-if="course.materials?.length" class="px-8 pb-8 space-y-3">
      <div v-for="mat in course.materials" :key="mat._id" 
           class="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 group/mat">
        <div class="flex items-center gap-4 min-w-0">
          <span class="text-xl shrink-0">{{ mat.type === 'pdf' ? '📄' : '🖼️' }}</span>
          <div class="min-w-0">
            <p class="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider truncate">{{ mat.name }}</p>
            <a :href="mat.url" target="_blank" class="text-[9px] font-bold text-indigo-500 hover:underline uppercase tracking-widest">View Resource</a>
          </div>
        </div>
        <button @click="emit('delete-material', course._id, mat._id)" 
                class="p-2 text-red-400 lg:text-zinc-300 hover:text-red-500 transition-colors opacity-100 lg:opacity-0 lg:group-hover/mat:opacity-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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

const emit = defineEmits(['upload', 'rename', 'delete', 'delete-material']);

const quizzesCount = (courseId) => {
  return props.quizzes.filter(q => (q.course?._id || q.course) === courseId).length;
};
</script>
