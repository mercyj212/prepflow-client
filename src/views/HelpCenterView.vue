<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-300">
    <!-- Navbar (Simplified for Focus) -->
    <nav class="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <router-link to="/dashboard" class="group flex items-center gap-3 transition-transform active:scale-95">
          <div class="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:rotate-6 transition-transform">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/></svg>
          </div>
          <span class="text-xl font-black tracking-tight uppercase italic">PrepUp</span>
        </router-link>
        <div class="flex items-center gap-6">
          <router-link to="/dashboard" class="text-sm font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Dashboard</router-link>
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <!-- Help Center Hero -->
    <div class="pt-24 pb-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-fade-in">Support Hub</div>
        <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 uppercase italic">How can we help you?</h1>
        <p class="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">Navigating your academic path should be seamless. Our Help Center is here to ensure your PrepUp experience is successful.</p>
      </div>
    </div>

    <!-- Help Categories -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-24 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Get in Touch -->
        <div class="bg-indigo-600 dark:bg-indigo-500 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200 dark:shadow-none group cursor-pointer transition-all hover:-translate-y-2">
          <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:bg-white/30 transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-2 uppercase italic tracking-tight">Direct Support</h3>
          <p class="text-indigo-100/80 mb-6 font-medium">Have a specific issue? Contact our global help desk immediately.</p>
          <a href="mailto:mercyjay510@gmail.com" class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            mercyjay510@gmail.com
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <!-- Account Security -->
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2">
          <div class="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-2 text-zinc-900 dark:text-white uppercase italic tracking-tight">Account Access</h3>
          <p class="text-zinc-500 mb-6 font-medium">Facing challenges with login, verification, or credentials?</p>
          <router-link to="/forgot-password" class="text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2">
            Reset Password
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>

        <!-- Exam Guide -->
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2">
          <div class="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-2 text-zinc-900 dark:text-white uppercase italic tracking-tight">Exam Protocol</h3>
          <p class="text-zinc-500 mb-6 font-medium">Guidelines on how PrepUp simulates real-world CBT environments.</p>
          <router-link to="/dashboard" class="text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-2">
            Start Practice
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="max-w-4xl mx-auto px-4 pb-32">
      <h2 class="text-3xl font-black mb-12 text-zinc-900 dark:text-white uppercase italic tracking-tighter border-b-2 border-zinc-900 dark:border-white pb-4">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details v-for="(faq, i) in faqs" :key="i" class="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-all">
          <summary class="p-6 cursor-pointer flex items-center justify-between text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight list-none group-open:bg-zinc-50 dark:group-open:bg-zinc-800 transition-colors">
            {{ faq.q }}
            <svg class="w-5 h-5 group-open:rotate-180 transition-transform text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </summary>
          <div class="p-6 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
            {{ faq.a }}
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue';

const faqs = [
  {
    q: "How do I access new curriculum materials?",
    a: "New courses and study materials are automatically synced to your dashboard. Simply log in and look for any courses labeled as 'New' or 'Updated'. You can also find materials within each specific course view under the 'Curriculum Asset' section."
  },
  {
    q: "I haven't received my verification email. What should I do?",
    a: "Check your spam or junk folder first. If the email isn't there, ensure you've waited at least 60 seconds. You can request a fresh verification link from the login page if the original has expired."
  },
  {
    q: "How is my platform performance score calculated?",
    a: "Your performance score is a high-fidelity weighted average of your quiz results, calculated across all courses. We use real-time analytics to track your progress and provide a competitive percentile ranking."
  },
  {
    q: "Is there a mobile version of the PrepUp platform?",
    a: "PrepUp is fully responsive and optimized for mobile browsers. You can access the complete experience, including exams and course materials, directly from your smartphone or tablet."
  }
];
</script>

<style scoped>
/* Remove standard summary marker */
summary::-webkit-details-marker { display: none; }
</style>
