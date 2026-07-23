<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-8 max-w-4xl mx-auto">

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Settings</h1>
        <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Manage your profile, theme, and course purchase history.</p>
      </header>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-4 mb-8 border-b border-zinc-200 dark:border-white/10 pb-3">
        <button
          @click="activeTab = 'profile'"
          class="flex items-center gap-2 text-sm font-bold pb-2 relative transition-colors"
          :class="activeTab === 'profile' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'"
        >
          <User :size="16" />
          Profile & Account
          <span v-if="activeTab === 'profile'" class="absolute bottom-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white rounded-t-full"></span>
        </button>

        <button
          @click="activeTab = 'transactions'"
          class="flex items-center gap-2 text-sm font-bold pb-2 relative transition-colors"
          :class="activeTab === 'transactions' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'"
        >
          <CreditCard :size="16" />
          Purchase & Billing History
          <span v-if="activeTab === 'transactions'" class="absolute bottom-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white rounded-t-full"></span>
        </button>
      </div>

      <!-- TAB 1: PROFILE & PREFERENCES -->
      <div v-if="activeTab === 'profile'">
        <!-- Profile Section -->
        <section class="mb-8">
          <h2 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Profile</h2>
          <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 flex flex-col gap-5 border border-white/20 dark:border-white/5">

            <!-- Avatar + Name -->
            <div class="flex items-center gap-6">
              <div class="relative flex-shrink-0">
                <div v-if="showAvatarMenu" class="fixed inset-0 z-[50]" @click="showAvatarMenu = false"></div>
                
                <div class="relative group cursor-pointer" @click="showAvatarMenu = !showAvatarMenu">
                  <div class="w-20 h-20 rounded-full border-4 border-white dark:border-white/10 shadow-lg overflow-hidden bg-zinc-200 transition-all group-hover:border-brand/40">
                    <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
                    
                    <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 :size="24" class="animate-spin text-white" />
                    </div>
                  </div>

                  <div class="absolute -right-1 bottom-2 w-7 h-7 bg-brand dark:bg-zinc-100 rounded-full border-4 border-[var(--neo-bg)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <svg class="w-3.5 h-3.5 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 5v14M5 12h14"></path></svg>
                  </div>
                </div>

                <div v-if="showAvatarMenu" class="absolute top-[85px] left-0 w-40 bg-white dark:bg-zinc-800 rounded-[16px] shadow-xl border border-zinc-100 dark:border-zinc-700 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <button @click="viewPhoto" class="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-xl text-[12px] font-bold text-zinc-700 dark:text-zinc-200 transition-colors">View Photo</button>
                  <button @click="triggerFileInput" class="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-xl text-[12px] font-bold text-zinc-700 dark:text-zinc-200 transition-colors">Change Photo</button>
                </div>

                <input type="file" ref="fileInput" hidden accept="image/*" @change="handleAvatarUpload">
              </div>
              <div>
                <p class="text-[17px] font-semibold text-zinc-800 dark:text-zinc-100">{{ authStore.user?.fullName || 'Student' }}</p>
                <p class="text-[13px] text-zinc-500 dark:text-zinc-500">{{ authStore.user?.email }}</p>
              </div>
            </div>

            <!-- Info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Full Name</label>
                <div class="rounded-xl px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-[14px] text-zinc-700 dark:text-zinc-300">{{ authStore.user?.fullName || '—' }}</div>
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Email</label>
                <div class="rounded-xl px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-[14px] text-zinc-700 dark:text-zinc-300 truncate">{{ authStore.user?.email || '—' }}</div>
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Role</label>
                <div class="rounded-xl px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-[14px] text-zinc-700 dark:text-zinc-300 capitalize">{{ authStore.user?.role || 'student' }}</div>
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Status</label>
                <div class="rounded-xl px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-[14px] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  <span class="text-emerald-500 dark:text-emerald-400 font-medium">Verified & Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Appearance Section -->
        <section class="mb-8">
          <h2 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Appearance</h2>
          <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 border border-white/20 dark:border-white/5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-0.5">Theme</p>
                <p class="text-[13px] text-zinc-500 dark:text-zinc-500">Toggle between light and dark mode.</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section>
          <h2 class="text-[11px] font-bold text-rose-400/70 uppercase tracking-widest mb-4">Danger Zone</h2>
          <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 border border-rose-500/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-0.5">Sign Out</p>
                <p class="text-[13px] text-zinc-500 dark:text-zinc-500">You will be redirected to the homepage.</p>
              </div>
              <button @click="logout" class="px-5 py-2 rounded-xl text-[13px] font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200">
                Log Out
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- TAB 2: PURCHASE & BILLING HISTORY -->
      <div v-else-if="activeTab === 'transactions'" class="space-y-6">
        
        <!-- Summary Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-[var(--neo-surface)] p-5 rounded-[22px] shadow-neo border border-white/20 dark:border-white/5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Spent</span>
              <div class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle :size="16" />
              </div>
            </div>
            <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">₦{{ totalSpent.toLocaleString() }}</p>
          </div>

          <div class="bg-[var(--neo-surface)] p-5 rounded-[22px] shadow-neo border border-white/20 dark:border-white/5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Unlocked Courses</span>
              <div class="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                <BookOpen :size="16" />
              </div>
            </div>
            <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">{{ successCount }} Course{{ successCount === 1 ? '' : 's' }}</p>
          </div>

          <div class="bg-[var(--neo-surface)] p-5 rounded-[22px] shadow-neo border border-white/20 dark:border-white/5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pending Verification</span>
              <div class="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <AlertCircle :size="16" />
              </div>
            </div>
            <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">{{ pendingCount }} Attempt{{ pendingCount === 1 ? '' : 's' }}</p>
          </div>
        </div>

        <!-- Filter & Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <h2 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Transaction Records</h2>
          
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              v-for="filter in ['all', 'success', 'pending', 'failed']"
              :key="filter"
              @click="statusFilter = filter"
              class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all capitalize border shrink-0"
              :class="statusFilter === filter 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-transparent hover:text-zinc-900 dark:hover:text-white'"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingTransactions" class="py-16 text-center">
          <Loader2 class="mx-auto animate-spin text-zinc-400 mb-3" :size="36" />
          <p class="text-xs font-black uppercase tracking-widest text-zinc-400">Loading purchase records...</p>
        </div>

        <!-- Empty Transactions State -->
        <div v-else-if="filteredTransactions.length === 0" class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-10 text-center border border-white/20 dark:border-white/5">
          <CreditCard class="mx-auto mb-4 text-zinc-300 dark:text-zinc-600" :size="48" />
          <h3 class="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">No Transactions Found</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            {{ statusFilter === 'all' ? 'You have not made any course purchases yet.' : `No transactions found matching filter "${statusFilter}".` }}
          </p>
          <router-link to="/subjects" class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition">
            Browse Courses
          </router-link>
        </div>

        <!-- Transaction Cards List -->
        <div v-else class="space-y-4">
          <div
            v-for="tx in filteredTransactions"
            :key="tx._id"
            class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 border border-white/20 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div class="flex items-start gap-4 min-w-0">
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm mt-0.5"
                :class="{
                  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': tx.status === 'success',
                  'bg-amber-500/10 text-amber-600 border-amber-500/20': tx.status === 'pending',
                  'bg-rose-500/10 text-rose-600 border-rose-500/20': tx.status === 'failed'
                }"
              >
                <CheckCircle v-if="tx.status === 'success'" :size="22" />
                <Clock v-else-if="tx.status === 'pending'" :size="22" />
                <XCircle v-else :size="22" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 class="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {{ tx.course?.title || 'Unknown Course' }}
                  </h3>
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800': tx.status === 'success',
                      'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800': tx.status === 'pending',
                      'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800': tx.status === 'failed'
                    }"
                  >
                    {{ tx.status }}
                  </span>
                </div>

                <p class="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Ref: <span class="font-mono font-bold text-zinc-700 dark:text-zinc-300">{{ tx.reference }}</span> · {{ formatDate(tx.paidAt || tx.createdAt) }}
                </p>

                <div v-if="tx.course?.level" class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    {{ tx.course.level }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Amount & Actions -->
            <div class="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5 shrink-0">
              <div class="text-left md:text-right">
                <span class="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount</span>
                <span class="text-lg font-black text-zinc-900 dark:text-zinc-100 whitespace-nowrap">₦{{ Number(tx.amount || 1000).toLocaleString() }}</span>
              </div>

              <!-- Action Buttons -->
              <div>
                <button
                  v-if="tx.status === 'success'"
                  @click="openCourse(tx.course)"
                  class="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  Open Course
                  <ArrowRight :size="14" />
                </button>

                <button
                  v-else
                  @click="reverifyPayment(tx)"
                  :disabled="reverifyingRef === tx.reference"
                  class="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-amber-600 transition flex items-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
                >
                  <Loader2 v-if="reverifyingRef === tx.reference" class="animate-spin" :size="14" />
                  <RefreshCw v-else :size="14" />
                  Re-verify
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- 🖼️ SETTINGS PROFILE PREVIEW MODAL -->
    <div v-if="previewModal.show" class="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        <div class="px-8 py-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-1">
              {{ previewModal.isViewing ? 'Profile Photo' : 'Appearance Check' }}
            </h2>
            <p class="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ previewModal.isViewing ? 'Current Look' : 'New Profile Preview' }}
            </p>
          </div>
          <button @click="closePreview" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">
            <X :size="20" />
          </button>
        </div>

        <div class="p-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div class="w-48 h-48 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden relative group">
            <img :src="previewModal.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 shadow-inner pointer-events-none"></div>
          </div>
        </div>

        <div class="p-8 border-t border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4">
          <template v-if="previewModal.isViewing">
            <button @click="closePreview" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all">
              Close
            </button>
          </template>
          <template v-else>
            <button @click="closePreview" class="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] transition-all">
              Cancel
            </button>
            <button @click="confirmAvatarUpload" 
              :disabled="isUploading"
              class="flex-[2] py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all disabled:opacity-50">
              {{ isUploading ? 'Uploading...' : 'Confirm New Look' }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  User, 
  CreditCard, 
  CheckCircle, 
  BookOpen, 
  AlertCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Loader2, 
  X 
} from 'lucide-vue-next';
import api from '../api/axios';
import { useAuthStore } from '../store/auth';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab === 'transactions' ? 'transactions' : 'profile');

