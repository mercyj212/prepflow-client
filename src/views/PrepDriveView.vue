<template>
  <div class="fixed inset-0 bg-black z-50 flex flex-col">
    <!-- Thin top bar shown only before game loads -->
    <div
      v-if="loading && !selectingCourse"
      class="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-6"
    >
      <div class="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full bg-white animate-pulse w-1/2 rounded-full"></div>
      </div>
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
        Initializing Tactical Drive...
      </p>
    </div>

    <!-- Course Selection Screen -->
    <div v-if="selectingCourse" ref="selectionContainer" class="absolute inset-0 bg-black z-40 flex flex-col items-center p-6 overflow-y-auto pt-24 pb-24">
        <div class="max-w-5xl w-full">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <h1 class="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">SELECT MISSION</h1>
                    <p class="text-zinc-500 uppercase text-[10px] tracking-[0.5em] font-bold">CHOOSE YOUR SUBJECT FOCUS</p>
                </div>
                <div v-if="loadingCourses" class="flex items-center gap-3 mb-2">
                    <div class="w-4 h-4 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
                    <span class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Scanning Database...</span>
                </div>
            </div>

            <!-- TEST MISSION (FOR DEBUGGING) -->
            <div class="mb-12">
                <h2 class="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    SYSTEM DIAGNOSTICS
                    <div class="h-[1px] bg-amber-900/30 flex-1"></div>
                </h2>
                <div @click="selectCourse('test')" class="max-w-md group cursor-pointer border border-amber-900/30 bg-amber-900/5 p-8 rounded-3xl hover:border-amber-500 hover:bg-amber-900/20 transition-all duration-300">
                    <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    </div>
                    <h3 class="text-amber-500 font-bold text-xl uppercase tracking-tight">Test Mission</h3>
                    <p class="text-amber-700/60 text-sm mt-2 leading-relaxed">Rapid diagnostics mode with simplified calculations for verifying level stability.</p>
                </div>
            </div>

            <!-- Always show Mixed Mode at the top -->
            <div class="mb-12">
                <h2 class="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    GENERAL OPERATIONS
                    <div class="h-[1px] bg-zinc-800 flex-1"></div>
                </h2>
                <div @click="selectCourse(null)" class="max-w-md group cursor-pointer border border-zinc-800 bg-zinc-900/30 p-8 rounded-3xl hover:border-white hover:bg-zinc-900/50 transition-all duration-300">
                    <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h3 class="text-white font-bold text-xl uppercase tracking-tight">Mixed Mode</h3>
                    <p class="text-zinc-500 text-sm mt-2 leading-relaxed">Cross-departmental assessment covering all available topics in the database.</p>
                </div>
            </div>

            <!-- Loading Skeletons -->
            <div v-if="loadingCourses" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                <div v-for="i in 3" :key="i" class="border border-zinc-800 bg-zinc-900/10 p-8 rounded-3xl">
                    <BaseSkeleton width="56px" height="56px" customClass="!rounded-2xl mb-6" />
                    <BaseSkeleton width="66%" height="24px" customClass="mb-4" />
                    <BaseSkeleton width="100%" height="16px" />
                </div>
            </div>

            <!-- Categorized Subject Groups -->
            <div v-for="(groupCourses, path) in groupedCourses" :key="path" class="mb-12">
                <div v-if="groupCourses.length > 0">
                    <h2 class="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                        {{ pathLabel(path) }}
                        <div class="h-[1px] bg-zinc-800 flex-1"></div>
                    </h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="course in groupCourses" :key="course._id" @click="selectCourse(course._id)" class="group cursor-pointer border border-zinc-800 bg-zinc-900/30 p-8 rounded-3xl hover:border-white hover:bg-zinc-900/50 transition-all duration-300">
                            <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <span class="font-black text-sm">{{ course.title.substring(0, 3) }}</span>
                            </div>
                            <h3 class="text-white font-bold text-xl uppercase tracking-tight">{{ course.title }}</h3>
                            <p class="text-zinc-500 text-sm mt-2 leading-relaxed line-clamp-2">{{ course.description || 'Specialized focus on ' + course.title + ' curriculum.' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-16 flex justify-center">
                <button @click="router.push('/games')" class="text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] border-b border-transparent hover:border-white pb-1">
                    RETURN TO OPERATIONS
                </button>
            </div>
        </div>
    </div>

    <!-- The actual game — full-screen iframe -->
    <iframe
      ref="gameFrame"
      src="/prepdrive/index.html"
      class="w-full h-full border-0"
      :class="loading || showLevelSelect ? 'opacity-0' : 'opacity-100'"
      style="transition: opacity 0.4s ease;"
      allow="autoplay"
      @load="onFrameLoad"
    />

    <!-- Level Selector Modal -->
    <div v-if="showLevelSelect" class="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
        <div class="max-w-4xl w-full text-center">
            <h1 class="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">SELECT MISSION TIER</h1>
            <p class="text-zinc-500 uppercase text-[10px] tracking-[0.5em] font-bold mb-12">CHOOSE YOUR STARTING DIFFICULTY</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div v-for="lvl in 5" :key="lvl"
                     @click="lvl <= maxUnlockedLevel ? startAtLevel(lvl) : null"
                     :class="[
                       'border rounded-3xl p-8 transition-all duration-300 relative',
                       lvl <= maxUnlockedLevel
                         ? 'group cursor-pointer border-zinc-800 bg-zinc-900/30 hover:border-white hover:bg-zinc-800'
                         : 'cursor-not-allowed border-zinc-900 bg-zinc-950 opacity-50'
                     ]">
                    <!-- Lock icon for locked levels -->
                    <div v-if="lvl > maxUnlockedLevel" class="absolute top-3 right-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-700"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <div class="text-4xl font-black mb-2 transition-transform"
                         :class="lvl <= maxUnlockedLevel ? 'text-white group-hover:scale-110' : 'text-zinc-700'">
                        {{ lvl }}
                    </div>
                    <div class="text-[9px] font-black uppercase tracking-widest"
                         :class="lvl <= maxUnlockedLevel ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-800'">
                        {{ lvl <= maxUnlockedLevel ? 'Level' : 'Locked' }}
                    </div>
                </div>
            </div>

            <button @click="showLevelSelect = false; selectingCourse = true" class="mt-16 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors">
                Back to Mission List
            </button>
        </div>
    </div>

    <!-- Mission Report Overlay -->
    <div v-if="missionReport" class="absolute inset-0 bg-zinc-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8">
        <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Mission Report</h2>
        <p class="text-emerald-400 font-mono mb-8">Score: {{ missionReport.score }} | Awards: {{ missionReport.awards }}</p>

        <h3 class="text-xl font-semibold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">Analytics & Debrief</h3>
        
        <div v-if="missionReport.failedQuestions && missionReport.failedQuestions.length > 0" class="space-y-4">
          <div v-for="(q, idx) in missionReport.failedQuestions" :key="idx" class="bg-zinc-800/50 p-4 rounded-xl border border-rose-900/30">
            <p class="text-zinc-200 font-medium mb-2">{{ q.q }}</p>
            <div class="text-sm">
              <p class="text-rose-400">Your selection was incorrect.</p>
              <p class="text-emerald-400 mt-1">Correct Answer: {{ q.a[q.c] }}</p>
            </div>
            <div class="mt-3 text-xs text-zinc-500 italic border-t border-zinc-700/50 pt-2">
              {{ q.rationale || 'Review this concept in your study materials.' }}
            </div>
          </div>
        </div>
        <div v-else class="text-zinc-400 italic bg-zinc-800/30 p-4 rounded-xl text-center">
          Perfect Run! No incorrect answers recorded.
        </div>

        <button @click="closeReport" class="mt-8 w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
          Return to Hub
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';

const router = useRouter();
const loading = ref(true);
const iframeLoaded = ref(false);
const gameFrame = ref(null);
const questions = ref([]);
const missionReport = ref(null);
const selectingCourse = ref(true);
const showLevelSelect = ref(false);
const loadingCourses = ref(true);
const courses = ref([]);
const activeCourseId = ref(null);
const selectedStartLevel = ref(null);
const maxUnlockedLevel = ref(1);

const groupedCourses = computed(() => {
  const groups = {
    university: [],
    polytechnic: [],
    entrance: [],
    other: []
  };
  
  courses.value.forEach(course => {
    const p = course.path ? course.path.toLowerCase() : 'other';
    if (groups[p]) groups[p].push(course);
    else groups.other.push(course);
  });
  
  return groups;
});

const pathLabel = (path) => {
  const labels = {
    university: 'UNIVERSITY PATHWAY',
    polytechnic: 'POLYTECHNIC PATHWAY',
    entrance: 'ENTRANCE / CBT EXAMS',
    other: 'SUPPLEMENTARY SUBJECTS'
  };
  return labels[path] || 'OTHER';
};

const tryInitGame = () => {
  console.log('Attempting Init:', { iframeLoaded: iframeLoaded.value, hasQuestions: questions.value.length > 0, selecting: selectingCourse.value });
  
  if (iframeLoaded.value && gameFrame.value && !selectingCourse.value) {
    // If no questions found for a specific course, provide a tactical fallback set
    const finalQuestions = questions.value.length > 0 ? questions.value : [
      { q: "RECONNAISSANCE: Are you ready to proceed with the mission?", a: ["AFFIRMATIVE", "NEGATIVE", "STANDBY", "RETRY"], c: 0, expl: "Tactical initialization sequence active." },
      { q: "SYSTEM CHECK: Engines primed and ready?", a: ["READY", "NOT READY", "CHECKING", "ABORT"], c: 0, expl: "Engine calibration complete." }
    ];

    gameFrame.value.contentWindow.postMessage({
      type: 'INIT_GAME',
      questions: JSON.parse(JSON.stringify(finalQuestions)),
      courseId: activeCourseId.value,
      startLevel: selectedStartLevel.value
    }, '*');
    
    // Ensure loading screen is cleared
    loading.value = false;
    selectedStartLevel.value = null; // Clear for next use
  }
};

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await api.get('/game/courses');
    if (res.data.success) {
      courses.value = res.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch courses', error);
  } finally {
    loadingCourses.value = false;
  }
};

