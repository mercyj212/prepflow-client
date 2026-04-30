<template>
  <NeoAppShell>
    <div
      class="min-h-full text-zinc-900 transition-colors duration-500 dark:text-zinc-100"
      :class="phase === 'select'
        ? 'bg-zinc-100 dark:bg-zinc-950'
        : 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#ecfdf5_0%,#f4f4f5_46%,#f4f4f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#052e24_0%,#09090b_48%,#09090b_100%)]'"
    >
      <section class="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header class="mb-8 flex flex-col gap-5 border-b border-zinc-200 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              @click="router.push('/games')"
              class="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <ArrowLeft :size="16" :stroke-width="2.5" />
              Back to Games
            </button>
            <div class="mb-3 flex items-center gap-3">
              <Swords :size="20" :stroke-width="1.8" class="text-zinc-500" />
              <span class="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">Social Duels</span>
            </div>
            <h1 class="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Course Duel Arena
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Pick a course you have unlocked, answer under pressure, and beat a rival score round by round.
            </p>
          </div>

          <div v-if="phase !== 'select'" class="grid grid-cols-3 gap-2 rounded-[24px] border border-zinc-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div class="px-4 py-3 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Round</p>
              <p class="mt-1 text-xl font-semibold">{{ activeRoundLabel }}</p>
            </div>
            <div class="px-4 py-3 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">You</p>
              <p class="mt-1 text-xl font-semibold text-emerald-500">{{ playerScore }}</p>
            </div>
            <div class="px-4 py-3 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rival</p>
              <p class="mt-1 text-xl font-semibold text-rose-500">{{ rivalScore }}</p>
            </div>
          </div>
        </header>

        <div v-if="phase === 'select'" class="space-y-8">
          <div class="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px] bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
              <Trophy :size="24" :stroke-width="1.8" />
            </div>
            <h2 class="text-xl font-semibold">How Social Duels Works</h2>
            <div class="mt-5 grid gap-4 md:grid-cols-3">
              <div v-for="rule in rules" :key="rule.title" class="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800/70">
                <p class="text-sm font-semibold">{{ rule.title }}</p>
                <p class="mt-1 text-sm leading-relaxed text-zinc-500">{{ rule.copy }}</p>
              </div>
            </div>
          </div>

          <div>
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Choose Duel Course</h2>
                <p class="text-sm text-zinc-500">Unpaid courses send you to checkout first.</p>
              </div>
              <div v-if="loadingCourses" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <LoaderCircle :size="16" class="animate-spin" />
                Loading
              </div>
            </div>

            <div v-if="loadingCourses" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div v-for="i in 6" :key="i" class="h-48 rounded-[24px] border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                <BaseSkeleton width="48px" height="48px" customClass="!rounded-2xl mb-5" />
                <BaseSkeleton width="70%" height="20px" customClass="mb-3" />
                <BaseSkeleton width="100%" height="14px" />
              </div>
            </div>

            <div v-else-if="courses.length === 0" class="rounded-[28px] border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-zinc-900">
              <BookOpen :size="36" class="mx-auto mb-4 text-zinc-400" />
              <h3 class="text-lg font-semibold">No duel courses yet</h3>
              <p class="mx-auto mt-2 max-w-md text-sm text-zinc-500">Add questions to a course from the admin area, then it will appear here.</p>
            </div>

            <div v-else class="space-y-8">
              <div v-for="(groupCourses, path) in groupedCourses" :key="path" v-show="groupCourses.length">
                <div class="mb-4 flex items-center gap-4">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">{{ pathLabel(path) }}</h3>
                  <div class="h-px flex-1 bg-zinc-200 dark:bg-white/10"></div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <button
                    v-for="course in groupCourses"
                    :key="course._id"
                    @click="handleCourseClick(course)"
                    class="group flex h-full min-h-48 flex-col rounded-[24px] border bg-white p-5 text-left shadow-sm transition-all dark:bg-zinc-900"
                    :class="course.hasGameAccess ? 'border-zinc-200 hover:-translate-y-0.5 hover:border-zinc-900 dark:border-white/10 dark:hover:border-white/40' : 'border-amber-200/80 hover:border-amber-400 dark:border-amber-500/20 dark:hover:border-amber-400/50'"
                  >
                    <div class="mb-5 flex items-start justify-between gap-3">
                      <div class="flex h-12 w-12 items-center justify-center rounded-[18px] bg-zinc-900 text-sm font-black uppercase text-white transition-colors group-hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
                        <span v-if="course.hasGameAccess">{{ course.title.slice(0, 2) }}</span>
                        <Lock v-else :size="20" :stroke-width="2.4" />
                      </div>
                      <span class="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest" :class="course.hasGameAccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'">
                        {{ accessLabel(course) }}
                      </span>
                    </div>
                    <h4 class="text-lg font-semibold leading-tight text-zinc-900 dark:text-white">{{ course.title }}</h4>
                    <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{{ course.description || courseMeta(course) }}</p>
                    <div class="mt-auto flex items-center justify-between pt-6">
                      <span class="text-[10px] font-black uppercase tracking-widest" :class="course.hasGameAccess ? 'text-zinc-500' : 'text-amber-600 dark:text-amber-400'">
                        {{ course.hasGameAccess ? 'Start Duel' : 'Pay to Unlock' }}
                      </span>
                      <ArrowRight :size="18" :stroke-width="2.5" class="text-zinc-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:col-span-2">
              <p class="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Course</p>
              <h2 class="mt-2 text-xl font-semibold leading-tight">{{ selectedCourse?.title }}</h2>
              <p class="mt-2 text-sm text-zinc-500">{{ courseMeta(selectedCourse) }}</p>
            </div>
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Accuracy</p>
              <p class="mt-2 text-2xl font-semibold">{{ accuracy }}%</p>
            </div>
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Streak</p>
              <p class="mt-2 text-2xl font-semibold">{{ streak }}</p>
            </div>
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bonus</p>
              <p class="mt-2 text-2xl font-semibold">{{ timeBonusTotal }}</p>
            </div>
          </section>

          <div class="grid gap-6 xl:grid-cols-[1fr_300px]">
          <main class="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8">
            <div v-if="loadingQuestions" class="flex min-h-[420px] flex-col items-center justify-center gap-4 text-zinc-500">
              <LoaderCircle :size="34" class="animate-spin" />
              <p class="text-[10px] font-black uppercase tracking-[0.3em]">Preparing Duel</p>
            </div>

            <div v-else-if="phase === 'result'" class="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px]" :class="playerScore >= rivalScore ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'">
                <Trophy v-if="playerScore >= rivalScore" :size="38" :stroke-width="1.8" />
                <ShieldX v-else :size="38" :stroke-width="1.8" />
              </div>
              <p class="text-[10px] font-black uppercase tracking-[0.34em] text-zinc-400">Duel Complete</p>
              <h2 class="mt-3 text-4xl font-semibold tracking-tight">{{ resultTitle }}</h2>
              <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">{{ resultCopy }}</p>
              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <button @click="restartDuel" class="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
                  <RotateCcw :size="16" />
                  Rematch
                </button>
                <button @click="resetToSelect" class="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white">
                  <BookOpen :size="16" />
                  Change Course
                </button>
              </div>
            </div>

            <div v-else class="min-h-[420px]">
              <div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Question {{ currentIndex + 1 }} of {{ duelQuestions.length }}</p>
                  <div class="mt-3 h-2 w-64 max-w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                    <div class="h-full rounded-full bg-emerald-500 transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)]" :style="{ width: `${progressPercent}%` }"></div>
                  </div>
                </div>
                <div class="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-white/10">
                  <Clock :size="18" class="text-zinc-400" />
                  <span class="font-mono text-2xl font-semibold" :class="timeLeft <= 5 ? 'text-rose-500' : ''">{{ timeLeft }}</span>
                </div>
              </div>

              <h2 class="text-2xl font-semibold leading-snug text-zinc-900 dark:text-white sm:text-3xl">{{ currentQuestion?.q }}</h2>

              <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  v-for="(answer, index) in currentQuestion?.a || []"
                  :key="`${currentIndex}-${index}`"
                  @click="submitAnswer(index)"
                  :disabled="answered"
                  class="min-h-24 rounded-[22px] border p-5 text-left text-sm font-semibold leading-relaxed transition-all disabled:cursor-default"
                  :class="answerClass(index)"
                >
                  <span
                    class="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black"
                    :class="answerBadgeClass(index)"
                  >
                    {{ optionLetter(index) }}
                  </span>
                  <span class="block">{{ answer }}</span>
                </button>
              </div>

              <div v-if="answered" class="mt-6 rounded-[24px] border p-5" :class="lastCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100'">
                <div class="flex items-start gap-3">
                  <CheckCircle2 v-if="lastCorrect" :size="22" class="mt-0.5 shrink-0" />
                  <XCircle v-else :size="22" class="mt-0.5 shrink-0" />
                  <div>
                    <p class="text-sm font-semibold">{{ lastCorrect ? 'Point secured' : 'Rival takes the opening' }}</p>
                    <p class="mt-1 text-sm opacity-80">{{ currentQuestion?.expl || 'Review this topic carefully.' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside class="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Rival Desk</p>
            <div class="mt-5 flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-rose-500/10 text-xl font-black text-rose-500">
                {{ rival.initials }}
              </div>
              <div>
                <h3 class="font-semibold">{{ rival.name }}</h3>
                <p class="text-xs font-bold uppercase tracking-widest text-zinc-400">{{ rival.style }}</p>
              </div>
            </div>

            <div class="mt-8 space-y-4">
              <div v-for="(round, index) in roundLog" :key="index" class="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs font-black uppercase tracking-widest text-zinc-400">Round {{ index + 1 }}</span>
                  <span class="text-xs font-semibold" :class="round.player > round.rival ? 'text-emerald-500' : round.player < round.rival ? 'text-rose-500' : 'text-zinc-500'">
                    {{ round.player }} - {{ round.rival }}
                  </span>
                </div>
                <p class="mt-2 text-xs text-zinc-500">{{ round.note }}</p>
              </div>
            </div>
          </aside>
          </div>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Lock,
  RotateCcw,
  ShieldX,
  Swords,
  Trophy,
  XCircle
} from 'lucide-vue-next';
import api from '../api/axios';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';

const router = useRouter();

const phase = ref('select');
const loadingCourses = ref(true);
const loadingQuestions = ref(false);
const courses = ref([]);
const selectedCourse = ref(null);
const duelQuestions = ref([]);
const currentIndex = ref(0);
const timeLeft = ref(18);
const answered = ref(false);
const selectedAnswer = ref(null);
const lastCorrect = ref(false);
const playerScore = ref(0);
const rivalScore = ref(0);
const streak = ref(0);
const correctCount = ref(0);
const timeBonusTotal = ref(0);
const roundLog = ref([]);
let timerId = null;

const rivals = [
  { name: 'Ada Prime', initials: 'AP', style: 'fast starter', skill: 0.62 },
  { name: 'Nova Rank', initials: 'NR', style: 'steady finisher', skill: 0.68 },
  { name: 'Tobi Ace', initials: 'TA', style: 'streak hunter', skill: 0.58 }
];
const rival = ref(rivals[0]);

const rules = [
  { title: 'Paid courses only', copy: 'A duel starts only from a course already unlocked on your account.' },
  { title: 'Speed matters', copy: 'Correct answers score higher when you answer before the clock runs down.' },
  { title: 'Win the board', copy: 'Your rival scores each round too, so every question can swing the result.' }
];

const groupedCourses = computed(() => {
  const groups = { university: [], polytechnic: [], entrance: [], other: [] };
  courses.value.forEach((course) => {
    const path = (course.path || 'other').toLowerCase();
    if (groups[path]) groups[path].push(course);
    else groups.other.push(course);
  });
  return groups;
});

const currentQuestion = computed(() => duelQuestions.value[currentIndex.value]);
const activeRoundLabel = computed(() => phase.value === 'select' ? '-' : `${Math.min(currentIndex.value + 1, duelQuestions.value.length)}/${duelQuestions.value.length || 0}`);
const progressPercent = computed(() => duelQuestions.value.length ? ((currentIndex.value + 1) / duelQuestions.value.length) * 100 : 0);
const accuracy = computed(() => roundLog.value.length ? Math.round((correctCount.value / roundLog.value.length) * 100) : 0);
const resultTitle = computed(() => playerScore.value >= rivalScore.value ? 'You won the duel' : 'Rival won this round');
const resultCopy = computed(() => playerScore.value >= rivalScore.value
  ? 'Nice work. Your course access became practice time, and the scoreboard noticed.'
  : 'Close the gap with a rematch. Faster correct answers will shift the duel back your way.'
);

const pathLabel = (path) => {
  const labels = {
    university: 'University Pathway',
    polytechnic: 'Polytechnic Pathway',
    entrance: 'Entrance / CBT Exams',
    other: 'Other Courses'
  };
  return labels[path] || 'Other Courses';
};

const accessLabel = (course) => {
  if (course.gameAccessReason === 'admin') return 'Admin Access';
  if (course.hasGameAccess) return 'Unlocked';
  return 'Pay to Play';
};

const courseMeta = (course) => {
  if (!course) return '';
  const parts = [course.faculty?.name, course.department?.name, course.level].filter(Boolean);
  return parts.length ? parts.join(' / ') : 'Course question duel';
};

const optionLetter = (index) => String.fromCharCode(65 + index);

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await api.get('/game/courses');
    if (res.data.success) courses.value = res.data.data || [];
  } catch (error) {
    console.error('Failed to fetch duel courses:', error);
  } finally {
    loadingCourses.value = false;
  }
};

