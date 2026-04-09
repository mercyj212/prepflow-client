<template>
  <div class="min-h-screen bg-[#f6f6f4] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-12">
    <nav class="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <BrandLogo />
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <div class="flex items-center gap-3 pl-4 border-l border-border-light dark:border-border-dark">
            <span class="hidden sm:block text-[14px] font-normal text-slate-500 dark:text-zinc-400">{{ user?.fullName }}</span>
            <button @click="logout" type="button" class="text-[14px] font-medium text-brand dark:text-blue-400 hover:opacity-80 transition-opacity">Log out</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header class="mb-8">
        <p class="text-[13px] font-normal text-slate-500 dark:text-zinc-400 capitalize">{{ currentDate }}</p>
        <h1 class="mt-1 text-[30px] font-medium text-slate-900 dark:text-white leading-tight">
          Welcome back, {{ user?.fullName?.split(' ')[0] || 'student' }}
        </h1>
      </header>

      <section v-if="quizStore.loading" class="py-16 text-center text-[15px] font-normal text-slate-500 dark:text-zinc-400">
        Loading your dashboard...
      </section>

      <template v-else>
        <!-- 3 Stat Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Questions done" :value="totalQuestionsDone" />
          <StatCard label="Average score" :value="averageScore" suffix="%" />
          <StatCard label="Streak" :value="streakDays" suffix="days" />
        </section>

        <!-- MY MODULES -->
        <section class="mb-12">
            <div class="mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <h2 class="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">My Modules</h2>
              <router-link to="/subjects" class="text-[12px] font-bold tracking-widest uppercase text-brand dark:text-indigo-400 hover:text-slate-900 dark:hover:text-white transition-colors border-b-2 border-transparent hover:border-slate-900 dark:hover:border-white pb-1 shrink-0">
                View All ->
              </router-link>
            </div>
            
            <div v-if="subjects.length === 0" class="rounded-[38px] bg-slate-100 dark:bg-zinc-900 p-10 text-center">
              <p class="text-[15px] font-medium text-slate-500">No modules available.</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div 
                  v-for="subject in subjects.slice(0, 4)" :key="subject.id"
                  @click="startQuiz(subject.quizId)"
                  class="group relative p-8 sm:p-10 rounded-[42px] bg-slate-900 dark:bg-zinc-900/40 border border-slate-800 dark:border-white/5 flex flex-col hover:bg-slate-800 dark:hover:bg-zinc-900 transition-all duration-500 overflow-hidden shadow-xl shadow-indigo-500/5 dark:shadow-none min-h-[340px] sm:min-h-[380px] cursor-pointer"
              >
                  <!-- Header: Icon & Flashcards Action -->
                  <div class="relative z-20 flex justify-between items-start mb-6 w-full">
                    <div class="text-6xl group-hover:scale-110 transition-transform duration-500 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100">
                      {{ subject.icon || '📘' }}
                    </div>
                    <button type="button" @click.stop="$router.push(`/flashcards/${subject.quizId}`)" class="px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 text-white/90 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-colors shadow-sm">
                      Flashcards
                    </button>
                  </div>
                  
                  <!-- Body: Subject Info & Progress -->
                  <div class="relative z-20 mt-auto w-full">
                    <h4 class="text-lg sm:text-xl font-black uppercase tracking-tighter group-hover:text-indigo-300 dark:group-hover:text-indigo-400 text-white transition-colors line-clamp-1">{{ subject.name }}</h4>
                    <p class="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest line-clamp-1 mb-8">{{ subject.examType }}</p>
                    
                    <div class="w-full">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] font-bold tracking-widest text-white/50 uppercase">Progress</span>
                        <span class="text-[10px] font-bold tracking-widest text-indigo-400">{{ subject.progressPercent }}%</span>
                      </div>
                      <div class="h-1.5 rounded-full bg-white/20 overflow-hidden w-full">
                          <div class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" :style="{ width: `${subject.progressPercent}%` }"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Glass Background Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 dark:from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
              </div>
            </div>
        </section>

        <!-- RECENT TESTS & HELP -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div class="lg:col-span-2 flex flex-col">
            <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">Recent Diagnostics</h2>
            
            <div v-if="quizStore.mySubmissions.length === 0" class="rounded-[32px] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 p-10 text-center flex-1 flex flex-col justify-center">
              <p class="text-[14px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">No submissions found</p>
            </div>
            
            <div v-else class="flex flex-col gap-4">
              <div 
                v-for="(sub, index) in quizStore.mySubmissions.slice(0, 5)" 
                :key="index" 
                class="group relative bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-brand/40 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all overflow-hidden" 
                @click="openSubmission(sub)"
              >
                  <!-- Submission Info -->
                  <div class="relative z-10 flex items-center gap-4 sm:gap-6">
                    <div class="w-12 h-12 shrink-0 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                      📋
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-base sm:text-lg font-black tracking-tighter uppercase text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{{ sub.quiz?.title || 'Unknown Block' }}</h4>
                      <p class="text-[10px] font-bold tracking-[0.15em] text-slate-400 dark:text-zinc-500 uppercase mt-1">
                        {{ formatDate(sub.createdAt) }} <span class="mx-2 opacity-30">•</span> Score: {{ sub.score }}/{{ sub.totalQuestions }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Badge -->
                  <div class="relative z-10 self-start sm:self-center px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest shrink-0 border" :class="getBadgeClass(sub)">
                    {{ getBadgeLabel(sub) }}
                  </div>
              </div>
            </div>
          </div>

          <!-- Extra Prompt -->
          <aside class="flex flex-col">
            <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">Expert Guidance</h2>
            <div class="relative flex-1 p-8 sm:p-10 rounded-[32px] sm:rounded-[38px] bg-slate-900 dark:bg-zinc-900/80 border border-black dark:border-white/5 flex flex-col justify-center overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
              
              <div class="relative z-10">
                <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <span class="text-xl">💡</span>
                </div>
                <h3 class="text-2xl font-black uppercase tracking-tighter text-white mb-4 leading-none">Diagnostic Review Strategy</h3>
                <p class="text-[13px] font-medium text-slate-400 dark:text-zinc-400 mb-8 leading-relaxed">
                  Analyze your recent submissions carefully. Focus intensely on understanding why incorrect options were tempting before moving on.
                </p>
                <button
                  type="button"
                  @click="router.push('/help')"
                  class="w-full rounded-2xl bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest py-4.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10"
                >
                  Access Help Hub ->
                </button>
              </div>
            </div>
          </aside>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import StatCard from '../components/dashboard/StatCard.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const user = computed(() => authStore.user);

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
});

