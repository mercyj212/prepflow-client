<template>
  <NeoAppShell>
    <div class="min-h-full bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section class="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header class="mb-8 border-b border-zinc-200 pb-6 dark:border-white/10">
          <button
            @click="router.push('/games')"
            class="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft :size="16" :stroke-width="2.5" />
            Back to Games
          </button>

          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div class="mb-3 flex items-center gap-3">
                <Network :size="20" :stroke-width="1.8" class="text-zinc-500" />
                <span class="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-500">Concept Mapping</span>
              </div>
              <h1 class="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                Build The Knowledge Map
              </h1>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Match each question prompt to the concept that completes it. Paid course access is required.
              </p>
            </div>

            <div v-if="phase !== 'select'" class="grid grid-cols-4 gap-2 rounded-[24px] border border-zinc-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div class="px-4 py-3 text-center">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mapped</p>
                <p class="mt-1 text-xl font-semibold">{{ solvedCount }}/{{ pairs.length }}</p>
              </div>
              <div class="px-4 py-3 text-center">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Score</p>
                <p class="mt-1 text-xl font-semibold text-emerald-500">{{ score }}</p>
              </div>
              <div class="px-4 py-3 text-center">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Combo</p>
                <p class="mt-1 text-xl font-semibold text-sky-500">x{{ streak }}</p>
              </div>
              <div class="px-4 py-3 text-center">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Misses</p>
                <p class="mt-1 text-xl font-semibold text-rose-500">{{ misses }}/{{ MAX_MISSES }}</p>
              </div>
            </div>
          </div>
        </header>

        <div v-if="phase === 'select'" class="space-y-8">
          <section class="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px] bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
              <BrainCircuit :size="24" :stroke-width="1.8" />
            </div>
            <h2 class="text-xl font-semibold">How Concept Mapping Works</h2>
            <div class="mt-5 grid gap-4 md:grid-cols-3">
              <div v-for="rule in rules" :key="rule.title" class="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800/70">
                <p class="text-sm font-semibold">{{ rule.title }}</p>
                <p class="mt-1 text-sm leading-relaxed text-zinc-500">{{ rule.copy }}</p>
              </div>
            </div>
          </section>

          <section>
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Choose Mapping Course</h2>
                <p class="text-sm text-zinc-500">Locked courses will take you to checkout.</p>
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
                    class="group flex min-h-48 flex-col rounded-[24px] border bg-white p-5 text-left shadow-sm transition-all dark:bg-zinc-900"
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
                        {{ course.hasGameAccess ? 'Start Mapping' : 'Pay to Unlock' }}
                      </span>
                      <ArrowRight :size="18" :stroke-width="2.5" class="text-zinc-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="space-y-6">
          <section class="grid gap-3 lg:grid-cols-[1fr_160px_160px_160px]">
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Course</p>
              <h2 class="mt-2 text-xl font-semibold leading-tight">{{ selectedCourse?.title }}</h2>
              <p class="mt-2 text-sm text-zinc-500">{{ courseMeta(selectedCourse) }}</p>
            </div>
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Attempts</p>
              <p class="mt-2 text-2xl font-semibold">{{ attempts }}</p>
            </div>
            <div class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Streak</p>
              <p class="mt-2 text-2xl font-semibold">{{ streak }}</p>
            </div>
            <button
              @click="resetToSelect"
              class="rounded-[24px] border border-zinc-200 bg-white p-5 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 shadow-sm transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white dark:hover:text-white"
            >
              Change Course
            </button>
          </section>

          <main class="rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8">
            <div v-if="loadingQuestions" class="flex min-h-[420px] flex-col items-center justify-center gap-4 text-zinc-500">
              <LoaderCircle :size="34" class="animate-spin" />
              <p class="text-[10px] font-black uppercase tracking-[0.3em]">Building Map</p>
            </div>

            <div v-else-if="phase === 'result'" class="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-500/10 text-emerald-500">
                <BadgeCheck :size="38" :stroke-width="1.8" />
              </div>
              <p class="text-[10px] font-black uppercase tracking-[0.34em] text-zinc-400">Map Complete</p>
              <h2 class="mt-3 text-4xl font-semibold tracking-tight">You connected the concepts</h2>
              <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">{{ resultCopy }}</p>

              <div class="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 text-left lg:grid-cols-4">
                <div class="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-950/50">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Final Score</p>
                  <p class="mt-2 text-2xl font-semibold">{{ score }}</p>
                </div>
                <div class="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-950/50">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Accuracy</p>
                  <p class="mt-2 text-2xl font-semibold">{{ accuracy }}%</p>
                </div>
                <div class="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-950/50">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Best Combo</p>
                  <p class="mt-2 text-2xl font-semibold text-sky-500">x{{ maxStreak }}</p>
                </div>
                <div class="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-950/50">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Misses</p>
                  <p class="mt-2 text-2xl font-semibold text-rose-500">{{ misses }}</p>
                </div>
              </div>

              <div class="mt-6 grid w-full max-w-3xl gap-3 text-left md:grid-cols-2">
                <div class="rounded-[22px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Strongest Concept</p>
                  <p class="mt-2 text-sm font-semibold text-emerald-950 dark:text-emerald-50">{{ strongestConcept }}</p>
                </div>
                <div class="rounded-[22px] border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <p class="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-300">Weak Areas</p>
                  <p class="mt-2 text-sm font-semibold text-amber-950 dark:text-amber-50">{{ weakAreas }}</p>
                </div>
              </div>
              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <button @click="restartMap" class="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
                  <RotateCcw :size="16" />
                  Remap
                </button>
                <button @click="resetToSelect" class="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white">
                  <BookOpen :size="16" />
                  Change Course
                </button>
              </div>
            </div>

            <div v-else>
              <div class="mb-8">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Drag a concept into a prompt slot, or tap both cards</p>
                    <p class="mt-2 text-sm text-zinc-500">Hints unlock after two misses on the same prompt. Three total misses ends the round.</p>
                  </div>
                  <div class="rounded-2xl border border-zinc-200 px-4 py-3 text-right dark:border-white/10">
                    <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Next Match</p>
                    <p class="text-sm font-semibold text-emerald-500">+{{ nextMatchPoints }} pts</p>
                  </div>
                </div>
                <div class="mt-3 h-2 w-72 max-w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div class="h-full rounded-full bg-zinc-900 transition-all dark:bg-white" :style="{ width: `${progressPercent}%` }"></div>
                </div>
              </div>

              <div class="relative grid gap-6 lg:grid-cols-[1.15fr_0.08fr_0.9fr]">
                <div v-if="feedback" class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <span
                    class="feedback-pop text-5xl font-black uppercase italic tracking-tighter sm:text-6xl"
                    :class="feedback.correct ? 'text-emerald-500' : 'text-red-500'"
                  >
                    {{ feedback.correct ? 'CORRECT' : 'WRONG' }}
                  </span>
                </div>

                <section>
                  <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Prompt Drop Zones</h3>
                  <div class="space-y-3">
                    <div
                      v-for="pair in promptCards"
                      :key="pair.id"
                      @click="selectPrompt(pair)"
                      @dragenter.prevent="setDropPrompt(pair)"
                      @dragover.prevent="setDropPrompt(pair)"
                      @dragleave="clearDropPrompt(pair)"
                      @drop.prevent="dropConceptOnPrompt(pair)"
                      role="button"
                      tabindex="0"
                      @keydown.enter.prevent="selectPrompt(pair)"
                      @keydown.space.prevent="selectPrompt(pair)"
                      class="w-full rounded-[22px] border p-5 text-left text-sm font-semibold leading-relaxed transition-all"
                      :class="promptClass(pair)"
                    >
                      <div class="mb-3 flex items-center justify-between gap-3">
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node {{ pair.label }}</span>
                        <div class="flex items-center gap-2">
                          <span v-if="pair.misses > 0 && !pair.solved" class="rounded-full bg-rose-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-rose-500">{{ pair.misses }} miss</span>
                          <CheckCircle2 v-if="pair.solved" :size="18" class="text-emerald-500" />
                        </div>
                      </div>
                      <p>{{ pair.prompt }}</p>

                      <div class="mt-4 flex items-center gap-3">
                        <div class="connection-dot" :class="pair.solved ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'"></div>
                        <div class="connection-line" :class="pair.solved ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800'"></div>
                        <div class="min-h-12 flex-1 rounded-2xl border border-dashed px-4 py-3 text-sm transition-all" :class="answerSlotClass(pair)">
                          <span v-if="pair.solved" class="font-semibold">{{ pair.matchedAnswer }}</span>
                          <span v-else class="text-zinc-400">Drop concept here</span>
                        </div>
                      </div>

                      <div v-if="pair.showHint && !pair.solved" class="mt-4 flex gap-2 rounded-2xl bg-amber-500/10 p-3 text-amber-700 dark:text-amber-200">
                        <Lightbulb :size="16" class="mt-0.5 shrink-0" />
                        <p class="text-xs leading-relaxed">{{ pair.hint }}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div class="hidden items-center justify-center lg:flex">
                  <div class="h-full min-h-96 w-px bg-zinc-200 dark:bg-white/10"></div>
                </div>

                <section>
                  <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Available Concepts</h3>
                  <div class="space-y-3">
                    <div
                      v-for="concept in availableConcepts"
                      :key="concept.id"
                      @click="selectConcept(concept)"
                      :draggable="!concept.solved"
                      @dragstart="startConceptDrag($event, concept)"
                      @dragend="endConceptDrag"
                      role="button"
                      tabindex="0"
                      @keydown.enter.prevent="selectConcept(concept)"
                      @keydown.space.prevent="selectConcept(concept)"
                      class="w-full rounded-[22px] border p-5 text-left text-sm font-semibold leading-relaxed transition-all"
                      :class="conceptClass(concept)"
                    >
                      <div class="mb-3 flex items-center justify-between gap-3">
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Concept {{ concept.label }}</span>
                        <CheckCircle2 v-if="concept.solved" :size="18" class="text-emerald-500" />
                      </div>
                      {{ concept.answer }}
                    </div>
                    <div v-if="availableConcepts.length === 0" class="rounded-[22px] border border-dashed border-zinc-200 p-6 text-center text-sm font-semibold text-zinc-400 dark:border-white/10">
                      All concepts are connected.
                    </div>
                  </div>
                </section>
              </div>

              <div v-if="feedback" class="mt-6 rounded-[24px] border p-5" :class="feedback.correct ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100'">
                <p class="text-sm font-semibold">{{ feedback.title }}</p>
                <p class="mt-1 text-sm opacity-80">{{ feedback.copy }}</p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  Lock,
  Network,
  RotateCcw
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
const pairs = ref([]);
const promptCards = ref([]);
const conceptCards = ref([]);
const selectedPrompt = ref(null);
const selectedConcept = ref(null);
const draggedConcept = ref(null);
const dropPromptId = ref(null);
const feedback = ref(null);
const score = ref(0);
const misses = ref(0);
const attempts = ref(0);
const streak = ref(0);
const maxStreak = ref(0);
const roundEndedByMisses = ref(false);
const MAX_MISSES = 3;