const handleCourseClick = async (course) => {
  if (!course.hasGameAccess) {
    router.push(`/checkout/${course._id}`);
    return;
  }
  selectedCourse.value = course;
  await startDuel(course);
};

const startDuel = async (course) => {
  resetScores();
  phase.value = 'duel';
  loadingQuestions.value = true;
  rival.value = rivals[Math.floor(Math.random() * rivals.length)];

  try {
    const res = await api.get('/game/questions', { params: { courseId: course._id } });
    if (res.data.success) {
      duelQuestions.value = (res.data.data || []).slice(0, 10);
      if (duelQuestions.value.length === 0) {
        phase.value = 'result';
      } else {
        startRound();
      }
    }
  } catch (error) {
    console.error('Failed to fetch duel questions:', error);
    if (error.response?.status === 403) router.push(`/checkout/${course._id}`);
  } finally {
    loadingQuestions.value = false;
  }
};

const resetScores = () => {
  stopTimer();
  currentIndex.value = 0;
  timeLeft.value = 18;
  answered.value = false;
  selectedAnswer.value = null;
  lastCorrect.value = false;
  playerScore.value = 0;
  rivalScore.value = 0;
  streak.value = 0;
  correctCount.value = 0;
  timeBonusTotal.value = 0;
  roundLog.value = [];
};

