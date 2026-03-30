<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors gap-4">
        <div>
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-purple-400 dark:to-pink-400">
            Admin Portal
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2">Manage courses, monitor analytics, and construct interactive quizzes.</p>
        </div>
        <div class="flex gap-4 items-center">
          <ThemeToggle />
          <router-link
            to="/dashboard"
            class="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition text-sm font-medium underline"
          >
            Student View
          </router-link>
          <button
            @click="logout"
            class="px-4 py-2 bg-zinc-100 dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-sm font-medium text-red-600 dark:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Platform Analytics Grid -->
      <div v-if="!loadingStats" class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 dark:from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Courses</h3>
          <p class="text-4xl font-bold mt-2 text-purple-600 dark:text-purple-400">{{ courses.length }}</p>
        </div>
        
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 dark:from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Active Quizzes</h3>
          <p class="text-4xl font-bold mt-2 text-pink-600 dark:text-pink-400">{{ quizzes.length }}</p>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 dark:from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Submissions</h3>
          <p class="text-4xl font-bold mt-2 text-amber-600 dark:text-amber-400">{{ allSubmissions.length }}</p>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 dark:from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Platform Average</h3>
          <p class="text-4xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{{ globalAverage }}%</p>
        </div>
      </div>
      
      <div v-else class="text-center py-6 text-zinc-500 animate-pulse">
        Loading analytics...
      </div>

      <!-- Content Management Section -->
      <h2 class="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">Content Creation</h2>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        
        <!-- Add Course -->
        <div class="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Create Course
          </h2>
          <form @submit.prevent="handleCreateCourse" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Course Title</label>
              <input v-model="courseForm.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Advanced Vue 3">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Description</label>
              <textarea v-model="courseForm.description" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-purple-500 focus:border-purple-500" rows="3" placeholder="Course overview..."></textarea>
            </div>
            <button type="submit" :disabled="creatingCourse" class="w-full bg-black dark:bg-purple-600 hover:bg-zinc-800 dark:hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50">
              {{ creatingCourse ? 'Creating...' : 'Create Course' }}
            </button>
          </form>
          <div v-if="successMsg" class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm text-center font-medium">
            {{ successMsg }}
          </div>
        </div>

        <!-- Add Quiz -->
        <div class="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
            <svg class="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            Create Base Quiz
          </h2>
          <form @submit.prevent="handleCreateQuiz" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Select Course</label>
              <select v-model="quizForm.course" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-pink-500 focus:border-pink-500 text-sm">
                <option value="" disabled>Choose a course</option>
                <option v-for="c in courses" :key="c._id" :value="c._id">{{ c.title }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Quiz Title</label>
              <input v-model="quizForm.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-pink-500 focus:border-pink-500" placeholder="e.g. Composition API Basics">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Time Limit (mins)</label>
                <input v-model="quizForm.timeLimit" type="number" min="1" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-pink-500 focus:border-pink-500">
              </div>
            </div>
            <button type="submit" :disabled="creatingQuiz" class="w-full bg-black dark:bg-pink-600 hover:bg-zinc-800 dark:hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50">
              {{ creatingQuiz ? 'Creating...' : 'Create Shell Quiz' }}
            </button>
          </form>
          <div v-if="quizSuccessMsg" class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm text-center font-medium">
            {{ quizSuccessMsg }}
          </div>
        </div>

        <!-- Add Auto-Generate with AI -->
        <div class="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none"></div>
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white relative z-10">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Auto-Generate with AI
          </h2>
          <form @submit.prevent="handleGenerativeAI" class="space-y-4 relative z-10">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Select Target Quiz</label>
                <select v-model="aiForm.quizId" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="" disabled>Choose a quiz</option>
                  <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }} ({{ q.questions?.length || 0 }} Qs)</option>
                </select>
              </div>
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Question Count</label>
                <input v-model="aiForm.count" required type="number" min="1" max="20" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Course Material (Paste text, notes, or chapter)</label>
              <textarea v-model="aiForm.material" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 h-[178px] font-mono text-sm leading-relaxed resiz-none" placeholder="Paste the reading material here. The AI will analyze this text and construct multiple-choice questions based strictly on its contents..."></textarea>
            </div>

            <button type="submit" :disabled="generatingAI" class="w-full bg-black dark:bg-indigo-600 hover:bg-zinc-800 dark:hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2">
              <div v-if="generatingAI" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ generatingAI ? 'AI is analyzing and generating...' : 'Generate Questions' }}</span>
            </button>
            <p v-if="generatingAI" class="text-xs text-center text-zinc-500 dark:text-zinc-500 mt-2">This may take 10-30 seconds depending on material length.</p>
          </form>

          <div v-if="aiSuccessMsg" class="mt-4 relative z-10 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm text-center font-medium transition-colors">
            {{ aiSuccessMsg }}
          </div>
          <div v-if="aiErrorMsg" class="mt-4 relative z-10 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-sm text-center font-medium transition-colors">
            {{ aiErrorMsg }}
          </div>
        </div>
      </div>

      <!-- Inventory Management -->
      <h2 class="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">Quiz & Practice Links</h2>
      <div v-if="quizzes.length === 0" class="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 transition-colors">
        <p class="text-zinc-500">No quizzes created yet.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="quiz in quizzes" :key="quiz._id" class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-black dark:hover:border-zinc-500 transition-all duration-300">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md">
                {{ quiz.course?.title || 'General' }}
              </span>
              <span class="text-xs text-zinc-400">{{ quiz.questions?.length || 0 }} Questions</span>
            </div>
            <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">{{ quiz.title }}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6">
              {{ quiz.description || 'Practice quiz covering core concepts and advanced topics.' }}
            </p>
          </div>
          
          <div class="space-y-3">
             <div class="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                <input 
                  type="text" 
                  readonly 
                  :value="getPracticeLink(quiz._id)" 
                  class="flex-1 bg-transparent text-[11px] font-mono text-zinc-500 focus:outline-none truncate"
                >
                <button 
                  @click="copyLink(quiz._id)" 
                  class="px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded hover:bg-zinc-700 dark:hover:bg-zinc-200 transition shrink-0"
                >
                  {{ copiedId === quiz._id ? 'COPIED' : 'COPY' }}
                </button>
             </div>
             <p class="text-[10px] text-zinc-400 text-center italic">Share this link with visitors or students for instant practice.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    Authorization: `Bearer ${authStore.token}`
  }
});