const rules = [
  { title: 'Paid courses only', copy: 'Concept maps open from courses that are already unlocked on your account.' },
  { title: 'Connect meaning', copy: 'Choose a prompt on the left, then match it to the correct concept on the right.' },
  { title: 'Learn patterns', copy: 'Every correct link reinforces the relationship between a question and its answer.' }
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

const solvedCount = computed(() => pairs.value.filter(pair => pair.solved).length);
const progressPercent = computed(() => pairs.value.length ? (solvedCount.value / pairs.value.length) * 100 : 0);
const availableConcepts = computed(() => conceptCards.value.filter(concept => !concept.solved));
const nextMatchPoints = computed(() => 100 + streak.value * 25);
const accuracy = computed(() => {
  if (!attempts.value) return 0;
  return Math.round((solvedCount.value / attempts.value) * 100);
});
const resultCopy = computed(() => {
  if (roundEndedByMisses.value) {
    return `Round ended after ${MAX_MISSES} misses. You mapped ${solvedCount.value} of ${pairs.value.length} concepts.`;
  }
  return `Score ${score.value} with ${misses.value} misses. Try a remap to make the relationships stick.`;
});
const strongestConcept = computed(() => {
  const cleanPairs = pairs.value.filter(pair => pair.solved && pair.misses === 0);
  return cleanPairs[0]?.answer || pairs.value.find(pair => pair.solved)?.answer || 'No clean match yet';
});
const weakAreas = computed(() => {
  const weak = pairs.value
    .filter(pair => pair.misses > 0 || !pair.solved)
    .slice(0, 2)
    .map(pair => pair.answer);
  return weak.length ? weak.join(' / ') : 'No weak areas detected';
});

const shuffleArray = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

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
  return parts.length ? parts.join(' / ') : 'Course concept map';
};

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await api.get('/game/courses');
    if (res.data.success) courses.value = res.data.data || [];
  } catch (error) {
    console.error('Failed to fetch mapping courses:', error);
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
  await startMap(course);
};

