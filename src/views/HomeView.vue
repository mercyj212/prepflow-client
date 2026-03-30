<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col transition-colors duration-300">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 transition-colors">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="font-semibold text-lg tracking-tight">PrepFlow</span>
        </div>
        
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <router-link 
            to="/login"
            class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Log in
          </router-link>
          <router-link 
            to="/register"
            class="px-4 py-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Sign up
          </router-link>
        </div>
      </div>
    </nav>

    <main class="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 lg:py-32">
      <!-- Hero Section -->
      <div class="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now available for students everywhere
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-[1.1]">
          Master your studies. <br/>
          <span class="text-zinc-500 dark:text-zinc-400">Without the stress.</span>
        </h1>
        
        <p class="text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          PrepFlow is the modern learning environment that provides structured quizzes, intelligent flashcards, and powerful analytics to elevate your academic performance.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <router-link 
            to="/register"
            class="w-full sm:w-auto px-8 py-3.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-base font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Learning for Free
          </router-link>
          <router-link 
            to="/login"
            class="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-base font-medium rounded-xl transition-all shadow-sm"
          >
            Sign in to Dashboard
          </router-link>
        </div>
      </div>

      <!-- Feature Grid -->
      <div class="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
        <!-- Feature 1 -->
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-start hover:border-black dark:hover:border-zinc-600 transition-colors group cursor-default">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white transition-colors text-zinc-600 dark:text-zinc-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Structured Quizzes</h3>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed flex-grow">
            Test yourself under timed conditions with our beautiful assessment engine. We track your progress per course seamlessly.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-start hover:border-black dark:hover:border-zinc-600 transition-colors group cursor-default">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white transition-colors text-zinc-600 dark:text-zinc-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Interactive Flashcards</h3>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed flex-grow">
            Learn actively with our 3D animated study mode. Flip through cards before jumping into the graded exams.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-start hover:border-black dark:hover:border-zinc-600 transition-colors group cursor-default">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white transition-colors text-zinc-600 dark:text-zinc-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Deep Analytics</h3>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed flex-grow">
            Review detailed metrics on your dashboard, including average performance scores, completed assessments, and a history of all submissions.
          </p>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 mt-20 transition-colors">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>&copy; 2026 PrepFlow. Developed for excellence.</p>
        <div class="flex gap-4 mt-4 sm:mt-0">
          <a href="#" class="hover:text-black dark:hover:text-white transition">Terms</a>
          <a href="#" class="hover:text-black dark:hover:text-white transition">Privacy</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import ThemeToggle from '../components/ThemeToggle.vue';
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
