<template>
  <NeoAppShell>
    <div class="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--neo-surface)]">
      <!-- Chat List Sidebar -->
      <aside class="w-full md:w-80 border-r border-zinc-100 dark:border-white/5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20" :class="activeConversation ? 'hidden md:flex' : 'flex'">
        <header class="p-6 border-b border-zinc-100 dark:border-white/5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Messages</h2>
            <button @click="showSearchModal = true" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
              <Plus :size="16" />
            </button>
          </div>
          <NeoCard variant="depressed" class="!rounded-2xl p-3 border-[0.5px] border-black/5 dark:border-white/5">
            <div class="flex items-center gap-3 w-full h-full">
              <Search :size="14" class="text-zinc-400 shrink-0" />
              <input v-model="searchQuery" type="text" placeholder="Search conversations..." class="bg-transparent border-none outline-none text-xs w-full text-zinc-700 dark:text-zinc-300">
            </div>
          </NeoCard>
        </header>
        
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <!-- Loading state -->
          <div v-if="loadingConversations" class="p-8 flex justify-center">
            <div class="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin"></div>
          </div>

          <!-- Conversations List -->
          <div 
            v-for="convo in filteredConversations" 
            :key="convo._id" 
            @click="selectConversation(convo)"
            class="p-4 flex items-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-zinc-800 transition-colors border-b border-zinc-50/50 dark:border-white/5 group relative"
            :class="{ 'bg-white dark:bg-zinc-800/50': activeConversation?._id === convo._id }"
          >
            <div class="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm overflow-hidden shrink-0" :style="getConvoIconStyle(convo)">
               <img :src="getConvoImage(convo)" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[13px] font-bold truncate" :class="activeConversation?._id === convo._id ? 'text-brand dark:text-brand' : 'text-zinc-800 dark:text-zinc-200'">
                  {{ getConvoTitle(convo) }}
                </span>
                <span v-if="convo.isAI" class="text-[9px] px-1.5 py-0.5 rounded-full bg-brand/10 text-brand font-bold uppercase tracking-widest">AI</span>
              </div>
              <p class="text-[11px] text-zinc-500 truncate">{{ convo.lastMessage?.text || 'Start a conversation...' }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <section class="flex-1 flex flex-col relative bg-white dark:bg-zinc-900/30" :class="!activeConversation ? 'hidden md:flex' : 'flex'">
        <!-- Ambient Glows -->
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 dark:bg-brand/10 blur-[120px] rounded-full pointer-events-none"></div>

        <header v-if="activeConversation" class="h-16 flex items-center px-4 md:px-8 border-b border-zinc-100 dark:border-white/5 z-10 shrink-0">
          <div class="flex items-center gap-4 w-full">
            <button @click="activeConversation = null" class="md:hidden p-2 -ml-2 text-zinc-500">
              <ChevronLeft :size="20" />
            </button>
            <div class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0">
               <img :src="getConvoImage(activeConversation)" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 truncate">{{ getConvoTitle(activeConversation) }}</h3>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="activeConversation.isAI ? 'bg-brand' : 'bg-emerald-500'"></span>
                <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {{ activeConversation.isAI ? 'AI Active' : (activeConversation.isGlobal ? 'Group Active' : 'Online') }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <!-- No conversation selected -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
          <div class="w-20 h-20 rounded-[32px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-neo-inner">
            <MessageSquare :size="32" class="text-zinc-400" />
          </div>
          <h2 class="text-sm font-black uppercase tracking-[0.2em] mb-2 text-zinc-500">Select a Conversation</h2>
          <p class="text-xs max-w-[240px] leading-relaxed text-zinc-400">Pick a room to start learning or click the plus icon to find your friends.</p>
        </div>

        <div v-if="activeConversation" class="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 custom-scrollbar relative z-10" ref="chatContainer">
          <!-- Chat Bubbles -->
          <div 
            v-for="(msg, index) in messages" 
            :key="msg._id || index"
            class="flex items-end gap-3"
            :class="(msg.sender?._id || msg.sender) === currentUserId ? 'justify-end' : 'justify-start'"
          >
            <!-- Avatar (only for others) -->
            <div v-if="msg.sender?._id !== currentUserId" class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 hidden sm:block">
               <img :src="getMessageAvatar(msg)" class="w-full h-full object-cover">
            </div>

            <!-- Bubble Group -->
            <div class="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
              <!-- Name for Group/Global chat -->
              <span 
                v-if="activeConversation.isGlobal && msg.sender?._id !== currentUserId" 
                class="text-[10px] font-black uppercase tracking-wider ml-1"
                :style="{ color: getUserColor(msg.sender?.fullName || 'User') }"
              >
                {{ msg.sender?.fullName || 'User' }}
              </span>

              <!-- Bubble -->
              <div 
                class="p-4 sm:p-5 rounded-[24px] text-[13px] leading-relaxed shadow-neo border relative"
                :class="[
                  (msg.sender?._id || msg.sender) === currentUserId 
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-sm border-transparent' 
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 rounded-tl-sm border-zinc-200/50 dark:border-white/5'
                ]"
              >
                <div class="whitespace-pre-wrap">{{ msg.text }}</div>
                <div class="text-[9px] mt-2 opacity-30 text-right">{{ formatTime(msg.createdAt) }}</div>
              </div>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex items-end gap-3 justify-start">
            <div class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 hidden sm:block">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=ai-bot" class="w-full h-full object-cover">
            </div>
            <div class="max-w-[85%] p-5 rounded-[24px] rounded-tl-sm bg-zinc-50 dark:bg-zinc-800/80 shadow-neo border border-zinc-200/50 dark:border-white/5 flex gap-1.5 items-center">
              <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>

          <!-- System Error Message -->
          <div v-if="systemError" class="flex flex-col items-center gap-3 py-4 animate-in fade-in slide-in-from-bottom-2">
            <div class="px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-[11px] font-bold text-red-500 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {{ systemError }}
            </div>
            <button @click="systemError = null" class="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-zinc-600 transition-colors">Dismiss</button>
          </div>
        </div>

        <footer v-if="activeConversation" class="p-4 sm:p-6 z-10">
          <form @submit.prevent="sendMessage">
            <NeoCard variant="depressed" class="!rounded-[28px] p-2 border-[0.5px] border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-950/40">
              <div class="flex items-center gap-2 w-full h-full">
                <input 
                  type="text" 
                  v-model="newMessage"
                  :disabled="isLoading"
                  placeholder="Type a message..." 
                  class="flex-1 bg-transparent border-none outline-none px-4 text-[13px] text-zinc-700 dark:text-zinc-200 disabled:opacity-50"
                  enterkeyhint="send"
                >
                <button 
                  type="submit" 
                  :disabled="!newMessage.trim() || isLoading"
                  class="w-10 h-10 shrink-0 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:active:scale-100"
                >
                  <Send :size="16" class="pointer-events-none" />
                </button>
              </div>
            </NeoCard>
          </form>
        </footer>
      </section>

      <!-- New Chat Search Modal -->
      <div v-if="showSearchModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm">
        <NeoCard class="w-full max-w-md !rounded-[32px] p-6 shadow-2xl relative">
          <button @click="showSearchModal = false" class="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600">
            <X :size="20" />
          </button>
          
          <h3 class="text-sm font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Find Students</h3>
          
          <NeoCard variant="depressed" class="!rounded-2xl p-3 mb-6 border-[0.5px] border-black/5 dark:border-white/5">
            <div class="flex items-center gap-3 w-full h-full">
              <Search :size="14" class="text-zinc-400 shrink-0" />
              <input 
                v-model="studentSearchQuery" 
                @input="searchStudents"
                type="text" 
                placeholder="Search by name or email..." 
                class="bg-transparent border-none outline-none text-xs w-full text-zinc-700 dark:text-zinc-300"
                autoFocus
              >
            </div>
          </NeoCard>

          <div class="max-h-60 overflow-y-auto custom-scrollbar">
            <div v-if="isSearchingStudents" class="p-4 text-center">
              <div class="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin mx-auto"></div>
            </div>
            <div 
              v-for="student in studentSearchResults" 
              :key="student._id"
              @click="startDirectChat(student)"
              class="p-3 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl cursor-pointer transition-colors"
            >
              <div class="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${student.fullName}`" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <p class="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">{{ student.fullName }}</p>
                <p class="text-[10px] text-zinc-400">{{ student.email }}</p>
              </div>
            </div>
            <p v-if="!isSearchingStudents && studentSearchQuery && studentSearchResults.length === 0" class="text-center text-xs text-zinc-400 py-4 italic">
              No students found with that name.
            </p>
          </div>
        </NeoCard>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Search, Sparkles, Send, Plus, X, MessageSquare, ChevronLeft } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import api from '../api/axios';

