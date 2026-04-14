<template>
  <NeoAppShell>
    <div class="px-6 md:px-10 py-8 max-w-2xl mx-auto">

      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Settings</h1>
        <p class="text-[15px] font-medium text-slate-500 dark:text-zinc-500">Manage your account, appearance, and preferences.</p>
      </header>

      <!-- Profile Section -->
      <section class="mb-8">
        <h2 class="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Profile</h2>
        <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 flex flex-col gap-5 border border-white/20 dark:border-white/5">

          <!-- Avatar + Name -->
          <div class="flex items-center gap-5">
            <div class="relative w-16 h-16 rounded-full border-2 border-white/30 dark:border-white/10 shadow-md overflow-hidden bg-slate-200 cursor-pointer group flex-shrink-0" @click="triggerFileInput">
              <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
              <div class="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity" :class="isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
                <span v-if="isUploading" class="animate-spin text-white text-lg">⚙</span>
                <span v-else class="text-white text-lg">📷</span>
              </div>
              <input type="file" ref="fileInput" hidden accept="image/*" @change="handleAvatarUpload">
            </div>
            <div>
              <p class="text-[17px] font-semibold text-slate-800 dark:text-zinc-100">{{ authStore.user?.fullName || 'Student' }}</p>
              <p class="text-[13px] text-slate-500 dark:text-zinc-500">{{ authStore.user?.email }}</p>
              <button class="mt-1 text-[12px] text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors" @click="triggerFileInput">Change photo</button>
            </div>
          </div>

          <!-- Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Full Name</label>
              <div class="rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300">{{ authStore.user?.fullName || '—' }}</div>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Email</label>
              <div class="rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300 truncate">{{ authStore.user?.email || '—' }}</div>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Role</label>
              <div class="rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300 capitalize">{{ authStore.user?.role || 'student' }}</div>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Status</label>
              <div class="rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-[14px] flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span class="text-emerald-500 dark:text-emerald-400 font-medium">Verified & Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Appearance Section -->
      <section class="mb-8">
        <h2 class="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Appearance</h2>
        <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo p-6 border border-white/20 dark:border-white/5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[15px] font-semibold text-slate-800 dark:text-zinc-100 mb-0.5">Theme</p>
              <p class="text-[13px] text-slate-500 dark:text-zinc-500">Toggle between light and dark mode.</p>
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
              <p class="text-[15px] font-semibold text-slate-800 dark:text-zinc-100 mb-0.5">Sign Out</p>
              <p class="text-[13px] text-slate-500 dark:text-zinc-500">You will be redirected to the login page.</p>
            </div>
            <button @click="logout" class="px-5 py-2 rounded-xl text-[13px] font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200">
              Log Out
            </button>
          </div>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const authStore = useAuthStore();
const router = useRouter();

const fileInput = ref(null);
const isUploading = ref(false);

const avatarUrl = computed(() => {
  return authStore.user?.profilePicture || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.fullName || 'student'}`;
});

const triggerFileInput = () => {
  if (isUploading.value) return;
  fileInput.value.click();
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    await authStore.uploadAvatar(formData);
  } catch (error) {
    alert(error.message || 'Failed to upload image. File might be too large.');
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
