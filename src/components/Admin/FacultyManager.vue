<template>
  <NeoCard variant="extruded" class="!rounded-[28px] p-8">
    <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-zinc-900 dark:border-white">
      <div>
        <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">
          {{ newPath === 'entrance' ? 'Exam Titles' : 'Faculties' }}
        </h2>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {{ newPath === 'entrance' ? 'Manage entrance assessments' : 'Manage institution faculties by path' }}
        </p>
      </div>
    </div>

    <!-- Create Form (Vertical for Sidebar) -->
    <form @submit.prevent="handleCreate" class="flex flex-col gap-3 mb-8">
      <div class="space-y-3">
        <input
          v-model="newName"
          :placeholder="newPath === 'entrance' ? 'Exam Name (e.g. JAMB)' : 'Faculty name (e.g. Engineering)'"
          class="w-full h-12 px-5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white"
        />
        <select
          v-model="newPath"
          class="w-full h-12 px-4 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white"
        >
          <option value="" disabled>Select Path</option>
          <option value="university">University</option>
          <option value="polytechnic">Polytechnic</option>
          <option value="entrance">Entrance Exams</option>
        </select>
      </div>
      <button
        type="submit"
        :disabled="!newName.trim() || !newPath || loading"
        class="w-full h-12 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Plus :size="14" />
        Add {{ newPath === 'entrance' ? 'Exam' : 'Faculty' }}
      </button>
    </form>

    <!-- Faculty List -->
    <div v-if="faculties.length === 0" class="py-12 text-center">
      <p class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">No faculties created yet</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="fac in visibleFaculties"
        :key="fac._id"
        class="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 group"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Building2 :size="18" :stroke-width="1.5" class="text-amber-500" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{{ fac.name }}</p>
              <div v-if="fac.name === 'School of ICT'" class="px-2 py-0.5 bg-brand/10 text-brand rounded-full text-[7px] font-black uppercase tracking-tighter flex items-center gap-1">
                <ShieldCheck :size="8" />
                <span>Standard Path</span>
              </div>
            </div>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {{ fac.path === 'entrance' ? 'Exam Track' : fac.path }}
            </p>
          </div>
        </div>
        <button
          @click="handleDelete(fac._id)"
          class="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </NeoCard>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { Plus, Building2, Trash2, ShieldCheck } from 'lucide-vue-next';
import api from '../../api/axios';
import NeoCard from '../common/NeoCard.vue';

const faculties = ref([]);
const newName = ref('');
const newPath = ref('');
const loading = ref(false);

const visibleFaculties = computed(() => {
  const hasSchoolOfIct = faculties.value.some(f => f.name?.trim().toLowerCase() === 'school of ict');
  if (!hasSchoolOfIct) return faculties.value;
  return faculties.value.filter(f => f.name?.trim().toLowerCase() !== 'ict');
});

const fetchFaculties = async () => {
  try {
    const { data } = await api.get('/faculties');
    faculties.value = data;
  } catch (err) {
    console.error('[FAC_FETCH_ERR]:', err);
  }
};

const handleCreate = async () => {
  if (!newName.value.trim() || !newPath.value) return;
  loading.value = true;
  try {
    await api.post('/faculties', { name: newName.value.trim(), path: newPath.value });
    newName.value = '';
    await fetchFaculties();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create faculty');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this faculty? All its departments will also be removed.')) return;
  try {
    await api.delete(`/faculties/${id}`);
    await fetchFaculties();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete');
  }
};

onMounted(fetchFaculties);
</script>