const selectCourse = async (courseId) => {
  activeCourseId.value = courseId;
  selectingCourse.value = false;
  showLevelSelect.value = true; // Show level selector

  // Test mission bypasses locking — all levels open for diagnostics
  if (courseId === 'test') {
    maxUnlockedLevel.value = 5;
  } else {
    const storageKey = `prepdrive_progression_${courseId || 'default'}`;
    const saved = parseInt(localStorage.getItem(storageKey));
    maxUnlockedLevel.value = isNaN(saved) ? 1 : saved;
  }
  
  loading.value = true;
  if (courseId === 'test') {
    // Inject 150 extremely simple questions for rapid level-up testing
    const easySet = [];
    for (let i = 1; i <= 150; i++) {
      easySet.push({
        q: `DIAGNOSTIC TEST ${i}: What is ${i} + 0?`,
        a: [`${i}`, `${i+1}`, `${i+2}`, `${i+3}`],
        c: 0,
        expl: "Diagnostic verification successful."
      });
    }
    questions.value = easySet;
  } else {
    await fetchQuestions(courseId);
  }
};

const startAtLevel = (lvl) => {
  selectedStartLevel.value = lvl;
  showLevelSelect.value = false;
  tryInitGame();
};

const fetchQuestions = async (courseId = null) => {
  if (courseId === 'test') return; // Handled in selectCourse
  try {
    const res = await api.get('/game/questions', {
      params: { courseId }
    });
    if (res.data.success) {
      questions.value = res.data.data;
      tryInitGame();
    }
  } catch (error) {
    console.error('Failed to fetch questions', error);
  }
};