// Profile & Avatar State
const fileInput = ref(null);
const isUploading = ref(false);
const showAvatarMenu = ref(false);
const previewModal = ref({ show: false, url: '', file: null, isViewing: false });

// Transactions State
const transactions = ref([]);
const loadingTransactions = ref(false);
const statusFilter = ref('all');
const reverifyingRef = ref(null);

const avatarUrl = computed(() => {
  return authStore.user?.profilePicture || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.fullName || 'student'}`;
});

// Transactions Computations
const filteredTransactions = computed(() => {
  if (statusFilter.value === 'all') return transactions.value;
  return transactions.value.filter(t => t.status === statusFilter.value);
});

const totalSpent = computed(() => {
  return transactions.value
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + Number(t.amount || 1000), 0);
});

const successCount = computed(() => transactions.value.filter(t => t.status === 'success').length);
const pendingCount = computed(() => transactions.value.filter(t => t.status === 'pending').length);

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fetchTransactions = async () => {
  loadingTransactions.value = true;
  try {
    const { data } = await api.get('/payments/history');
    transactions.value = data || [];
  } catch (error) {
    console.error('[FETCH_TRANSACTIONS_ERR]:', error);
  } finally {
    loadingTransactions.value = false;
  }
};

const reverifyPayment = async (tx) => {
  reverifyingRef.value = tx.reference;
  try {
    const { data } = await api.get(`/payments/verify/${tx.reference}`);
    if (data && (data.message?.includes('successful') || data.message?.includes('verified'))) {
      tx.status = 'success';
      alert('Payment Verified! Your course has been unlocked.');
    } else {
      alert('Paystack transaction still pending or not completed.');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Could not verify transaction with Paystack.');
  } finally {
    reverifyingRef.value = null;
  }
};

const openCourse = (course) => {
  if (!course) {
    router.push('/subjects');
    return;
  }
  const path = course.path || course.department?.faculty?.path || 'polytechnic';
  const facultyId = course.department?.faculty?._id || course.department?.faculty;
  const departmentId = course.department?._id || course.department;

  if (path && facultyId && departmentId) {
    router.push(`/subjects/${path}/${facultyId}/${departmentId}`);
  } else {
    router.push('/subjects');
  }
};

const triggerFileInput = () => {
  if (isUploading.value) return;
  showAvatarMenu.value = false;
  fileInput.value.click();
};

const viewPhoto = () => {
  showAvatarMenu.value = false;
  previewModal.value = {
    show: true,
    url: avatarUrl.value,
    file: null,
    isViewing: true
  };
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  previewModal.value = {
    show: true,
    url: URL.createObjectURL(file),
    file: file
  };
};

const closePreview = () => {
  if (previewModal.value.url) URL.revokeObjectURL(previewModal.value.url);
  previewModal.value.show = false;
  if (fileInput.value) fileInput.value.value = '';
};

const confirmAvatarUpload = async () => {
  const { file } = previewModal.value;
  if (!file) return;

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    await authStore.uploadAvatar(formData);
    closePreview();
  } catch (error) {
    alert(error.message || 'Failed to upload image.');
  } finally {
    isUploading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  fetchTransactions();
});
</script>