const startRound = () => {
  stopTimer();
  answered.value = false;
  selectedAnswer.value = null;
  lastCorrect.value = false;
  timeLeft.value = 18;
  timerId = window.setInterval(() => {
    timeLeft.value -= 1;
    if (timeLeft.value <= 0) submitAnswer(null);
  }, 1000);
};

const submitAnswer = (index) => {
  if (answered.value || !currentQuestion.value) return;
  stopTimer();

  answered.value = true;
  selectedAnswer.value = index;
  lastCorrect.value = index === currentQuestion.value.c;

  const rivalCorrect = Math.random() < rival.value.skill;
  const rivalRoundScore = rivalCorrect ? 80 + Math.floor(Math.random() * 45) : Math.floor(Math.random() * 35);
  let playerRoundScore = 0;

  if (lastCorrect.value) {
    const bonus = Math.max(timeLeft.value, 0) * 3;
    streak.value += 1;
    correctCount.value += 1;
    timeBonusTotal.value += bonus;
    playerRoundScore = 100 + bonus + Math.max(streak.value - 1, 0) * 10;
  } else {
    streak.value = 0;
    playerRoundScore = Math.max(timeLeft.value, 0);
  }

  playerScore.value += playerRoundScore;
  rivalScore.value += rivalRoundScore;
  roundLog.value.unshift({
    player: playerRoundScore,
    rival: rivalRoundScore,
    note: lastCorrect.value ? `Correct with ${Math.max(timeLeft.value, 0)}s left.` : 'Missed answer. Review this question.'
  });

  window.setTimeout(nextRound, 1400);
};

