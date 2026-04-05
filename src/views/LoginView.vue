<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex transition-colors duration-300">
    
    <!-- Left panel - Branding / Decorative -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12">
      <div class="z-10 mt-8 flex justify-between w-full pr-12">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="text-white font-bold text-2xl tracking-tight">PrepUp.</span>
        </div>
        <ThemeToggle />
      </div>
      
      <div class="z-10 mb-20 max-w-md">
        <h1 class="text-4xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
          Elevate your academic performance.
        </h1>
        <p class="text-zinc-400 text-lg leading-relaxed font-light">
          Access high-quality practice quizzes, intelligent study flashcards, and track your progress all in one unified platform.
        </p>
      </div>

      <!-- Simple geometric decoration -->
      <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl mix-blend-overlay"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl mix-blend-overlay"></div>
    </div>

    <!-- Right panel - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div class="w-full max-w-sm relative">
        
        <!-- Mobile Header -->
        <div class="flex items-center justify-between mb-12 lg:hidden">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-black dark:bg-white flex items-center justify-center">
              <svg class="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <span class="text-black dark:text-white font-bold text-xl tracking-tight">PrepUp</span>
          </div>
          <ThemeToggle />
        </div>

        <!-- Success Fancy Display -->
        <div v-if="showSuccess" class="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm transition-all duration-700 animate-in fade-in">
          <div class="flex flex-col items-center gap-6 scale-up-center">
            <div class="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-2xl">
              <svg class="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path class="draw-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-black dark:text-white mb-1">Welcome Back!</h3>
              <p class="text-zinc-500 dark:text-zinc-400">Login successful, redirecting...</p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">Log in</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter your credentials to access your account.</p>
        </div>
        
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              placeholder="m@example.com"
              class="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <a href="#" class="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              required
              v-model="password"
              placeholder="••••••••"
              class="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
            />
          </div>

          <div v-if="authStore.error" class="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-md border border-red-100 dark:border-red-500/20 flex items-start gap-2">
            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            <span class="pt-0.5">{{ authStore.error }}</span>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-zinc-950 disabled:opacity-50 transition-colors shadow-sm mt-4"
          >
            <div v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-2"></div>
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          Don't have an account?
          <router-link to="/register" class="font-medium text-black dark:text-white hover:underline transition-all">
            Sign up ->
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const showSuccess = ref(false);

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    
    // Fancy Success Display
    showSuccess.value = true;
    
    setTimeout(() => {
      if (authStore.user && authStore.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500); // Show fancy display for 1.5s
    
  } catch (error) {
    console.error('Login failed:', error);
    // Disappear error after some seconds
    setTimeout(() => {
      authStore.error = null;
    }, 4000);
  }
};
</script>

<style scoped>
.scale-up-center {
	animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@keyframes scale-up-center {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.draw-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.6s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