const startMap = async (course) => {
  resetMap();
  phase.value = 'map';
  loadingQuestions.value = true;

  try {
    const res = await api.get('/game/questions', { params: { courseId: course._id } });
    if (res.data.success) {
      const questions = (res.data.data || []).filter(question => question.q && Array.isArray(question.a) && question.a[question.c]);
      buildPairs(questions.slice(0, 6));
    }
  } catch (error) {
    console.error('Failed to fetch mapping questions:', error);
    if (error.response?.status === 403) router.push(`/checkout/${course._id}`);
  } finally {
    loadingQuestions.value = false;
  }
};

const buildPairs = (questions) => {
  pairs.value = questions.map((question, index) => ({
    id: `${index}-${question.c}`,
    label: String.fromCharCode(65 + index),
    prompt: question.q,
    answer: question.a[question.c],
    explanation: question.expl || 'Review this relationship in your course material.',
    hint: buildHint(question.a[question.c]),
    matchedAnswer: '',
    misses: 0,
    showHint: false,
    solved: false
  }));
  promptCards.value = shuffleArray(pairs.value);
  conceptCards.value = shuffleArray(pairs.value.map(pair => ({ ...pair })));
  if (pairs.value.length === 0) phase.value = 'result';
};

const buildHint = (answer) => {
  const cleanAnswer = String(answer || '').trim();
  if (!cleanAnswer) return 'Think about the key term that completes this relationship.';
  const firstWord = cleanAnswer.split(/\s+/)[0] || cleanAnswer;
  return `The answer starts with "${firstWord.slice(0, 1).toUpperCase()}" and has ${cleanAnswer.length} characters.`;
};

