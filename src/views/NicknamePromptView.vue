<template>
  <main class="min-h-screen bg-[#f8fafc] text-zinc-950 flex items-center justify-center px-5 py-8">
    <section class="w-full max-w-md">
      <div class="mb-8 flex justify-center">
        <BrandLogo size="md" theme="light" />
      </div>

      <form
        class="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8"
        @submit.prevent="saveNickname"
      >
        <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <UserRound class="h-7 w-7" />
        </div>

        <h1 class="text-2xl font-black tracking-tight text-zinc-950">Choose your nickname</h1>
        <p class="mt-2 text-sm font-medium leading-6 text-zinc-500">
          This is the name other students will see in chats, games, and leaderboards.
        </p>

        <label class="mt-7 block text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400">
          Nickname
        </label>
        <input
          v-model="nickname"
          class="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base font-bold text-zinc-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          maxlength="20"
          autocomplete="nickname"
          placeholder="e.g. NoraAce"
        >

        <div class="mt-3 flex items-center justify-between gap-3 text-[11px] font-bold text-zinc-400">
          <span>3-20 letters, numbers, spaces, _ or -</span>
          <span>{{ nickname.trim().length }}/20</span>
        </div>

        <p v-if="error" class="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {{ error }}
        </p>

        <button
          type="submit"
          class="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-zinc-900/15 transition hover:-translate-y-0.5 hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          :disabled="!isValid || loading"
        >
          <span>{{ loading ? 'Saving...' : 'Continue' }}</span>
          <ArrowRight v-if="!loading" class="h-4 w-4" />
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight, UserRound } from 'lucide-vue-next';
import BrandLogo from '../components/BrandLogo.vue';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const suggestedName = (authStore.user?.fullName || '')
  .split(' ')[0]
  ?.replace(/[^A-Za-z0-9_-]/g, '')
  .slice(0, 20) || '';

const nickname = ref(authStore.user?.nickname || suggestedName);
const loading = ref(false);
const error = ref('');

const isValid = computed(() => /^[A-Za-z0-9 _-]{3,20}$/.test(nickname.value.trim()));

const saveNickname = async () => {
  if (!isValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    await authStore.updateNickname(nickname.value.trim());
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
    router.replace(redirect);
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not save nickname. Try another one.';
  } finally {
    loading.value = false;
  }
};
</script>
