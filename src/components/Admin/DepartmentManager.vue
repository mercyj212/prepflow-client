<template>
  <NeoCard variant="extruded" class="!rounded-[28px] p-8">
    <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-zinc-900 dark:border-white">
      <div>
        <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">
          {{ isEntrancePath ? 'Exam Years' : 'Departments' }}
        </h2>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {{ isEntrancePath ? 'Manage past question years' : 'Assign departments to faculties' }}
        </p>
      </div>
    </div>

    <!-- Create Form (Vertical for Sidebar) -->
    <form @submit.prevent="handleCreate" class="flex flex-col gap-3 mb-8">
      <div class="space-y-3">
        <input
          v-model="newName"
          :placeholder="isEntrancePath ? 'Year (e.g. 2024)' : 'Department name (e.g. Computer Science)'"
          class="w-full h-12 px-5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white"
        />
        <select
          v-model="selectedFaculty"
          class="w-full h-12 px-4 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-zinc-900 dark:text-white"
        >
          <option value="" disabled>Choose Faculty/Exam</option>
          <option v-for="fac in visibleFaculties" :key="fac._id" :value="fac._id">
            {{ fac.name }}
          </option>
        </select>
      </div>
      <button
        type="submit"
        :disabled="!newName.trim() || !selectedFaculty || loading"
        class="w-full h-12 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Plus :size="14" />
        Add {{ isEntrancePath ? 'Year' : 'Dept' }}
      </button>
    </form>

    <div v-if="schoolOfIctFaculty" class="mb-8 rounded-2xl border border-brand/10 bg-brand/5 p-5">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-2">School of ICT Setup</p>
          <p class="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Required departments: Computer Science for ND1/ND2, plus four HND specialization departments.
          </p>
        </div>
        <button
          type="button"
          @click="ensureIctDepartments"
          :disabled="missingIctDepartments.length === 0 || loading"
          class="h-11 px-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          {{ missingIctDepartments.length === 0 ? 'Structure Ready' : 'Create Missing' }}
        </button>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="dept in requiredIctDepartments"
          :key="dept"
          class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
          :class="hasIctDepartment(dept) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'"
        >
          {{ dept }}
        </span>
      </div>
    </div>

    <!-- Department List -->
    <div v-if="departments.length === 0" class="py-12 text-center">
      <p class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">No departments created yet</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="dept in departments"
        :key="dept._id"
        class="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 group"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Calendar v-if="dept.faculty?.path === 'entrance'" :size="18" :stroke-width="1.5" class="text-cyan-500" />
            <Layers v-else :size="18" :stroke-width="1.5" class="text-cyan-500" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{{ dept.name }}</p>
              <div v-if="dept.name === 'Computer Science'" class="px-2 py-0.5 bg-brand/10 text-brand rounded-full text-[7px] font-black uppercase tracking-tighter flex items-center gap-1">
                <ShieldCheck :size="8" />
                <span>Standard Path</span>
              </div>
            </div>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {{ dept.faculty?.name || 'Unlinked' }} · {{ dept.faculty?.path || '—' }}
            </p>
          </div>
        </div>
        <button
          @click="handleDelete(dept._id)"
          class="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </NeoCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Layers, Trash2, Calendar, ShieldCheck } from 'lucide-vue-next';
import api from '../../api/axios';
import NeoCard from '../common/NeoCard.vue';
import { ICT_DEPARTMENT_GROUPS, normalizeName, visibleFaculties as getVisibleFaculties } from '../../utils/ictStructure';

const departments = ref([]);
const faculties = ref([]);
const newName = ref('');
const selectedFaculty = ref('');
const loading = ref(false);

const requiredIctDepartments = [
  ...ICT_DEPARTMENT_GROUPS.nd.departments,
  ...ICT_DEPARTMENT_GROUPS.hnd.departments
];

const visibleFaculties = computed(() => getVisibleFaculties(faculties.value));

const schoolOfIctFaculty = computed(() => {
  return faculties.value.find(f => normalizeName(f.name) === 'school of ict');
});

const schoolOfIctDepartments = computed(() => {
  const facultyId = schoolOfIctFaculty.value?._id;
  if (!facultyId) return [];
  return departments.value.filter(dept => (dept.faculty?._id || dept.faculty) === facultyId);
});

const hasIctDepartment = (name) => {
  const target = normalizeName(name);
  return schoolOfIctDepartments.value.some(dept => normalizeName(dept.name) === target);
};

const missingIctDepartments = computed(() => {
  return requiredIctDepartments.filter(name => !hasIctDepartment(name));
});

const isEntrancePath = computed(() => {
  if (!selectedFaculty.value) return false;
  const fac = faculties.value.find(f => f._id === selectedFaculty.value);
  return fac?.path === 'entrance';
});

const fetchAll = async () => {
  try {
    const [facRes, deptRes] = await Promise.all([
      api.get('/faculties'),
      api.get('/departments')
    ]);
    faculties.value = facRes.data;
    departments.value = deptRes.data;
  } catch (err) {
    console.error('[DEPT_FETCH_ERR]:', err);
  }
};

const handleCreate = async () => {
  if (!newName.value.trim() || !selectedFaculty.value) return;
  loading.value = true;
  try {
    await api.post('/departments', { name: newName.value.trim(), faculty: selectedFaculty.value });
    newName.value = '';
    await fetchAll();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create department');
  } finally {
    loading.value = false;
  }
};

const ensureIctDepartments = async () => {
  if (!schoolOfIctFaculty.value || missingIctDepartments.value.length === 0) return;
  loading.value = true;
  try {
    for (const name of missingIctDepartments.value) {
      await api.post('/departments', { name, faculty: schoolOfIctFaculty.value._id });
    }
    await fetchAll();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create ICT departments');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('Delete this department?')) return;
  try {
    await api.delete(`/departments/${id}`);
    await fetchAll();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete');
  }
};

onMounted(fetchAll);
</script>
