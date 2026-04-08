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

        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Subject Grid (2 columns on mobile/tablet) -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-[20px] font-medium text-slate-900 dark:text-white">Available subjects</h2>
              <router-link to="/subjects" class="text-[13px] font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white">See all</router-link>
            </div>
            <div v-if="subjects.length === 0" class="flat-card p-10 text-center">
              <p class="text-[15px] font-medium text-slate-500">No subjects assigned yet.</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SubjectCard
                v-for="subject in subjects"
                :key="subject.id"
                :icon="subject.icon"
                :title="subject.name"
                :exam-type="subject.examType"
                :progress-percent="subject.progressPercent"
                @continue="startQuiz(subject.quizId)"
              />
            </div>
          </div>

          <!-- Recent Tests -->
          <aside>
            <h2 class="text-[20px] font-medium text-slate-900 dark:text-white mb-4">Recent tests</h2>
            <div class="flat-card overflow-hidden">
              <div v-if="quizStore.mySubmissions.length === 0" class="p-6 text-[14px] font-normal text-slate-500 dark:text-zinc-400">
                No tests taken yet.
              </div>
              <div v-else class="divide-y divide-border-light dark:divide-border-dark">
                <div v-for="(sub, index) in quizStore.mySubmissions.slice(0, 5)" :key="index" class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div class="min-w-0">
                    <p class="text-[14px] font-medium text-slate-900 dark:text-white leading-snug">{{ sub.quiz?.title || 'Unknown subject' }}</p>
                    <p class="text-[12px] font-normal text-slate-500 dark:text-zinc-400 mt-1">{{ formatDate(sub.createdAt) }}</p>
                  </div>
                  <button
                    type="button"
                    @click="openSubmission(sub)"
                    class="self-start sm:self-auto inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium border-[0.5px] tracking-wide whitespace-nowrap"
                    :class="getBadgeClass(sub)"
                  >
                    {{ getBadgeLabel(sub) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Extra Prompt -->
            <div class="mt-5 flat-card p-5 bg-white dark:bg-zinc-900">
              <p class="text-[13px] font-normal text-slate-500 dark:text-zinc-400">Need help?</p>
              <p class="mt-1 text-[15px] font-medium text-slate-900 dark:text-white">Review tips and guidance before your next test.</p>
              <button
                type="button"
                @click="router.push('/help')"
                class="mt-3 w-full rounded-lg border-[0.5px] border-slate-300 dark:border-zinc-700 bg-transparent text-slate-700 dark:text-zinc-200 text-[13px] font-medium py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Visit help center
              </button>
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
import SubjectCard from '../components/dashboard/SubjectCard.vue';

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

