<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 transition-colors">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="font-semibold text-lg tracking-tight">PrepUp</span>
        </div>
        
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <button 
            @click="isChatOpen = !isChatOpen"
            class="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
            <span v-if="hasNewMessages" class="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
          </button>
          
          <router-link 
            v-if="user?.role === 'admin'"
            to="/admin" 
            class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            Return to Admin
          </router-link>
          <span class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hidden sm:block">
            {{ user?.fullName }}
          </span>
          <button 
            @click="logout" 
            class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>

    <!-- Community Chat Drawer -->
    <div 
      v-if="isChatOpen" 
      class="fixed inset-0 z-[100] bg-zinc-950/20 dark:bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      @click="isChatOpen = false"
    ></div>
    
    <div 
      :class="[
        'fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 z-[101] shadow-2xl transition-transform duration-500 ease-in-out border-l border-zinc-200 dark:border-zinc-800',
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full uppercase-titles tracking-tight">
        <!-- Chat Header -->
        <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-zinc-900 dark:text-white">Community Chat</h3>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-widest">Connect with other students</p>
            </div>
          </div>
          <button @click="isChatOpen = false" class="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Chat Messages -->
        <div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-900/50">
          <div v-for="msg in messages" :key="msg._id" :class="['flex flex-col', msg.sender._id === user?._id ? 'items-end' : 'items-start']">
            <div class="flex items-center gap-2 mb-1 px-1">
              <span class="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">{{ msg.sender.name }}</span>
              <span class="text-[9px] text-zinc-300 dark:text-zinc-600 font-mono">{{ formatTime(msg.createdAt) }}</span>
            </div>
            <div :class="[
              'max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm',
              msg.sender._id === user?._id 
                ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none' 
                : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-tl-none'
            ]">
              {{ msg.text }}
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
          <form @submit.prevent="sendMessage" class="relative group">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Join the discussion..." 
              class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-5 pr-12 py-3.5 text-sm transition-all focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            />
            <button 
              type="submit" 
              :disabled="!newMessage.trim() || sendingMessage"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:scale-95 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>

    <main class="max-w-6xl mx-auto px-6 py-12">
      <header class="mb-10 lg:mb-16">
        <h1 class="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
          Good to see you, {{ user?.fullName?.split(' ')[0] || 'Student' }}.
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg">Your academic overview and available assignments.</p>
      </header>

      <!-- Loading State -->
      <div v-if="quizStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-4"></div>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">Preparing your quiz...</p>
      </div>

      <template v-else>
        <!-- Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-16">
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Average Performance
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-semibold tracking-tight dark:text-white">{{ averageScore }}</span>
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">%</span>
            </div>
          </div>
          
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Completed Assessments
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-semibold tracking-tight dark:text-white">{{ quizStore.mySubmissions.length }}</span>
            </div>
          </div>

          <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              Global Standing
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-semibold tracking-tight text-zinc-300 dark:text-zinc-600">--</span>
              <span class="text-sm text-zinc-400 dark:text-zinc-500 font-medium">(calculating)</span>
            </div>
          </div>
        </div>

        <!-- Assignments Feed -->
        <div>
          <div class="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Assigned Quizzes</h2>
            <span class="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
              {{ quizStore.quizzes.length }} Open
            </span>
          </div>
          
          <div v-if="quizStore.quizzes.length === 0" class="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 transition-colors">
            <div class="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-full border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p class="text-zinc-600 dark:text-zinc-300 font-medium">You're all caught up!</p>
            <p class="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Check back later for new assignments.</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="quiz in quizStore.quizzes" 
              :key="quiz._id"
              class="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-black dark:hover:border-zinc-500 hover:shadow-md transition-all duration-200"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">{{ quiz.timeLimit }} Minutes</span>
                    <span class="text-zinc-300 dark:text-zinc-700 text-xs">&bull;</span>
                    <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">{{ quiz.questions.length }} Questions</span>
                  </div>
                  <h3 class="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-zinc-300 transition-colors">{{ quiz.title }}</h3>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{{ quiz.description || 'Test your knowledge on this course.' }}</p>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  <button 
                    @click.stop="startStudy(quiz._id)" 
                    class="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    Study Cards
                  </button>
                  <button 
                    @click.stop="startQuiz(quiz._id)"
                    class="px-4 py-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Take Quiz
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';
import axios from 'axios';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const user = computed(() => authStore.user);

const averageScore = computed(() => {
  if (quizStore.mySubmissions.length === 0) return 0;
  
  const totalPercentage = quizStore.mySubmissions.reduce((acc, sub) => {
    return acc + ((sub.score / sub.totalQuestions) * 100);
  }, 0);
  
  return Math.round(totalPercentage / quizStore.mySubmissions.length);
});

// ── Community Chat Logic ────────────────────────────────────
const isChatOpen = ref(false);
const messages = ref([]);
const newMessage = ref('');
const sendingMessage = ref(false);
const hasNewMessages = ref(false);
let chatInterval = null;

const api = axios.create({
  baseURL: 'https://prepflow-server.onrender.com/api',
  headers: { Authorization: `Bearer ${authStore.token}` }
});

const fetchMessages = async (isInitial = false) => {
  try {
    const { data } = await api.get('/chat');
    const oldLength = messages.value.length;
    messages.value = data;
    
    if (!isInitial && data.length > oldLength) {
      if (!isChatOpen.value) hasNewMessages.value = true;
      scrollToBottom();
    }
  } catch (err) {
    console.error('Chat error:', err);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return;
  
  sendingMessage.value = true;
  try {
    const { data } = await api.post('/chat', { text: newMessage.value });
    messages.value.push(data);
    newMessage.value = '';
    scrollToBottom();
  } catch (err) {
    console.error('Send error:', err);
  } finally {
    sendingMessage.value = false;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const container = document.getElementById('chat-container');
  if (container) {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }
};

const formatTime = (iso) => {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

watch(isChatOpen, (val) => {
  if (val) {
    hasNewMessages.value = false;
    scrollToBottom();
  }
});

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
  fetchMessages(true);
  chatInterval = setInterval(fetchMessages, 5000); // Poll every 5s
});

onUnmounted(() => {
  if (chatInterval) clearInterval(chatInterval);
});

const startStudy = (id) => {
  router.push(`/flashcards/${id}`);
};

const startQuiz = (id) => {
  router.push(`/quiz/${id}`);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

#chat-container {
  scroll-behavior: smooth;
}

/* Animations */
.animate-in {
  animation: animate-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.zoom-in-95 {
  animation: zoom-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes animate-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
