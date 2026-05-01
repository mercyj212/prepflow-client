<template>
  <div class="fixed inset-0 bg-black z-50 flex flex-col no-shake">
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
                    <button @click="router.push('/games')" class="mb-8 inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to Games
                    </button>
                    <h1 class="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">SELECT MISSION</h1>
                    <p class="text-zinc-500 uppercase text-[10px] tracking-[0.5em] font-bold">CHOOSE YOUR SUBJECT FOCUS</p>
                </div>
                <div v-if="loadingCourses" class="flex items-center gap-3 mb-2">
                    <div class="w-4 h-4 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
                    <span class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Scanning Database...</span>
                </div>
            </div>

            <div class="mb-12">
                <h2 class="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    COURSE ACCESS REQUIRED
                    <div class="h-[1px] bg-zinc-800 flex-1"></div>
                </h2>
                <p class="max-w-2xl text-zinc-500 text-sm leading-relaxed">
                    PrepDrive missions unlock per course. Pay for a course anywhere on PrepUp CBT, then return here to play that course game.
                </p>
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
                        <div 
                          v-for="course in groupCourses" 
                          :key="course._id" 
                          @click="handleCourseClick(course)" 
                          class="group relative p-8 rounded-3xl border transition-all duration-500 overflow-hidden"
                          :class="[
                            course.hasGameAccess 
                              ? 'cursor-pointer border-zinc-800 bg-zinc-900/30 hover:border-white hover:bg-zinc-900/50' 
                              : 'cursor-pointer border-zinc-900 bg-zinc-950/20 grayscale opacity-60'
                          ]"
                        >
                            <!-- Lock Overlay for unpaid courses -->
                            <div v-if="!course.hasGameAccess" class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="bg-amber-500 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transform -rotate-2">
                                    Payment Required
                                </div>
                            </div>

                            <div 
                              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                              :class="[
                                course.hasGameAccess 
                                  ? 'bg-white/5 group-hover:bg-white group-hover:text-black' 
                                  : 'bg-zinc-900 text-zinc-700'
                              ]"
                            >
                                <span v-if="course.hasGameAccess" class="font-black text-sm">{{ course.title.substring(0, 3) }}</span>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <div class="flex items-start justify-between gap-4">
                                <h3 class="text-white font-bold text-xl uppercase tracking-tight">{{ course.title }}</h3>
                                <span 
                                  class="px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0" 
                                  :class="[
                                    course.hasGameAccess ? 'bg-emerald-500/10 text-emerald-400' : 
                                    'bg-amber-500/10 text-amber-400'
                                  ]"
                                >
                                  {{ accessLabel(course) }}
                                </span>
                            </div>
                            <p class="text-zinc-500 text-sm mt-2 leading-relaxed line-clamp-2">{{ course.description || 'Specialized focus on ' + course.title + ' curriculum.' }}</p>
                            <p 
                              class="text-[10px] font-black uppercase tracking-widest mt-5" 
                              :class="[
                                course.hasGameAccess ? 'text-emerald-400' : 
                                'text-amber-400'
                              ]"
                            >
                              {{ course.hasGameAccess ? accessActionLabel(course) : 'Unlock Course Game' }}
                            </p>
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
      v-if="gameStarted"
      :key="gameFrameKey"
      ref="gameFrame"
      :src="gameFrameSrc"
      class="w-full h-full border-0"
      :class="loading || showLevelSelect ? 'opacity-0' : 'opacity-100'"
      style="transition: opacity 0.4s ease;"
      allow="autoplay; accelerometer; gyroscope"
      @load="onFrameLoad"
    />

    <!-- Level Selector Modal -->
    <div v-if="showLevelSelect" class="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
        <div class="max-w-4xl w-full text-center">
            <div class="flex items-center gap-6 mb-12 text-left">
                <button @click="showLevelSelect = false; selectingCourse = true" 
                        class="group w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div>
                    <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">SELECT MISSION TIER</h1>
                    <p class="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">CHOOSE YOUR STARTING DIFFICULTY</p>
                </div>
            </div>
            
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

        <div v-if="activeCoursePreview && previewSuccess" class="mt-6 p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
            <h3 class="text-emerald-500 font-bold mb-2">Preview Completed Successfully!</h3>
            <p class="text-sm text-zinc-400 mb-4">You have reached the end of the free preview. To continue your journey to Level 2 and unlock the full driving simulation, secure your access now.</p>
            <button @click="$router.push(`/checkout/${activeCourseId}`)" class="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                Pay to Continue
            </button>
        </div>
        <div v-else-if="activeCoursePreview && !previewSuccess" class="mt-6 p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 text-center">
            <h3 class="text-rose-500 font-bold mb-2">Mission Failed</h3>
            <p class="text-sm text-zinc-400 mb-4">You didn't complete the mission objectives. Try again to experience the full potential of PrepDrive!</p>
            <button @click="closeReport" class="w-full bg-zinc-800 text-white py-3 rounded-lg font-bold hover:bg-zinc-700 transition-colors">
                Try Again
            </button>
        </div>

        <button @click="closeReport" class="mt-4 w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
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
const gameStarted = ref(false);
const gameFrame = ref(null);
const questions = ref([]);
const missionReport = ref(null);
const selectingCourse = ref(true);
const showLevelSelect = ref(false);
const loadingCourses = ref(true);
const courses = ref([]);
const activeCourseId = ref(null);
const selectedStartLevel = ref(null);
const gameFrameKey = ref(0);
const maxUnlockedLevel = ref(1);
const activeCoursePreview = ref(false);
const previewSuccess = ref(false);

