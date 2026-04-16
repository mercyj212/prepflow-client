<template>
  <NeoAppShell>
    <div class="px-4 md:px-10 py-10 max-w-3xl mx-auto">

      <!-- Header -->
      <header class="mb-10 flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
            <span class="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Inbox</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Notifications</h1>
          <p class="text-[14px] text-zinc-500 mt-1">Updates on your progress, results, and study reminders.</p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="shrink-0 mt-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          Mark all read
        </button>
      </header>

      <!-- Unread Badge -->
      <div v-if="unreadCount > 0 && !loading" class="mb-6 flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-brand/10 text-brand text-[11px] font-black uppercase tracking-widest">
          {{ unreadCount }} unread
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-7 h-7 border-4 border-zinc-200 border-t-brand rounded-full animate-spin"></div>
        <p class="text-sm text-zinc-400 font-medium">Loading your notifications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16 text-center">
        <NeoCard variant="depressed" class="p-10">
          <AlertTriangle :size="32" class="text-rose-400 mx-auto mb-4" />
          <p class="text-zinc-500 text-sm">{{ error }}</p>
        </NeoCard>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="py-24 flex flex-col items-center justify-center text-center opacity-50">
        <div class="w-16 h-16 rounded-[20px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5 shadow-neo-inner">
          <Inbox :size="30" class="text-zinc-400" />
        </div>
        <p class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400">You're all caught up</p>
        <p class="text-[13px] text-zinc-500 mt-1">No notifications yet. Come back after you take a quiz!</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          @click="handleNotificationClick(notif)"
          class="relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:border-brand/30 hover:shadow-md"
          :class="notif.read
            ? 'bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-100 dark:border-zinc-800/50 opacity-60'
            : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 shadow-sm hover:translate-x-1'"
        >
          <!-- Unread dot -->
          <span
            v-if="!notif.read"
            class="absolute top-5 right-5 w-2 h-2 rounded-full bg-brand"
          ></span>

          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="{
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': notif.type === 'success',
              'bg-amber-500/10 text-amber-600 dark:text-amber-400': notif.type === 'warning',
              'bg-brand/10 text-brand': notif.type === 'info',
              'bg-rose-500/10 text-rose-500': notif.type === 'error',
            }"
          >
            <CheckCircle2 v-if="notif.type === 'success'" :size="20" />
            <AlertTriangle v-else-if="notif.type === 'warning'" :size="20" />
            <Info v-else-if="notif.type === 'info'" :size="20" />
            <XCircle v-else :size="20" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="text-[14px] font-black text-zinc-800 dark:text-zinc-200 mb-0.5">{{ notif.title }}</h3>
            <p class="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ notif.message }}</p>
            <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 block">
              {{ formatTime(notif.time) }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, Inbox, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import api from '../api/axios';

const router = useRouter();
const notifications = ref([]);
const unreadCount = ref(0);
const loading = ref(true);
const error = ref(null);

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const handleNotificationClick = (notif) => {
  // Mark as read locally immediately for felt UI speed
  notif.read = true;
  if (unreadCount.value > 0) unreadCount.value--;
  
  // Navigate
  if (notif.link) {
    router.push(notif.link);
  }
};

const markAllRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }));
  unreadCount.value = 0;
};

onMounted(async () => {
  try {
    const res = await api.get('/notifications');
    notifications.value = res.data.notifications;
    unreadCount.value = res.data.unreadCount;
  } catch (err) {
    error.value = 'Could not load notifications. Please try again later.';
    console.error('[NOTIFICATIONS]:', err);
  } finally {
    loading.value = false;
  }
});
</script>