const nextRound = () => {
  if (currentIndex.value >= duelQuestions.value.length - 1) {
    phase.value = 'result';
    return;
  }
  currentIndex.value += 1;
  startRound();
};

const answerClass = (index) => {
  if (!answered.value) {
    return 'border-zinc-200 bg-zinc-50 text-zinc-900 hover:border-zinc-900 hover:bg-white dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:border-white/40 dark:hover:bg-zinc-900';
  }
  if (index === currentQuestion.value?.c) {
    return 'border-emerald-400 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-50 dark:hover:bg-emerald-500/15';
  }
  if (index === selectedAnswer.value) {
    return 'border-rose-400 bg-rose-50 text-rose-950 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-50 dark:hover:bg-rose-500/15';
  }
  return 'border-zinc-200 bg-zinc-50 text-zinc-600 opacity-70 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:bg-zinc-950/50';
};

const answerBadgeClass = (index) => {
  if (!answered.value) {
    return 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300';
  }
  if (index === currentQuestion.value?.c) {
    return 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950';
  }
  if (index === selectedAnswer.value) {
    return 'bg-rose-600 text-white dark:bg-rose-400 dark:text-rose-950';
  }
  return 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400';
};

const restartDuel = () => {
  if (selectedCourse.value) startDuel(selectedCourse.value);
};

const resetToSelect = () => {
  stopTimer();
  phase.value = 'select';
  selectedCourse.value = null;
  duelQuestions.value = [];
  resetScores();
};

const stopTimer = () => {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
};

onMounted(fetchCourses);
onBeforeUnmount(stopTimer);
</script>