const gameFrameSrc = computed(() => {
  const path = activeCourseId.value === 'zen' ? '/prepdrive/standard.html' : '/prepdrive/index.html';
  const level = selectedStartLevel.value || 1;
  const mode = activeCourseId.value === 'zen' ? 'zen' : 'mission';
  return `${path}?level=${level}&mode=${mode}&frame=${gameFrameKey.value}`;
});

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
    console.log("PrepDriveView: Initializing game sequence...");
    if (!gameFrame.value || !gameFrame.value.contentWindow) {
        console.warn("PrepDriveView: Frame not ready for initialization");
        return;
    }

    const plainQuestions = JSON.parse(JSON.stringify(questions.value || []));

    const payload = {
        type: 'INIT_GAME',
        questions: plainQuestions,
        courseId: activeCourseId.value,
        zenMode: activeCourseId.value === 'zen',
        maxUnlockedLevel: maxUnlockedLevel.value,
        startLevel: selectedStartLevel.value || 1
    };

    console.log("PrepDriveView: Initializing game with payload:", payload);
    gameFrame.value.contentWindow.postMessage(payload, '*');
    loading.value = false;
};

const closeReport = () => {
    missionReport.value = null;
    selectingCourse.value = true;
    selectedStartLevel.value = null;
    previewSuccess.value = false;
    if (selectionContainer.value) selectionContainer.value.scrollTop = 0;
    loading.value = true;
    iframeLoaded.value = false;
    if (gameFrame.value) {
        gameFrame.value.src = activeCourseId.value === 'zen' ? "/prepdrive/standard.html" : "/prepdrive/index.html";
    }
};

const returnToMissionSelect = () => {
  missionReport.value = null;
  showLevelSelect.value = false;
  selectingCourse.value = true;
  gameStarted.value = false;
  loading.value = false;
  iframeLoaded.value = false;
  selectedStartLevel.value = null;
  if (selectionContainer.value) selectionContainer.value.scrollTop = 0;
};

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await api.get('/game/courses');
    if (res.data.success) {
      console.log("[DEBUG] PrepDrive Courses from API:", res.data.data);
      courses.value = res.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch courses', error);
  } finally {
    loadingCourses.value = false;
  }
};

const handleCourseClick = (course) => {
  // Strict lock for everyone except admins who get a special preview
  if (!course.hasGameAccess) {
    if (course.gameAccessReason === 'admin') {
        console.log("Admin Bypass: Allowing mission preview...");
        selectCourse(course._id, course);
        return;
    }
    router.push(`/checkout/${course._id}`);
    return;
  }

  selectCourse(course._id, course);
};

const accessLabel = (course) => {
  if (course.hasGameAccess) {
    return course.gameAccessReason === 'preview' ? 'Free Preview' : 'Unlocked';
  }
  return 'Pay to Play';
};

const accessActionLabel = (course) => {
  return 'Start Course Mission';
};

const selectCourse = async (courseId, courseObj = null) => {
  activeCourseId.value = courseId;
  selectingCourse.value = false;
  showLevelSelect.value = true;
  gameStarted.value = false; // Reset game state when selecting new course
  
  activeCoursePreview.value = courseObj?.gameAccessReason === 'preview';

  if (courseId === 'zen') {
      const storageKey = `prepdrive_progression_zen`;
      const saved = parseInt(localStorage.getItem(storageKey));
      maxUnlockedLevel.value = isNaN(saved) ? 1 : saved;
      questions.value = [];
      return;
  }
  
  if (courseId === 'test') {
    maxUnlockedLevel.value = 5;
  } else if (activeCoursePreview.value) {
    maxUnlockedLevel.value = 1; // Force preview to Level 1 only
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
  selectedStartLevel.value = Number(lvl) || 1;
  showLevelSelect.value = false;
  iframeLoaded.value = false;
  gameFrameKey.value += 1;
  gameStarted.value = true; // This will trigger iframe mounting
  loading.value = true;
  // tryInitGame() will be called by @load on iframe
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
    returnToMissionSelect();
  } else if (event.data && event.data.type === 'GAME_OVER') {
    // Show report
    missionReport.value = {
      score: event.data.score,
      awards: event.data.awards,
      failedQuestions: event.data.failedQuestions
    };
    
    // Update local progression
    const currentCourseId = activeCourseId.value || 'default';
    const storageKey = `prepdrive_progression_${currentCourseId}`;
    const currentSaved = parseInt(localStorage.getItem(storageKey)) || 1;
    
    // Mission success check - if flag is missing (legacy), we assume success if awards > 0
    const isSuccess = event.data.success === true || (event.data.success === undefined && (event.data.awards || 0) > 0);
    
    if (activeCoursePreview.value && isSuccess) {
      previewSuccess.value = true;
    }

    // If they were playing a level equal to their current max AND they passed, unlock the next one
    if (isSuccess && selectedStartLevel.value === currentSaved && currentSaved < 5 && !activeCoursePreview.value) {
      const newMax = currentSaved + 1;
      localStorage.setItem(storageKey, newMax.toString());
      maxUnlockedLevel.value = newMax;
    }

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

<style scoped>
.no-shake {
  position: fixed;
  inset: 0;
  overflow: hidden;
  touch-action: none;
  overscroll-behavior: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Ensure child selection container still scrolls if needed */
#selection-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
</style>
