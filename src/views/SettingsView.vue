<template>
  <NeoAppShell>
    <div class="px-6 md:px-10 py-8 max-w-2xl mx-auto">

      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Settings</h1>
        <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Manage your account, appearance, and preferences.</p>
      </header>

      <!-- Profile Section -->
      <section class="mb-8">
        <h2 class="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Profile</h2>
        <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 flex flex-col gap-5 border border-white/20 dark:border-white/5">

          <!-- Avatar + Name -->
          <div class="flex items-center gap-6">
            <div class="relative flex-shrink-0">
              <!-- Backdrop for menu -->
              <div v-if="showAvatarMenu" class="fixed inset-0 z-[50]" @click="showAvatarMenu = false"></div>
              
              <div class="relative group cursor-pointer" @click="showAvatarMenu = !showAvatarMenu">
                <!-- Avatar Circle -->
                <div class="w-20 h-20 rounded-full border-4 border-white dark:border-white/10 shadow-lg overflow-hidden bg-zinc-200 transition-all group-hover:border-brand/40">
                  <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
                  
                  <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 :size="24" class="animate-spin text-white" />
                  </div>
                </div>

                <!-- Plus Badge (Right) -->
                <div class="absolute -right-1 bottom-2 w-7 h-7 bg-brand dark:bg-zinc-100 rounded-full border-4 border-[var(--neo-bg)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <svg class="w-3.5 h-3.5 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 5v14M5 12h14"></path></svg>
                </div>
              </div>

              <!-- Avatar Menu Dropdown -->
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2, X } from 'lucide-vue-next';
import { useAuthStore } from '../store/auth';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const authStore = useAuthStore();
const router = useRouter();

const fileInput = ref(null);
const isUploading = ref(false);
const showAvatarMenu = ref(false);
const previewModal = ref({ show: false, url: '', file: null, isViewing: false });

const avatarUrl = computed(() => {
  return authStore.user?.profilePicture || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.fullName || 'student'}`;
});

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
</script>
