<template>
  <div class="min-h-screen bg-[#0b1020] text-white flex items-center justify-center px-4">
    <section class="w-full max-w-xl text-center rounded-2xl border border-white/15 bg-white/5 p-8">
      <BrandLogo />
      <p class="mt-6 text-[13px] uppercase tracking-[0.2em] text-white/60">404</p>
      <h1 class="mt-2 text-4xl font-medium">Page not found</h1>
      <p class="mt-3 text-white/75">This page does not exist. Please return home.</p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/" class="px-5 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-medium">
          Go home
        </router-link>
        <router-link to="/dashboard" class="px-5 py-2.5 rounded-lg border border-white/25 text-sm font-medium">
          Dashboard
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import BrandLogo from '../components/BrandLogo.vue';
</script>

