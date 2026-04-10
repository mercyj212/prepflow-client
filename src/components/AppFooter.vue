<template>
  <footer class="bg-black border-t border-white/5 py-24 mt-32 transition-colors overflow-hidden relative">
    <!-- Subtle Accent Decoration -->
    <div class="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute -left-24 -top-24 w-80 h-80 bg-zinc-100/5 rounded-full blur-[80px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <div class="mb-8 invert brightness-0">
            <BrandLogo />
          </div>
          <p class="text-zinc-400 font-medium max-w-sm leading-relaxed mb-8">
            Empowering students with a high-fidelity CBT environment and intelligent curriculum tracking for global academic excellence.
          </p>
          <div class="flex items-center gap-4">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Platform Operational</span>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-b border-white/10 pb-3">Support & Safety</h4>
          <ul class="space-y-4 font-bold text-sm">
            <li><router-link to="/help" class="text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
                <span class="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-white transition-colors"></span>
                Help Center Hub
            </router-link></li>
            <li><a href="mailto:mercyjay510@gmail.com" class="text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
                <span class="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-white transition-colors"></span>
                Contact Help Desk
            </a></li>
            <li><router-link to="/verify-email" class="text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
                <span class="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-white transition-colors"></span>
                Account Verification
            </router-link></li>
          </ul>
        </div>

        <!-- System -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 border-b border-white/10 pb-3">Student Access</h4>
          <ul class="space-y-4 font-bold text-sm text-zinc-400">
            <li><router-link to="/dashboard" class="hover:text-white transition-colors">Personal Dashboard</router-link></li>
            <li><router-link to="/login" class="hover:text-white transition-colors">Identity Login</router-link></li>
            <li><router-link to="/register" class="hover:text-white transition-colors">Join Registry</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Legal Attribution -->
      <div class="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          © 2026 PrepUp CBT • Excellence in Practice
        </p>
        <div class="flex items-center gap-6">
            <span class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Global Academic Standard</span>
            <div class="w-px h-3 bg-white/10"></div>
            <a href="#" class="text-[10px] font-black hover:text-white transition-colors uppercase tracking-widest text-zinc-600">Terms of Service</a>
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
