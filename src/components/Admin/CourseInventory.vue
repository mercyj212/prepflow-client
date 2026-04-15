<template>
  <div v-for="course in courses" :key="course._id" 
       class="bg-[var(--neo-surface)] border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden hover:shadow-neo-md transition-all duration-500 group mb-8">
    <div class="p-8 flex items-center gap-7">
      <div class="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white shadow-neo-inner transition-all duration-500">
        <BookOpen :size="28" :stroke-width="1.2" class="text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
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
          <Plus :size="20" :stroke-width="2.5" />
        </button>
        <button @click="emit('rename', course)" class="w-11 h-11 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Rename Course">
          <Pencil :size="18" :stroke-width="2" />
        </button>
        <button @click="emit('delete', course._id)" class="w-11 h-11 bg-rose-50 dark:bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Delete Course">
          <Trash2 :size="18" :stroke-width="2" />
        </button>
      </div>
    </div>

    <!-- Materials List -->
    <div v-if="course.materials?.length" class="px-8 pb-8 space-y-3">
      <div v-for="mat in course.materials" :key="mat._id" 
           @click="emit('preview', mat)"
           class="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group/mat shadow-neo-inner cursor-pointer hover:border-brand/30 transition-all">
        <div class="flex items-center gap-5 min-w-0">
          <span class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-neo shrink-0">
            <template v-if="mat.type === 'pdf'">
              <FileText :size="18" :stroke-width="1.5" class="text-zinc-500" />
            </template>
            <template v-else>
              <Image :size="18" :stroke-width="1.5" class="text-zinc-500" />
            </template>
          </span>
          <div class="min-w-0">
            <p class="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-widest truncate">{{ mat.name }}</p>
            <a :href="mat.url" target="_blank" class="text-[9px] font-black text-brand hover:underline uppercase tracking-[0.2em] mt-1 inline-block">Open</a>
          </div>
        </div>
        <button @click.stop="emit('delete-material', course._id, mat._id)" 
                class="w-8 h-8 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover/mat:opacity-100 shadow-xl">
          <X :size="14" :stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, Plus, Pencil, Trash2, FileText, Image, X } from 'lucide-vue-next';

const props = defineProps({
  courses: Array,
  quizzes: Array
});

const emit = defineEmits(['upload', 'rename', 'delete', 'delete-material', 'preview']);

const quizzesCount = (courseId) => {
  return props.quizzes.filter(q => (q.course?._id || q.course) === courseId).length;
};
</script>