const courses = ref([]);
const quizzes = ref([]);
const allSubmissions = ref([]);
const loadingStats = ref(true);
const copiedId = ref(null);

const courseForm = ref({ title: '', description: '' });
const quizForm = ref({ course: '', title: '', timeLimit: 30 });

const aiForm = ref({ quizId: '', material: '', count: 5 });

const creatingCourse = ref(false);
const creatingQuiz = ref(false);
const generatingAI = ref(false);

const successMsg = ref('');
const quizSuccessMsg = ref('');
const aiSuccessMsg = ref('');
const aiErrorMsg = ref('');

// Computed global analytics
const globalAverage = computed(() => {
  if (allSubmissions.value.length === 0) return 0;
  
  const totalPercentage = allSubmissions.value.reduce((acc, sub) => {
    return acc + ((sub.score / sub.totalQuestions) * 100);
  }, 0);
  
  return Math.round(totalPercentage / allSubmissions.value.length);
});

const fetchCoreData = async () => {
  loadingStats.value = true;
  try {
    const courseRes = await api.get('/courses');
    courses.value = courseRes.data;

    const quizRes = await api.get('/quizzes');
    quizzes.value = quizRes.data;

    const subsData = await quizStore.fetchAllSubmissions();
    allSubmissions.value = subsData || [];
  } catch (err) {
    console.error(err);
  } finally {
    loadingStats.value = false;
  }
};

onMounted(() => {
  fetchCoreData();
});

const handleCreateCourse = async () => {
  creatingCourse.value = true;
  successMsg.value = '';
  try {
    await api.post('/courses', courseForm.value);
    successMsg.value = 'Course created successfully!';
    courseForm.value = { title: '', description: '' };
    const courseRes = await api.get('/courses');
    courses.value = courseRes.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Error creating course');
  } finally {
    creatingCourse.value = false;
    setTimeout(() => successMsg.value = '', 3000);
  }
};

const handleCreateQuiz = async () => {
  creatingQuiz.value = true;
  quizSuccessMsg.value = '';
  try {
    await api.post('/quizzes', quizForm.value);
    quizSuccessMsg.value = 'Quiz created! Now select it in the "Add Question" panel.';
    quizForm.value = { course: '', title: '', timeLimit: 30 };
    
    const quizRes = await api.get('/quizzes');
    quizzes.value = quizRes.data;
  } catch (err) {
    alert(err.response?.data?.message || 'Error creating quiz');
  } finally {
    creatingQuiz.value = false;
    setTimeout(() => quizSuccessMsg.value = '', 6000);
  }
};

const handleGenerativeAI = async () => {
  generatingAI.value = true;
  aiSuccessMsg.value = '';
  aiErrorMsg.value = '';
  
  try {
    await api.post(`/quizzes/${aiForm.value.quizId}/generate`, {
      material: aiForm.value.material,
      count: aiForm.value.count
    });
    
    aiSuccessMsg.value = `${aiForm.value.count} Questions successfully generated and added!`;
    
    // reset form
    aiForm.value.material = '';

    // Refresh quizzes
    const quizRes = await api.get('/quizzes');
    quizzes.value = quizRes.data;
    
  } catch (err) {
    aiErrorMsg.value = err.response?.data?.message || 'Error communicating with AI. Check server logs.';
  } finally {
    generatingAI.value = false;
    setTimeout(() => {
      aiSuccessMsg.value = '';
      aiErrorMsg.value = '';
    }, 6000);
  }
};

const getPracticeLink = (id) => {
  return `${window.location.origin}/practice/${id}`;
};

const copyLink = (id) => {
  const link = getPracticeLink(id);
  navigator.clipboard.writeText(link);
  copiedId.value = id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