const totalQuestionsDone = computed(() => {
  return quizStore.mySubmissions.reduce((acc, sub) => acc + (sub.totalQuestions || 0), 0);
});

const averageScore = computed(() => {
  if (quizStore.mySubmissions.length === 0) return 0;
  const totalPercentage = quizStore.mySubmissions.reduce((acc, sub) => {
    return acc + ((sub.score / sub.totalQuestions) * 100);
  }, 0);
  return Math.round(totalPercentage / quizStore.mySubmissions.length);
});

const streakDays = computed(() => {
  const uniqueDays = new Set(
    quizStore.mySubmissions.map((sub) => new Date(sub.createdAt).toDateString())
  );
  return uniqueDays.size;
});

const subjectIcons = ['📘', '🧮', '🧪', '🌍', '📚', '📈', '🧠', '💻'];

const subjects = computed(() => {
  return quizStore.quizzes.map((quiz, index) => {
    const related = quizStore.mySubmissions.filter((sub) => sub.quiz?._id === quiz._id);
    const attemptCount = related.length;
    const progressPercent = Math.min(100, attemptCount * 20);
    return {
      id: quiz._id,
      quizId: quiz._id,
      name: quiz.title || 'Untitled subject',
      examType:
        (quiz.course && typeof quiz.course === 'object' ? quiz.course.title : '') ||
        quiz.courseName ||
        quiz.examBody ||
        quiz.examType ||
        'General',
      progressPercent,
      icon: subjectIcons[index % subjectIcons.length]
    };
  });
});

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const startQuiz = (id) => {
  router.push(`/quiz/${id}`);
};

const formatDate = (value) => {
  if (!value) return 'Unknown date';
  return new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getScorePercent = (submission) => {
  if (!submission.totalQuestions) return 0;
  return Math.round((submission.score / submission.totalQuestions) * 100);
};

const getBadgeLabel = (submission) => {
  const score = getScorePercent(submission);
  if (score >= 70) return 'Pass';
  if (score >= 40) return 'Review';
  return 'Fail';
};

const getBadgeClass = (submission) => {
  const score = getScorePercent(submission);
  if (score >= 70) return 'border-success text-success bg-success/5';
  if (score >= 40) return 'border-warning text-warning bg-warning/5';
  return 'border-danger text-danger bg-danger/5';
};

const openSubmission = (submission) => {
  router.push({
    path: '/result',
    query: {
      score: submission.score ?? 0,
      total: submission.totalQuestions ?? 0,
      quizId: submission.quiz?._id || submission.quizId || ''
    }
  });
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