const currentUserId = ref(null);
const conversations = ref([]);
const activeConversation = ref(null);
const messages = ref([]);
const newMessage = ref('');
const searchQuery = ref('');
const loadingConversations = ref(true);
const systemError = ref(null);
const messageInterval = ref(null);
const convoInterval = ref(null);
const chatContainer = ref(null);
const isLoading = ref(false);

// Search Students State
const showSearchModal = ref(false);
const studentSearchQuery = ref('');
const studentSearchResults = ref([]);
const isSearchingStudents = ref(false);

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  return conversations.value.filter(c => 
    getConvoTitle(c).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const getConvoTitle = (convo) => {
  if (convo.course) return `${convo.course.title} Study Group`;
  if (convo.isGlobal) return 'Global Study Room';
  if (convo.isAI) return 'PrepUp AI Tutor';
  const otherParticipant = convo.participants?.find(p => p._id !== currentUserId.value);
  return otherParticipant?.fullName || 'Direct Chat';
};

const getConvoImage = (convo) => {
  if (convo.course) return `https://api.dicebear.com/7.x/notionists/svg?seed=${convo.course.title}`;
  if (convo.isGlobal) return 'https://api.dicebear.com/7.x/notionists/svg?seed=global';
  if (convo.isAI) return 'https://api.dicebear.com/7.x/notionists/svg?seed=ai1';
  const otherParticipant = convo.participants?.find(p => p._id !== currentUserId.value);
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${otherParticipant?.fullName || 'user'}`;
};

const getConvoIconStyle = (convo) => {
  if (convo.course) return 'background: linear-gradient(135deg, #10b981, #3b82f6)';
  if (convo.isGlobal) return 'background: linear-gradient(135deg, #6366f1, #a855f7)';
  if (convo.isAI) return 'background: linear-gradient(135deg, #f59e0b, #ec4899)';
  return '';
};

const getMessageAvatar = (msg) => {
  if (msg.isModel) return 'https://api.dicebear.com/7.x/notionists/svg?seed=ai1';
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${msg.sender?.fullName || 'user'}`;
};

const getUserColor = (name) => {
  const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const fetchConversations = async () => {
  try {
    const res = await api.get('/chat/conversations');
    conversations.value = res.data;
    loadingConversations.value = false;
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
  }
};

const selectConversation = async (convo) => {
  activeConversation.value = convo;
  messages.value = [];
  try {
    const res = await api.get(`/chat/${convo._id}`);
    messages.value = res.data.messages;
    scrollToBottom();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !activeConversation.value) return;

  const text = newMessage.value.trim();
  const convoId = activeConversation.value._id;
  newMessage.value = '';
  systemError.value = null; // Clear previous errors

  // Optimistic UI updates
  const tempId = Date.now().toString();
  messages.value.push({
    _id: tempId,
    sender: { _id: currentUserId.value },
    text,
    createdAt: new Date()
  });
  scrollToBottom();
  
  if (activeConversation.value.isAI) {
    isLoading.value = true;
  }

  try {
    const res = await api.post(`/chat/${convoId}`, { text });
    
    // Replace optimistic message with server message
    const index = messages.value.findIndex(m => m._id === tempId);
    if (index !== -1) {
      messages.value[index] = res.data.userMessage || res.data.message;
    }

    if (activeConversation.value._id === convoId) {
      if (res.data.aiMessage) {
        messages.value.push(res.data.aiMessage);
      }
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    
    // Better Error Message for UI
    if (error.response?.status === 429) {
      systemError.value = error.response.data.message || 'Rate limit reached. Please wait.';
    } else {
      systemError.value = 'Failed to deliver message. Check your connection.';
    }

    // Optional: Remove optimistic message on failure
    messages.value = messages.value.filter(m => m._id !== tempId);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// Search Students Logic
let searchTimeout = null;
const searchStudents = () => {
  clearTimeout(searchTimeout);
  if (!studentSearchQuery.value.trim()) {
    studentSearchResults.value = [];
    return;
  }
  isSearchingStudents.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api.get(`/students/search?q=${studentSearchQuery.value}`);
      studentSearchResults.value = res.data;
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      isSearchingStudents.value = false;
    }
  }, 300);
};

const startDirectChat = async (student) => {
  try {
    const res = await api.post('/chat/direct/new', { targetUserId: student._id });
    const convo = res.data;
    
    // Check if already in sidebar
    const existing = conversations.value.find(c => c._id === convo._id);
    if (!existing) {
      conversations.value.unshift(convo);
    }
    
    showSearchModal.value = false;
    studentSearchQuery.value = '';
    studentSearchResults.value = [];
    selectConversation(convo);
  } catch (error) {
    console.error('Failed to start direct chat:', error);
  }
};

// Polling for new messages (Alternative to WebSockets)
const startPolling = () => {
  // 1. Update Conversation List (Sidebar) - Every 15 seconds
  convoInterval.value = setInterval(async () => {
    await fetchConversations();
  }, 15000);

  // 2. Update Active Chat Messages - Every 5 seconds
  messageInterval.value = setInterval(async () => {
    if (activeConversation.value && !isLoading.value) {
      const convoIdBefore = activeConversation.value._id;
      try {
        const res = await api.get(`/chat/${convoIdBefore}`);
        // Ensure user hasn't switched chats during the request
        if (activeConversation.value?._id === convoIdBefore) {
          // Only update if message counts differ (server vs local)
          if (res.data.messages.length !== messages.value.length) {
            messages.value = res.data.messages;
            scrollToBottom();
          }
        }
      } catch (error) {
        console.error('Message polling error:', error);
      }
    }
  }, 5000);
};

onMounted(async () => {
  // Get current user ID from a hypothetical user store or local storage
  // Assuming a standard pattern here
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      currentUserId.value = parsed._id || parsed.id;
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  } 
  
  if (!currentUserId.value) {
    // Fallback if not in localStorage, maybe fire a profile request
    try {
      const res = await api.get('/auth/profile');
      currentUserId.value = res.data._id;
    } catch (e) {
      console.error('Authentication check failed:', e);
    }
  }
  
  await fetchConversations();
  startPolling();
});

onUnmounted(() => {
  if (messageInterval.value) clearInterval(messageInterval.value);
  if (convoInterval.value) clearInterval(convoInterval.value);
});
</script>
