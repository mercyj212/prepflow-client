<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 transition-colors">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <BrandLogo />
        
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
        'fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-white dark:bg-zinc-900 z-[101] shadow-2xl transition-transform duration-500 ease-in-out border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden',
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full uppercase-titles tracking-tight relative overflow-hidden">
        <!-- Chat Header -->
        <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-zinc-900 dark:text-white">Student Lounge</h3>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-widest">Connect with your peers</p>
            </div>
          </div>
          <button @click="isChatOpen = false" class="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Chat Messages -->
        <div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-900/50 relative">
          <div v-for="msg in messages" :key="msg._id" :class="['flex flex-col', msg.sender._id === user?._id ? 'items-end' : 'items-start']">
            
            <!-- User Identity (Name & Time) -->
            <div class="flex items-center gap-2 mb-1.5 px-1">
              <span 
                :class="[
                  'text-[10px] font-bold lowercase tracking-widest',
                  msg.sender._id === user?._id ? 'text-zinc-400 dark:text-zinc-500' : getUserColor(msg.sender._id).text
                ]"
              >
                {{ msg.sender.fullName }}
              </span>
              <span class="text-[9px] text-zinc-300 dark:text-zinc-600 font-mono">{{ formatTime(msg.createdAt) }}</span>
            </div>

            <!-- Message Bubble -->
            <div :class="[
              'max-w-[90%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all hover:scale-[1.01]',
              msg.sender._id === user?._id 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white dark:from-indigo-500 dark:to-indigo-600 rounded-tr-none shadow-indigo-100 dark:shadow-none' 
                : `${getUserColor(msg.sender._id).bg} border ${getUserColor(msg.sender._id).border} text-zinc-800 dark:text-zinc-100 rounded-tl-none`
            ]">
              {{ msg.text }}
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="typingUsers.length > 0" class="flex flex-col items-start px-1 animate-in slide-in-from-bottom-2 duration-300">
            <div class="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-3 py-2 shadow-sm">
              <div class="flex gap-1">
                <span class="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></span>
                <span class="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span class="text-[10px] text-zinc-500 font-medium lowercase">
                {{ typingUsers.length > 1 ? `${typingUsers[0]} and others are typing...` : `${typingUsers[0]} is typing...` }}
              </span>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
          <div class="flex items-end gap-3">
            <textarea 
              v-model="newMessage" 
              placeholder="Join the discussion..." 
              rows="1"
              class="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-base sm:text-sm transition-all focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-zinc-900 resize-none max-h-[120px] text-zinc-900 dark:text-white"
              style="min-height: 48px;"
            ></textarea>
            <button 
              @click="sendMessage"
              :disabled="!newMessage.trim() || sendingMessage"
              class="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:scale-95 transition-all shadow-sm hover:scale-105 active:scale-90"
            >
              <svg v-if="!sendingMessage" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              <div v-else class="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 py-12 relative w-full flex-grow">
      <!-- Premium Decor -->
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
        <div class="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-emerald-500/10 dark:bg-emerald-500/15 animate-pulse"></div>
        <div class="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] bg-sky-500/10 dark:bg-violet-500/15 animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 w-full">
        <header class="mb-12 lg:mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-xs font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Student Portal
          </div>
          <h1 class="text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-3">
            Welcome back, <span class="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">{{ user?.fullName?.split(' ')[0] || 'Student' }}</span>.
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-lg sm:text-xl">Here is your progress and available quizzes.</p>
        </header>

        <!-- Loading State -->
        <div v-if="quizStore.loading" class="flex flex-col items-center justify-center py-20">
          <div class="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-4"></div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Preparing your dashboard...</p>
        </div>

        <template v-else>
          <!-- Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-16">
            <div class="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                Performance
              </h3>
              <div class="flex items-baseline gap-2 relative z-10">
                <span class="text-5xl font-black tracking-tighter dark:text-white">{{ averageScore }}</span>
                <span class="text-zinc-400 font-bold text-xl">%</span>
              </div>
            </div>
            
            <div class="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </div>
                Completed
              </h3>
              <div class="flex items-baseline gap-2 relative z-10">
                <span class="text-5xl font-black tracking-tighter dark:text-white">{{ quizStore.mySubmissions.length }}</span>
              </div>
            </div>

            <div class="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                Standing
              </h3>
              <div class="flex items-baseline gap-2 relative z-10">
                <span class="text-5xl font-black tracking-tighter text-zinc-300 dark:text-zinc-600">--</span>
                <span class="text-sm text-zinc-400 font-medium">(calculating)</span>
              </div>
            </div>
          </div>

          <!-- Assignments Feed -->
          <div>
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Assigned Quizzes</h2>
              <span class="text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-full shadow-md">
                {{ quizStore.quizzes.length }} Open
              </span>
            </div>
            
            <div v-if="quizStore.quizzes.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 transition-colors">
              <div class="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-sm">
                <svg class="w-8 h-8 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p class="text-zinc-800 dark:text-zinc-200 font-bold text-lg">You're all caught up!</p>
              <p class="text-zinc-500 text-base mt-2">Check back later for new assignments.</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="quiz in quizStore.quizzes" 
                :key="quiz._id"
                class="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="relative flex h-2.5 w-2.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span class="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">{{ quiz.timeLimit }} Minutes</span>
                    <span class="text-zinc-300 dark:text-zinc-700 text-xs">&bull;</span>
                    <span class="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">{{ quiz.questions.length }} Questions</span>
                  </div>
                  <h3 class="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-violet-500 transition-all">{{ quiz.title }}</h3>
                  <p class="text-base text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 md:pr-12">{{ quiz.description || 'Test your knowledge on this course.' }}</p>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                  <button 
                    @click.stop="startStudy(quiz._id)" 
                    class="px-5 py-3 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-white dark:hover:bg-zinc-700 hover:scale-105 text-zinc-700 dark:text-zinc-200 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    Study Cards
                  </button>
                  <button 
                    @click.stop="startQuiz(quiz._id)"
                    class="px-6 py-3 bg-gradient-to-r from-zinc-900 to-black dark:from-white dark:to-zinc-100 hover:from-indigo-600 hover:to-violet-600 dark:hover:from-indigo-500 dark:hover:to-violet-500 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 border border-transparent text-white dark:text-black dark:hover:text-white text-sm font-bold rounded-xl transition-all duration-300"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import AppFooter from '../components/AppFooter.vue';
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
const typingUsers = ref([]);
const newMessage = ref('');
const sendingMessage = ref(false);
const hasNewMessages = ref(false);
let chatInterval = null;
let lastTypingSent = 0;

