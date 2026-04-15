<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col transition-colors duration-500">
    <div class="flex-grow flex items-center justify-center p-6">
    
    <div class="w-full max-w-sm relative">
      <!-- Success Modal -->
      <div v-if="submitted" class="text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/20 shadow-neo-inner">
          <Mail :size="40" :stroke-width="1.5" class="text-brand" />
        </div>
        <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-4">Recovery Link Sent</h2>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          If an account exists for <span class="font-black text-black dark:text-white">{{ email }}</span>, a secure reset link will arrive shortly. Please check your inbox.
        </p>
        <router-link to="/login" class="inline-flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
          Back to Login
          <ArrowRight :size="18" />
        </router-link>
      </div>

      <!-- Request Form -->
      <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl">
              <ShieldCheck :size="28" class="text-white dark:text-black" />
            </div>
          </div>
          <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Account Recovery</h2>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Enter your email to receive password reset instructions.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Registered Email Address</label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              placeholder="jane@scholar.com"
              class="block w-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
            />
          </div>

          <div v-if="error" class="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-wider text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <AlertCircle :size="14" />
            <span>{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center gap-3 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30"
          >
            <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            {{ loading ? 'Processing...' : 'Send Recovery Link' }}
            <ArrowRight v-if="!loading" :size="16" />
          </button>
          
          <div class="text-center pt-4">
            <router-link to="/login" class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Return to Login Portal
            </router-link>
          </div>
        </form>
      </div>
    </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '../store/auth';
import AppFooter from '../components/AppFooter.vue';

const email = ref('');
const submitted = ref(false);
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.forgotPassword(email.value);
    submitted.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Identity node not found.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.shadow-neo-inner {
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.7);
}
.dark .shadow-neo-inner {
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.05);
}
</style>
