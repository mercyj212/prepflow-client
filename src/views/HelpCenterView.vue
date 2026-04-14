<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-4xl mx-auto">

      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Help Center</h1>
        <p class="text-[15px] font-medium text-slate-500 dark:text-zinc-500">Everything you need to get the most out of PrepUp CBT.</p>
      </header>

      <!-- Help Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <!-- Direct Support -->
        <div class="bg-slate-900 dark:bg-zinc-800 p-7 rounded-[24px] text-white shadow-neo group cursor-pointer transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight">Direct Support</h3>
          <p class="text-white/60 mb-5 text-[13px]">Have a specific issue? Contact our help desk immediately.</p>
          <a href="mailto:mercyjay510@gmail.com" class="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest hover:underline">
            mercyjay510@gmail.com
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <!-- Account Security -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-slate-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-slate-800 dark:text-zinc-100">Account Access</h3>
          <p class="text-slate-500 dark:text-zinc-500 mb-5 text-[13px]">Challenges with login, verification, or credentials?</p>
          <router-link to="/forgot-password" class="text-[12px] font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Reset Password
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>

        <!-- Exam Guide -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-slate-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-slate-800 dark:text-zinc-100">Exam Protocol</h3>
          <p class="text-slate-500 dark:text-zinc-500 mb-5 text-[13px]">How PrepUp simulates real-world CBT environments.</p>
          <router-link to="/subjects" class="text-[12px] font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Start Practice
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>

      <!-- FAQ Section -->
      <div>
        <h2 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-5">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <details v-for="(faq, i) in faqs" :key="i" class="group bg-[var(--neo-surface)] border border-white/20 dark:border-white/5 rounded-[18px] shadow-neo overflow-hidden">
            <summary class="p-5 cursor-pointer flex items-center justify-between text-[14px] font-semibold text-slate-800 dark:text-zinc-100 list-none group-open:bg-black/5 dark:group-open:bg-white/5 transition-colors">
              {{ faq.q }}
              <svg class="w-4 h-4 shrink-0 ml-4 group-open:rotate-180 transition-transform text-slate-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-5 pt-3 text-[14px] text-slate-500 dark:text-zinc-400 leading-relaxed border-t border-black/5 dark:border-white/5">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import NeoAppShell from '../components/layout/NeoAppShell.vue';

const faqs = [
  {
    q: "How do I access new curriculum materials?",
    a: "New courses and study materials are automatically synced to your dashboard. Simply log in and look for any courses labeled as 'New' or 'Updated'."
  },
  {
    q: "I haven't received my verification email. What should I do?",
    a: "Check your spam or junk folder first. If the email isn't there, ensure you've waited at least 60 seconds. You can request a fresh verification link from the login page if the original has expired."
  },
  {
    q: "How is my platform performance score calculated?",
    a: "Your performance score is a weighted average of your quiz results across all courses. We use real-time analytics to track your progress and provide a competitive percentile ranking."
  },
  {
    q: "Is there a mobile version of the PrepUp platform?",
    a: "PrepUp is fully responsive and optimized for mobile browsers. You can access the complete experience, including exams and course materials, directly from your smartphone or tablet."
  }
];
</script>

<style scoped>
summary::-webkit-details-marker { display: none; }
</style>