const api = axios.create({
  baseURL: 'https://prepflow-server.onrender.com/api',
  headers: { Authorization: `Bearer ${authStore.token}` }
});

const fetchMessages = async (isInitial = false) => {
  try {
    const { data } = await api.get('/chat');
    
    // Safety check: support new {messages, typingUsers} and old array format
    const newMessagesList = data.messages || (Array.isArray(data) ? data : []);
    const newTypingList = data.typingUsers || [];
    
    const oldLength = (messages.value || []).length;
    messages.value = newMessagesList;
    typingUsers.value = newTypingList;
    
    if (!isInitial && newMessagesList.length > oldLength) {
      if (!isChatOpen.value) hasNewMessages.value = true;
      scrollToBottom();
    }
  } catch (err) {
    console.error('Chat error:', err);
    if (!messages.value) messages.value = [];
  }
};

const handleTyping = async () => {
  const now = Date.now();
  if (now - lastTypingSent > 3000) { // Throttled at 3 seconds
    lastTypingSent = now;
    try { await api.post('/chat/typing'); } catch (err) { /* silent fail */ }
  }
};

watch(newMessage, (val) => {
  if (val.trim() !== '') handleTyping();
});

const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return;
  
  sendingMessage.value = true;
  try {
    const { data } = await api.post('/chat', { text: newMessage.value });
    
    // Defensive check
    if (!Array.isArray(messages.value)) messages.value = [];
    
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

// 🎨 Helper for User Colors
const getUserColor = (id) => {
  const palettes = [
    { bg: 'bg-rose-50/70 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
    { bg: 'bg-sky-50/70 dark:bg-sky-500/10', border: 'border-sky-100 dark:border-sky-500/20', text: 'text-sky-600 dark:text-sky-400' },
    { bg: 'bg-emerald-50/70 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { bg: 'bg-amber-50/70 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
    { bg: 'bg-violet-50/70 dark:bg-violet-500/10', border: 'border-violet-100 dark:border-violet-500/20', text: 'text-violet-600 dark:text-violet-400' },
    { bg: 'bg-indigo-50/70 dark:bg-indigo-500/10', border: 'border-indigo-100 dark:border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400' },
  ];
  
  // Deterministic index based on ID
  const num = parseInt(id.slice(-4), 16) || 0;
  return palettes[num % palettes.length];
};

watch(isChatOpen, (val) => {
  if (val) {
    hasNewMessages.value = false;
    scrollToBottom();
    document.body.style.overflow = 'hidden'; // Lock Body
  } else {
    document.body.style.overflow = ''; // Release Body
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
