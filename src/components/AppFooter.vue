<template>
  <footer class="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-20 mt-32 transition-colors overflow-hidden relative">
    <!-- Indigo Accent Decoration -->
    <div class="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute -left-24 -top-24 w-80 h-80 bg-zinc-600/5 dark:bg-zinc-100/5 rounded-full blur-[80px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <div class="mb-6 opacity-90 hover:opacity-100 transition-opacity">
            <BrandLogo />
          </div>
          <p class="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm leading-relaxed mb-8">
            Empowering students with a high-fidelity CBT environment and intelligent curriculum tracking for global academic excellence.
          </p>
          <div class="flex items-center gap-4">
            <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Platform Operational</span>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">Support & Safety</h4>
          <ul class="space-y-4 font-bold text-sm">
            <li><router-link to="/help" class="text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span class="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                Help Center Hub
            </router-link></li>
            <li><a href="mailto:mercyjay510@gmail.com" class="text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span class="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                Contact Help Desk
            </a></li>
            <li><router-link to="/verify-email" class="text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span class="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors"></span>
                Account Verification
            </router-link></li>
          </ul>
        </div>

        <!-- System -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">Student Access</h4>
          <ul class="space-y-4 font-bold text-sm text-zinc-500">
            <li><router-link to="/dashboard" class="hover:text-black dark:hover:text-white transition-colors">Personal Dashboard</router-link></li>
            <li><router-link to="/login" class="hover:text-black dark:hover:text-white transition-colors">Identity Login</router-link></li>
            <li><router-link to="/register" class="hover:text-black dark:hover:text-white transition-colors">Join Registry</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Legal Attribution -->
      <div class="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
          © 2026 PrepUp CBT • Excellence in Practice
        </p>
        <div class="flex items-center gap-6">
            <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Global Academic Standard</span>
            <div class="w-px h-3 bg-zinc-200 dark:bg-zinc-800"></div>
            <a href="#" class="text-[10px] font-black hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest text-zinc-400">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import BrandLogo from './BrandLogo.vue';
</script>

<style scoped>
</style>
