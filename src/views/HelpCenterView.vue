<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-4xl mx-auto">

      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Help Center</h1>
        <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Everything you need to get the most out of PrepUp CBT.</p>
      </header>

      <!-- Help Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <!-- Direct Support -->
        <div class="bg-zinc-900 dark:bg-zinc-800 p-7 rounded-[24px] text-white shadow-neo group cursor-pointer transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
            <Mail :size="24" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight">Direct Support</h3>
          <p class="text-white/60 mb-5 text-[13px]">Have a specific issue? Contact our help desk immediately.</p>
          <a href="mailto:mercyjay510@gmail.com" class="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest hover:underline">
            mercyjay510@gmail.com
            <ArrowRight :size="12" />
          </a>
        </div>

        <!-- Account Security -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <Lock :size="24" class="text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-zinc-800 dark:text-zinc-100">Account Access</h3>
          <p class="text-zinc-500 dark:text-zinc-500 mb-5 text-[13px]">Challenges with login, verification, or credentials?</p>
          <router-link to="/forgot-password" class="text-[12px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Reset Password
            <ArrowRight :size="12" />
          </router-link>
        </div>

        <!-- Exam Guide -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <ClipboardList :size="24" class="text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-zinc-800 dark:text-zinc-100">Exam Protocol</h3>
          <p class="text-zinc-500 dark:text-zinc-500 mb-5 text-[13px]">How PrepUp simulates real-world CBT environments.</p>
          <router-link to="/subjects" class="text-[12px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Start Practice
            <ArrowRight :size="12" />
          </router-link>
        </div>
      </div>

      <!-- FAQ Section -->
      <div>
        <h2 class="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <details v-for="(faq, i) in faqs" :key="i" class="group bg-[var(--neo-surface)] border border-white/20 dark:border-white/5 rounded-[18px] shadow-neo overflow-hidden">
            <summary class="p-5 cursor-pointer flex items-center justify-between text-[14px] font-semibold text-zinc-800 dark:text-zinc-100 list-none group-open:bg-black/5 dark:group-open:bg-white/5 transition-colors">
              {{ faq.q }}
              <ChevronDown :size="16" class="shrink-0 ml-4 group-open:rotate-180 transition-transform text-zinc-400 dark:text-zinc-500" />
            </summary>
            <div class="px-5 pb-5 pt-3 text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-black/5 dark:border-white/5">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { Mail, ArrowRight, Lock, ClipboardList, ChevronDown } from 'lucide-vue-next';
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
