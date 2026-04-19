<template>
  <NeoAppShell>
    <div class="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--neo-surface)]">
      <!-- Chat List Sidebar -->
      <aside class="w-full md:w-80 border-r border-zinc-100 dark:border-white/5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20" :class="activeConversation ? 'hidden md:flex' : 'flex'">
        <header class="p-6 border-b border-zinc-100 dark:border-white/5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Messages</h2>
            <div class="flex items-center gap-2">
              <button @click="openModal('dm')" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500" title="New Direct Message">
                <Plus :size="16" />
              </button>
              <button @click="openModal('group')" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500" title="Create Group">
                <Users :size="16" />
              </button>
            </div>
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
                <span v-else-if="convo.isGroup" class="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-500 font-bold uppercase tracking-widest">Group</span>
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
            <div class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0" :style="getConvoIconStyle(activeConversation)">
               <img :src="getConvoImage(activeConversation)" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 truncate">{{ getConvoTitle(activeConversation) }}</h3>
                <span v-if="activeConversation.isGroup && isGroupAdmin" class="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold uppercase tracking-widest">Admin</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="activeConversation.isAI ? 'bg-brand' : 'bg-emerald-500'"></span>
                <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {{ activeConversation.isAI ? 'AI Active' : activeConversation.isGroup ? `${activeConversation.participants?.length || 0} members` : (activeConversation.isGlobal ? 'Group Active' : 'Online') }}
                </span>
              </div>
            </div>
            <!-- Group Admin Actions -->
            <button
              v-if="activeConversation.isGroup && isGroupAdmin"
              @click="showGroupPanel = !showGroupPanel"
              class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
              title="Manage Group"
            >
              <Settings :size="16" />
            </button>
          </div>
        </header>

        <!-- No conversation selected -->
        <div v-if="!activeConversation" class="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
          <div class="w-20 h-20 rounded-[32px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-neo-inner">
            <MessageSquare :size="32" class="text-zinc-400" />
          </div>
          <h2 class="text-sm font-black uppercase tracking-[0.2em] mb-2 text-zinc-500">Select a Conversation</h2>
          <p class="text-xs max-w-[240px] leading-relaxed text-zinc-400">Pick a room or click <strong>+</strong> to start a DM, or the <strong>group icon</strong> to create a group.</p>
        </div>

        <div v-if="activeConversation" class="flex-1 flex overflow-hidden relative z-10">
          <!-- Messages Column -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 custom-scrollbar" ref="chatContainer">
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
                  v-if="(activeConversation.isGlobal || activeConversation.isGroup) && (msg.sender?._id || msg.sender) !== currentUserId" 
                  class="text-[10px] font-black uppercase tracking-wider ml-1 flex items-center gap-1"
                  :style="{ color: getUserColor(msg.sender?.fullName || 'User') }"
                >
                  {{ msg.sender?.fullName || 'User' }}
                  <span v-if="activeConversation.isGroup && msg.sender?._id === activeConversation.admin?._id" class="text-[8px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">Admin</span>
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

            <!-- System Error -->
            <div v-if="systemError" class="flex flex-col items-center gap-3 py-4">
              <div class="px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-[11px] font-bold text-red-500 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {{ systemError }}
              </div>
              <button @click="systemError = null" class="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-zinc-600 transition-colors">Dismiss</button>
            </div>
          </div>

          <!-- Group Admin Side Panel -->
          <aside v-if="showGroupPanel && activeConversation.isGroup && isGroupAdmin" class="w-64 border-l border-zinc-100 dark:border-white/5 flex flex-col bg-zinc-50/30 dark:bg-zinc-900/50 overflow-y-auto">
            <div class="p-4 border-b border-zinc-100 dark:border-white/5">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Group Admin Panel</h4>
              <p class="text-[11px] text-zinc-500">{{ activeConversation.name }}</p>
            </div>

            <!-- Add Member -->
            <div class="p-4 border-b border-zinc-100 dark:border-white/5">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Add Member</p>
              <div class="flex gap-2">
                <input v-model="addMemberQuery" @input="searchForAdd" type="text" placeholder="Search name..." class="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 text-[12px] outline-none text-zinc-700 dark:text-zinc-300">
              </div>
              <div class="mt-2 space-y-1">
                <div v-for="s in addMemberResults" :key="s._id" class="flex items-center gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 cursor-pointer" @click="addMember(s)">
                  <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${s.fullName}`" class="w-6 h-6 rounded-full">
                  <span class="text-[12px] font-medium text-zinc-700 dark:text-zinc-300 truncate">{{ s.fullName }}</span>
                  <UserPlus :size="12" class="ml-auto text-zinc-400" />
                </div>
              </div>
            </div>

            <!-- Member List -->
            <div class="p-4 flex-1">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Members ({{ activeConversation.participants?.length || 0 }})</p>
              <div class="space-y-2">
                <div v-for="member in activeConversation.participants" :key="member._id || member" class="flex items-center gap-2">
                  <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${member.fullName || 'user'}`" class="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700">
                  <div class="flex-1 min-w-0">
                    <p class="text-[12px] font-bold text-zinc-700 dark:text-zinc-300 truncate">{{ member.fullName || 'Member' }}</p>
                    <p v-if="(member._id || member) === (activeConversation.admin?._id || activeConversation.admin)" class="text-[9px] text-amber-600 font-bold uppercase">Admin</p>
                  </div>
                  <button
                    v-if="(member._id || member).toString() !== currentUserId"
                    @click="removeMember(member._id || member)"
                    class="p-1 rounded-full hover:bg-red-50 hover:text-red-500 text-zinc-300 transition-colors"
                    title="Remove member"
                  >
                    <X :size="12" />
                  </button>
                </div>
              </div>

              <!-- Delete Group -->
              <button @click="deleteGroup" class="mt-6 w-full py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <Trash2 :size="14" />
                Delete Group
              </button>
            </div>
          </aside>
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

      <!-- ── New Chat / Create Group Modal ── -->
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm">
        <NeoCard class="w-full max-w-md !rounded-[32px] p-6 shadow-2xl relative">
          <button @click="closeModal" class="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600">
            <X :size="20" />
          </button>
          
          <!-- Tabs -->
          <div class="flex gap-2 mb-6">
            <button
              @click="modalTab = 'dm'"
              class="flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              :class="modalTab === 'dm' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'"
            >Direct Message</button>
            <button
              @click="modalTab = 'group'"
              class="flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              :class="modalTab === 'group' ? 'bg-violet-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'"
            >Create Group</button>
          </div>

          <!-- DM Tab -->
          <div v-if="modalTab === 'dm'">
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
              <p v-if="!isSearchingStudents && studentSearchQuery && studentSearchResults.length === 0" class="text-center text-xs text-zinc-400 py-4 italic">No students found.</p>
            </div>
          </div>

          <!-- Group Tab -->
          <div v-if="modalTab === 'group'">
            <h3 class="text-sm font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Create Group</h3>

            <div class="space-y-4 mb-6">
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1.5">Group Name *</label>
                <input v-model="groupForm.name" type="text" placeholder="e.g. JAMB Chemistry Squad" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-[13px] outline-none text-zinc-700 dark:text-zinc-300">
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1.5">Description (optional)</label>
                <input v-model="groupForm.description" type="text" placeholder="What's this group about?" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-[13px] outline-none text-zinc-700 dark:text-zinc-300">
              </div>
            </div>

            <!-- Search to add members -->
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1.5">Add Members</label>
            <NeoCard variant="depressed" class="!rounded-2xl p-3 mb-3 border-[0.5px] border-black/5 dark:border-white/5">
              <div class="flex items-center gap-3">
                <Search :size="14" class="text-zinc-400 shrink-0" />
                <input 
                  v-model="groupSearchQuery" 
                  @input="searchForGroup"
                  type="text" 
                  placeholder="Search students to add..."
                  class="bg-transparent border-none outline-none text-xs w-full text-zinc-700 dark:text-zinc-300"
                >
              </div>
            </NeoCard>

            <!-- Search results -->
            <div class="max-h-32 overflow-y-auto custom-scrollbar mb-4">
              <div 
                v-for="s in groupSearchResults"
                :key="s._id"
                @click="toggleGroupMember(s)"
                class="p-2 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
              >
                <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${s.fullName}`" class="w-8 h-8 rounded-full">
                <span class="flex-1 text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{{ s.fullName }}</span>
                <div :class="isSelectedForGroup(s._id) ? 'bg-violet-600 text-white' : 'border border-zinc-200 dark:border-zinc-600'" class="w-5 h-5 rounded-full flex items-center justify-center">
                  <Check v-if="isSelectedForGroup(s._id)" :size="10" />
                </div>
              </div>
            </div>

            <!-- Selected Members Chips -->
            <div v-if="groupForm.members.length" class="flex flex-wrap gap-2 mb-6">
              <div v-for="m in groupForm.members" :key="m._id" class="flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-500/10 rounded-full border border-violet-200 dark:border-violet-500/20">
                <span class="text-[11px] font-bold text-violet-700 dark:text-violet-300">{{ m.fullName }}</span>
                <button @click="toggleGroupMember(m)" class="text-violet-400 hover:text-violet-600"><X :size="10" /></button>
              </div>
            </div>

            <button 
              @click="createGroup"
              :disabled="!groupForm.name.trim() || isCreatingGroup"
              class="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-black uppercase tracking-widest disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <div v-if="isCreatingGroup" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <Users v-else :size="14" />
              {{ isCreatingGroup ? 'Creating...' : 'Create Group' }}
            </button>
          </div>
        </NeoCard>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Search, Send, Plus, X, MessageSquare, ChevronLeft, Users, Settings, UserPlus, Check, Trash2 } from 'lucide-vue-next';
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

// Modal State
const showModal = ref(false);
const modalTab = ref('dm');

// DM Search
const studentSearchQuery = ref('');
const studentSearchResults = ref([]);
const isSearchingStudents = ref(false);

// Group Creation
const groupSearchQuery = ref('');
const groupSearchResults = ref([]);
const isCreatingGroup = ref(false);
const groupForm = ref({ name: '', description: '', members: [] });

// Group Admin Panel
const showGroupPanel = ref(false);
const addMemberQuery = ref('');
const addMemberResults = ref([]);

// ── Computed ──────────────────────────────────────────────────────────
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  return conversations.value.filter(c =>
    getConvoTitle(c).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isGroupAdmin = computed(() => {
  if (!activeConversation.value?.isGroup) return false;
  const adminId = activeConversation.value.admin?._id || activeConversation.value.admin;
  return adminId?.toString() === currentUserId.value;
});

// ── Helpers ───────────────────────────────────────────────────────────
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};

const getConvoTitle = (convo) => {
  if (convo.isGroup) return convo.name || 'Group Chat';
  if (convo.course) return `${convo.course.title} Study Group`;
  if (convo.isGlobal) return 'Global Study Room';
  if (convo.isAI) return 'PrepUp AI Tutor';
  const other = convo.participants?.find(p => p._id !== currentUserId.value);
  return other?.fullName || 'Direct Chat';
};

const getConvoImage = (convo) => {
  if (convo.isGroup) return `https://api.dicebear.com/7.x/shapes/svg?seed=${convo.name}`;
  if (convo.course) return `https://api.dicebear.com/7.x/notionists/svg?seed=${convo.course.title}`;
  if (convo.isGlobal) return 'https://api.dicebear.com/7.x/notionists/svg?seed=global';
  if (convo.isAI) return 'https://api.dicebear.com/7.x/notionists/svg?seed=ai1';
  const other = convo.participants?.find(p => p._id !== currentUserId.value);
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${other?.fullName || 'user'}`;
};

const getConvoIconStyle = (convo) => {
  if (convo.isGroup) return 'background: linear-gradient(135deg, #7c3aed, #a855f7)';
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
  const colors = ['#f43f5e','#ec4899','#d946ef','#a855f7','#8b5cf6','#6366f1','#3b82f6','#0ea5e9','#06b6d4','#14b8a6','#10b981','#22c55e','#84cc16','#eab308','#f59e0b','#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ── Conversations ─────────────────────────────────────────────────────
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
  showGroupPanel.value = false;
  messages.value = [];
  try {
    const res = await api.get(`/chat/${convo._id}`);
    messages.value = res.data.messages;
    scrollToBottom();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

// ── Send Message ──────────────────────────────────────────────────────
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !activeConversation.value) return;
  const text = newMessage.value.trim();
  const convoId = activeConversation.value._id;
  newMessage.value = '';
  systemError.value = null;

  const tempId = Date.now().toString();
  messages.value.push({ _id: tempId, sender: { _id: currentUserId.value }, text, createdAt: new Date() });
  scrollToBottom();
  if (activeConversation.value.isAI) isLoading.value = true;

  try {
    const res = await api.post(`/chat/${convoId}`, { text });
    const index = messages.value.findIndex(m => m._id === tempId);
    if (index !== -1) messages.value[index] = res.data.userMessage || res.data.message;
    if (activeConversation.value._id === convoId && res.data.aiMessage) {
      messages.value.push(res.data.aiMessage);
    }
  } catch (error) {
    if (error.response?.status === 429) systemError.value = error.response.data.message || 'Rate limit reached.';
    else systemError.value = 'Failed to deliver message.';
    messages.value = messages.value.filter(m => m._id !== tempId);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// ── Modal ─────────────────────────────────────────────────────────────
const openModal = (tab) => { modalTab.value = tab; showModal.value = true; };
const closeModal = () => {
  showModal.value = false;
  studentSearchQuery.value = '';
  studentSearchResults.value = [];
  groupSearchQuery.value = '';
  groupSearchResults.value = [];
  groupForm.value = { name: '', description: '', members: [] };
};

// ── DM Search ─────────────────────────────────────────────────────────
let searchTimeout = null;
const searchStudents = () => {
  clearTimeout(searchTimeout);
  if (!studentSearchQuery.value.trim()) { studentSearchResults.value = []; return; }
  isSearchingStudents.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api.get(`/students/search?q=${studentSearchQuery.value}`);
      studentSearchResults.value = res.data;
    } catch { /* silent */ } finally {
      isSearchingStudents.value = false;
    }
  }, 300);
};

const startDirectChat = async (student) => {
  try {
    const res = await api.post('/chat/direct/new', { targetUserId: student._id });
    const convo = res.data;
    if (!conversations.value.find(c => c._id === convo._id)) conversations.value.unshift(convo);
    closeModal();
    selectConversation(convo);
  } catch { /* silent */ }
};

// ── Group Creation ────────────────────────────────────────────────────
let groupSearchTimer = null;
const searchForGroup = () => {
  clearTimeout(groupSearchTimer);
  if (!groupSearchQuery.value.trim()) { groupSearchResults.value = []; return; }
  groupSearchTimer = setTimeout(async () => {
    try {
      const res = await api.get(`/students/search?q=${groupSearchQuery.value}`);
      groupSearchResults.value = res.data;
    } catch { /* silent */ }
  }, 300);
};

const isSelectedForGroup = (id) => groupForm.value.members.some(m => m._id === id);
const toggleGroupMember = (student) => {
  const idx = groupForm.value.members.findIndex(m => m._id === student._id);
  if (idx === -1) groupForm.value.members.push(student);
  else groupForm.value.members.splice(idx, 1);
};

const createGroup = async () => {
  if (!groupForm.value.name.trim()) return;
  isCreatingGroup.value = true;
  try {
    const res = await api.post('/chat/group/create', {
      name: groupForm.value.name,
      description: groupForm.value.description,
      memberIds: groupForm.value.members.map(m => m._id)
    });
    conversations.value.unshift(res.data);
    closeModal();
    selectConversation(res.data);
  } catch (e) {
    systemError.value = e.response?.data?.message || 'Failed to create group';
  } finally {
    isCreatingGroup.value = false;
  }
};

// ── Group Admin Actions ───────────────────────────────────────────────
let addTimer = null;
const searchForAdd = () => {
  clearTimeout(addTimer);
  if (!addMemberQuery.value.trim()) { addMemberResults.value = []; return; }
  addTimer = setTimeout(async () => {
    try {
      const res = await api.get(`/students/search?q=${addMemberQuery.value}`);
      // Filter out existing members
      const existing = (activeConversation.value.participants || []).map(p => (p._id || p).toString());
      addMemberResults.value = res.data.filter(s => !existing.includes(s._id.toString()));
    } catch { /* silent */ }
  }, 300);
};

const addMember = async (student) => {
  try {
    const res = await api.post(`/chat/group/${activeConversation.value._id}/add-member`, { memberId: student._id });
    activeConversation.value = res.data;
    // Sync in sidebar
    const idx = conversations.value.findIndex(c => c._id === res.data._id);
    if (idx !== -1) conversations.value[idx] = res.data;
    addMemberQuery.value = '';
    addMemberResults.value = [];
  } catch (e) {
    systemError.value = e.response?.data?.message || 'Failed to add member';
  }
};

const removeMember = async (memberId) => {
  try {
    const res = await api.delete(`/chat/group/${activeConversation.value._id}/remove-member`, { data: { memberId } });
    activeConversation.value = res.data;
    const idx = conversations.value.findIndex(c => c._id === res.data._id);
    if (idx !== -1) conversations.value[idx] = res.data;
  } catch (e) {
    systemError.value = e.response?.data?.message || 'Failed to remove member';
  }
};

const deleteGroup = async () => {
  if (!confirm(`Delete "${activeConversation.value.name}"? This cannot be undone.`)) return;
  try {
    await api.delete(`/chat/group/${activeConversation.value._id}`);
    conversations.value = conversations.value.filter(c => c._id !== activeConversation.value._id);
    activeConversation.value = null;
    showGroupPanel.value = false;
  } catch (e) {
    systemError.value = e.response?.data?.message || 'Failed to delete group';
  }
};

// ── Polling ───────────────────────────────────────────────────────────
const startPolling = () => {
  convoInterval.value = setInterval(fetchConversations, 15000);
  messageInterval.value = setInterval(async () => {
    if (activeConversation.value && !isLoading.value) {
      const id = activeConversation.value._id;
      try {
        const res = await api.get(`/chat/${id}`);
        if (activeConversation.value?._id === id && res.data.messages.length !== messages.value.length) {
          messages.value = res.data.messages;
          scrollToBottom();
        }
      } catch { /* silent */ }
    }
  }, 5000);
};

onMounted(async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try { const p = JSON.parse(userData); currentUserId.value = p._id || p.id; } catch { /* */ }
  }
  if (!currentUserId.value) {
    try { const res = await api.get('/auth/profile'); currentUserId.value = res.data._id; } catch { /* */ }
  }
  await fetchConversations();
  startPolling();
});

onUnmounted(() => {
  if (messageInterval.value) clearInterval(messageInterval.value);
  if (convoInterval.value) clearInterval(convoInterval.value);
});
</script>