const selectPrompt = (pair) => {
  if (pair.solved) return;
  selectedPrompt.value = pair;
  feedback.value = null;
  if (selectedConcept.value) checkMatch();
};

const selectConcept = (concept) => {
  if (concept.solved) return;
  selectedConcept.value = concept;
  feedback.value = null;
  if (selectedPrompt.value) checkMatch();
};

const startConceptDrag = (event, concept) => {
  if (concept.solved) return;
  draggedConcept.value = concept;
  selectedConcept.value = concept;
  feedback.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', concept.id);
  }
};

const endConceptDrag = () => {
  draggedConcept.value = null;
  dropPromptId.value = null;
};

const setDropPrompt = (pair) => {
  if (pair.solved || !draggedConcept.value) return;
  dropPromptId.value = pair.id;
};

const clearDropPrompt = (pair) => {
  if (dropPromptId.value === pair.id) {
    dropPromptId.value = null;
  }
};

const dropConceptOnPrompt = (pair) => {
  if (pair.solved || !draggedConcept.value) return;
  selectedPrompt.value = pair;
  selectedConcept.value = draggedConcept.value;
  draggedConcept.value = null;
  dropPromptId.value = null;
  checkMatch();
};

const checkMatch = () => {
  attempts.value += 1;
  const correct = selectedPrompt.value?.id === selectedConcept.value?.id;
  const isCompletingMap = correct && solvedCount.value + 1 >= pairs.value.length;
  const selectedPromptId = selectedPrompt.value?.id;

  if (correct) {
    const solvedId = selectedPrompt.value.id;
    const matchedAnswer = selectedConcept.value.answer;
    pairs.value = pairs.value.map(pair => pair.id === solvedId ? { ...pair, matchedAnswer, solved: true } : pair);
    promptCards.value = promptCards.value.map(pair => pair.id === solvedId ? { ...pair, matchedAnswer, solved: true } : pair);
    conceptCards.value = conceptCards.value.map(pair => pair.id === solvedId ? { ...pair, solved: true } : pair);
    streak.value += 1;
    maxStreak.value = Math.max(maxStreak.value, streak.value);
    score.value += 100 + Math.max(streak.value - 1, 0) * 25;
    feedback.value = {
      correct: true,
      title: 'Correct',
      copy: selectedPrompt.value.explanation
    };
  } else {
    streak.value = 0;
    misses.value += 1;
    score.value = Math.max(0, score.value - 20);
    pairs.value = pairs.value.map(pair => pair.id === selectedPromptId ? { ...pair, misses: pair.misses + 1, showHint: pair.misses + 1 >= 2 } : pair);
    promptCards.value = promptCards.value.map(pair => pair.id === selectedPromptId ? { ...pair, misses: pair.misses + 1, showHint: pair.misses + 1 >= 2 } : pair);
    feedback.value = {
      correct: false,
      title: 'Wrong',
      copy: misses.value >= MAX_MISSES ? 'Round limit reached. Review the weak areas and remap.' : 'Try another concept. The correct relationship should answer the selected prompt directly.'
    };
  }

  selectedPrompt.value = null;
  selectedConcept.value = null;

  if (!correct && misses.value >= MAX_MISSES) {
    roundEndedByMisses.value = true;
    window.setTimeout(() => {
      phase.value = 'result';
    }, 750);
  } else if (isCompletingMap) {
    window.setTimeout(() => {
      phase.value = 'result';
    }, 650);
  } else {
    window.setTimeout(() => {
      feedback.value = null;
    }, 750);
  }
};

