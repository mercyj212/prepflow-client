<template>
  <div class="p-6 md:p-10 max-w-[1700px] mx-auto animate-fade-inShadow space-y-10">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="max-w-2xl">
        <h1 class="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
          Entrance Exams
        </h1>
        <p class="text-sm text-zinc-500 font-medium leading-relaxed">
          Manage specialized entrance examination content. Organize subjects and practice papers for bodies like JAMB, POST-UTME, and WAEC.
        </p>
      </div>
      
      <div class="flex gap-4 shrink-0">
        <button 
          @click="showCreator = !showCreator"
          class="h-12 md:h-14 px-6 md:px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus :size="16" />
          {{ showCreator ? 'Hide Creator' : 'Add Subject' }}
        </button>
      </div>
    </div>

    <!-- Creator (Repurposed CourseCreator for Entrance) -->
    <transition name="slide-up">
      <div v-if="showCreator" class="grid grid-cols-1 gap-8">
        <NeoCard variant="depressed" class="p-6 md:p-8 border-brand/20">
          <h2 class="text-xl font-black mb-6 md:mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-[11px]">
             <PencilLine :size="16" class="text-brand" />
             Create Entrance Subject
          </h2>
          <form @submit.prevent="handleCreateSubject" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Exam Body / Type</label>
                <select v-model="form.faculty" required class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm outline-none">
                  <option value="" disabled>Select Body (e.g. JAMB)</option>
                  <option v-for="f in entranceBodies" :key="f._id" :value="f._id">{{ f.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Subject Name</label>
                <input v-model="form.title" required type="text" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm outline-none" placeholder="e.g. Chemistry">
              </div>
            </div>
            
            <button type="submit" :disabled="loading" class="w-full h-12 md:h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl transition-all text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95">
              {{ loading ? 'Saving...' : 'Create Entrance Subject' }}
            </button>
          </form>
        </NeoCard>
      </div>
    </transition>

    <!-- Side-by-Side Management -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Exam Body / Selection -->
      <div class="lg:col-span-4 space-y-6">
        <NeoCard variant="extruded" class="p-6">
          <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
            <Layers :size="14" />
            1. Select Exam Body
          </h3>
          <div class="space-y-2">
            <button 
              v-for="body in entranceBodies" 
              :key="body._id"
              @click="selectedBody = body"
              class="w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group"
              :class="selectedBody?._id === body._id 
                ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-black' 
                : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-brand/50'"
            >
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full" :class="selectedBody?._id === body._id ? 'bg-zinc-400 dark:bg-zinc-500' : 'bg-zinc-300 dark:bg-zinc-700'"></span>
                <span class="text-sm font-bold">{{ body.name }}</span>
              </div>
              <ChevronRight :size="16" class="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </NeoCard>

        <!-- Exam Bodies Manager (Simple Add) -->
        <NeoCard variant="depressed" class="p-6 border-dashed">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Add Exam Body</h3>
          <form @submit.prevent="handleAddBody" class="flex gap-2">
            <input v-model="newBodyName" required placeholder="e.g. POST-UTME" class="flex-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none">
            <button class="px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs uppercase cursor-pointer hover:scale-105 active:scale-95 transition-all">Add</button>
          </form>
        </NeoCard>
      </div>

      <!-- Subjects Management -->
      <div class="lg:col-span-8">
        <NeoCard v-if="selectedBody" variant="extruded" class="p-5 md:p-8">
          <div class="flex items-center justify-between mb-6 md:mb-8">
            <div class="flex items-center gap-3 md:gap-4">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0">
                <ShieldCheck :size="20" md:size="24" class="text-white dark:text-black" />
              </div>
              <div>
                <h2 class="text-lg md:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{{ selectedBody.name }} Subjects</h2>
                <p class="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Manage papers and questions</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div v-for="sub in bodySubjects" :key="sub._id" class="p-4 md:p-6 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50 group hover:border-brand transition-all">
              <div class="flex items-start justify-between">
                <div class="min-w-0">
                  <h4 class="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{{ sub.title }}</h4>
                  <div class="flex items-center gap-2 md:gap-3">
                    <span class="text-[9px] md:text-[10px] font-black text-white bg-zinc-900 dark:bg-white dark:text-black uppercase tracking-widest px-2 py-0.5 rounded leading-none shrink-0">{{ sub.level || 'ENTRANCE' }}</span>
                    <span class="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                      <HelpCircle :size="10" />
                      {{ sub.quizCount || 0 }} Papers
                    </span>
                  </div>
                </div>
                <div class="flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="handleEdit(sub)" class="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Edit3 :size="14" /></button>
                  <button @click="handleDelete(sub._id)" class="p-1.5 text-zinc-400 hover:text-red-500"><Trash2 :size="14" /></button>
                </div>
              </div>
            </div>

            <div v-if="bodySubjects.length === 0" class="md:col-span-2 py-10 text-center border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl">
              <div class="w-12 h-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pencil :size="20" class="text-zinc-300" />
              </div>
              <p class="text-xs text-zinc-500 font-medium tracking-tight">No subjects found for {{ selectedBody.name }}</p>
              <button @click="showCreator = true" class="mt-4 text-[10px] font-black text-brand uppercase tracking-widest hover:underline">Add First Subject</button>
            </div>
          </div>
        </NeoCard>

        <div v-else class="h-full flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/10 rounded-[40px] border border-dashed border-zinc-200 dark:border-white/5">
           <div class="w-20 h-20 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl flex items-center justify-center mb-6">
              <ArrowLeft :size="32" class="text-zinc-300 animate-pulse" />
           </div>
           <h3 class="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2">Select an Exam Body</h3>
           <p class="text-xs text-zinc-500 max-w-xs mx-auto">Choose a body from the left sidebar to manage its subjects and practice tests.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Plus, PencilLine, Layers, ChevronRight, 
  ShieldCheck, HelpCircle, Edit3, Trash2, 
  ArrowLeft, Pencil 
} from 'lucide-vue-next';
import NeoCard from '../../components/common/NeoCard.vue';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';

const adminStore = useAdminStore();
const loading = ref(false);
const showCreator = ref(false);
const selectedBody = ref(null);
const newBodyName = ref('');

const form = ref({
  title: '',
  faculty: '',
  path: 'entrance'
});

const entranceBodies = computed(() => {
  return adminStore.courses
    .reduce((acc, c) => {
      if (c.path === 'entrance' && c.faculty && !acc.some(f => f._id === c.faculty._id)) {
        acc.push(c.faculty);
      }
      return acc;
    }, []);
});

// Since we mapping Faculty -> Body and Department -> Subject is complex with current structure,
// We will fetch specifically for entrance.
const bodySubjects = computed(() => {
  if (!selectedBody.value) return [];
  return adminStore.courses.filter(c => c.path === 'entrance' && c.faculty?._id === selectedBody.value._id);
});

const handleAddBody = async () => {
  try {
    await api.post('/faculties', { name: newBodyName.value, path: 'entrance' });
    await adminStore.fetchCoreData();
    newBodyName.value = '';
  } catch (err) {
    alert('Failed to add body');
  }
};

const handleCreateSubject = async () => {
  loading.value = true;
  try {
    await api.post('/courses', form.value);
    await adminStore.fetchCoreData();
    showCreator.value = false;
    form.value.title = '';
  } catch (err) {
    alert('Failed to create subject');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this subject?')) return;
  try {
    await api.delete(`/courses/${id}`);
    await adminStore.fetchCoreData();
  } catch (err) {
    alert('Delete failed');
  }
};

const handleEdit = (sub) => {
  alert('Edit coming soon');
};

onMounted(() => {
  adminStore.fetchCoreData();
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