const onFrameLoad = () => {
  loading.value = false;
  iframeLoaded.value = true;
  tryInitGame();
};

const handleMessage = async (event) => {
  if (event.data === 'EXIT_PREPDRIVE') {
    router.push('/games');
  } else if (event.data && event.data.type === 'GAME_OVER') {
    // Show report
    missionReport.value = {
      score: event.data.score,
      awards: event.data.awards,
      failedQuestions: event.data.failedQuestions
    };
    
    // Submit score to backend
    try {
      await api.post('/game/score', {
        score: event.data.score,
        awards: event.data.awards
      });
    } catch (err) {
      console.error('Error saving score:', err);
    }
  }
};

const selectionContainer = ref(null);

const closeReport = () => {
  missionReport.value = null;
  selectingCourse.value = true;
  if (selectionContainer.value) selectionContainer.value.scrollTop = 0;
  loading.value = true;
  iframeLoaded.value = false;
  // Reload the iframe to ensure a clean state for the next run
  if (gameFrame.value) {
    gameFrame.value.src = "/prepdrive/index.html";
  }
};

onMounted(async () => {
  await fetchCourses();
  window.addEventListener('message', handleMessage);
  
  // Safety fallback for frame loading - now independent of selection
  setTimeout(() => {
    if (!iframeLoaded.value) {
      console.log('Forcing frame load state via safety timeout');
      onFrameLoad();
    }
  }, 2000);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>