const promptClass = (pair) => {
  if (pair.solved) return 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100';
  if (dropPromptId.value === pair.id) return 'border-brand bg-brand/10 text-zinc-950 ring-4 ring-brand/10 dark:border-brand dark:bg-brand/10 dark:text-white';
  if (selectedPrompt.value?.id === pair.id) return 'border-zinc-900 bg-white text-zinc-950 shadow-sm dark:border-white dark:bg-zinc-800 dark:text-white';
  return 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-900 hover:bg-white dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:border-white/40 dark:hover:bg-zinc-900';
};

const answerSlotClass = (pair) => {
  if (pair.solved) return 'border-emerald-300 bg-white text-emerald-950 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-50';
  if (dropPromptId.value === pair.id) return 'border-brand bg-brand/10 text-zinc-900 dark:border-brand dark:text-white';
  if (selectedPrompt.value?.id === pair.id) return 'border-zinc-900 bg-white dark:border-white dark:bg-zinc-900';
  return 'border-zinc-200 bg-white/70 dark:border-white/10 dark:bg-zinc-950/40';
};

const conceptClass = (concept) => {
  if (concept.solved) return 'cursor-default border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100';
  if (draggedConcept.value?.id === concept.id) return 'cursor-grabbing border-brand bg-brand/10 text-zinc-950 opacity-70 ring-4 ring-brand/10 dark:border-brand dark:bg-brand/10 dark:text-white';
  if (selectedConcept.value?.id === concept.id) return 'cursor-grab border-zinc-900 bg-white text-zinc-950 shadow-sm dark:border-white dark:bg-zinc-800 dark:text-white';
  return 'cursor-grab border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-900 hover:bg-white active:cursor-grabbing dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:border-white/40 dark:hover:bg-zinc-900';
};

const restartMap = () => {
  if (selectedCourse.value) startMap(selectedCourse.value);
};

const resetMap = () => {
  pairs.value = [];
  promptCards.value = [];
  conceptCards.value = [];
  selectedPrompt.value = null;
  selectedConcept.value = null;
  draggedConcept.value = null;
  dropPromptId.value = null;
  feedback.value = null;
  score.value = 0;
  misses.value = 0;
  attempts.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  roundEndedByMisses.value = false;
};

const resetToSelect = () => {
  resetMap();
  selectedCourse.value = null;
  phase.value = 'select';
};

onMounted(fetchCourses);
</script>

<style scoped>
.feedback-pop {
  animation: feedback-pop 650ms ease-out both;
}

.connection-dot {
  height: 12px;
  width: 12px;
  flex: 0 0 auto;
  border-radius: 9999px;
}

.connection-line {
  height: 2px;
  width: 42px;
  flex: 0 0 auto;
  border-radius: 9999px;
}

@keyframes feedback-pop {
  0% {
    opacity: 0;
    transform: scale(0.82);
  }
  22% {
    opacity: 1;
    transform: scale(1.06);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
