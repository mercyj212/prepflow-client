<template>
  <NeoAppShell>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-6">
      
      <!-- Left Sidebar: Table of Contents -->
      <div class="w-full md:w-1/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 overflow-y-auto hidden md:block shrink-0 h-full">
        <div class="flex items-center gap-3 mb-6">
          <button @click="router.back()" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft :size="20" class="text-zinc-500" />
          </button>
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Chapters</h2>
        </div>

        <div v-if="noteStore.loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
        
        <div v-else-if="noteStore.notes.length === 0" class="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
          No notes available for this course yet.
        </div>

        <div v-else class="space-y-2">
          <button 
            v-for="(note, index) in noteStore.notes" 
            :key="note._id"
            @click="activeNoteId = note._id"
            class="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group"
            :class="activeNoteId === note._id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'"
          >
            <span class="text-sm font-medium line-clamp-2 pr-2">{{ index + 1 }}. {{ note.chapterTitle }}</span>
            <ChevronRight v-if="activeNoteId === note._id" :size="16" class="shrink-0" />
          </button>
        </div>
      </div>

      <!-- Main Content Area: Reading View -->
      <div class="w-full md:w-3/4 flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden relative">
        <div class="flex-1 overflow-y-auto p-6 md:p-12 prose dark:prose-invert max-w-none relative scroll-smooth">
          <div v-if="noteStore.loading" class="space-y-6">
            <div class="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-3/4 animate-pulse"></div>
            <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full animate-pulse"></div>
            <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full animate-pulse"></div>
            <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-5/6 animate-pulse"></div>
          </div>
          
          <div v-else-if="!activeNote">
            <div class="flex flex-col items-center justify-center h-full text-center mt-20">
              <div class="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
                <BookOpen :size="32" class="text-zinc-400" />
              </div>
              <h3 class="text-xl font-bold text-zinc-900 dark:text-white mb-2">Select a Chapter</h3>
              <p class="text-zinc-500 dark:text-zinc-400">Choose a topic from the sidebar to start reading.</p>
            </div>
          </div>

          <div v-else class="pb-32">
            <h1 class="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-8 tracking-tight">{{ activeNote.chapterTitle }}</h1>
            <div class="markdown-body" v-html="sanitizedContent"></div>
          </div>
        </div>

        <!-- AI Tutor Floating Button -->
        <button 
          v-if="activeNote && !showAITutor"
          @click="showAITutor = true"
          class="absolute bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 group z-10"
        >
          <Sparkles :size="24" class="group-hover:animate-pulse" />
          <span class="font-bold pr-2 hidden md:block">Ask AI Tutor</span>
        </button>

        <!-- AI Tutor Slide-over Panel -->
        <div 
          class="absolute top-0 right-0 h-full w-full md:w-96 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-l border-zinc-200 dark:border-zinc-800 shadow-2xl transform transition-transform duration-300 flex flex-col z-20"
          :class="showAITutor ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles :size="20" />
              <h3 class="font-bold">AI Tutor</h3>
            </div>
            <button @click="showAITutor = false" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500">
              <X :size="20" />
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
            <div v-if="chatMessages.length === 0" class="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-10">
              <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain :size="24" class="text-indigo-500" />
              </div>
              I'm your AI Tutor. Ask me anything about <strong>{{ activeNote?.chapterTitle }}</strong>! I can simplify concepts or give you a quick quiz.
            </div>
            
            <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex flex-col" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
              <div 
                class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm"
                :class="msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none'"
              >
                <div v-if="msg.role === 'ai'" class="markdown-body text-[13px] prose-p:my-1" v-html="renderMarkdown(msg.content)"></div>
                <div v-else>{{ msg.content }}</div>
              </div>
            </div>
            <div v-if="aiTyping" class="flex items-start">
               <div class="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 text-zinc-500 flex gap-1">
                 <div class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                 <div class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></div>
                 <div class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          </div>

          <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <form @submit.prevent="sendAiMessage" class="flex gap-2">
              <input 
                v-model="aiInput" 
                type="text" 
                placeholder="Ask for an explanation..." 
                class="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                :disabled="aiTyping"
              />
              <button 
                type="submit" 
                class="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                :disabled="!aiInput.trim() || aiTyping"
              >
                <Send :size="18" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, ChevronRight, BookOpen, Sparkles, X, Send, Brain } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import { useNoteStore } from '../store/note';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();
const noteStore = useNoteStore();

const activeNoteId = ref(null);
const showAITutor = ref(false);
const chatMessages = ref([]);
const aiInput = ref('');
const aiTyping = ref(false);
const chatContainer = ref(null);

const courseId = computed(() => route.params.courseId);

const activeNote = computed(() => {
  if (!noteStore.notes.length) return null;
  return noteStore.notes.find(n => n._id === activeNoteId.value) || noteStore.notes[0];
});

onMounted(async () => {
  await noteStore.fetchNotesByCourse(courseId.value);
  if (noteStore.notes.length > 0) {
    activeNoteId.value = noteStore.notes[0]._id;
  }
  
  // Configure marked for code highlighting
  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });
});

const sanitizedContent = computed(() => {
  if (!activeNote.value) return '';
  const rawHtml = marked.parse(activeNote.value.content);
  return DOMPurify.sanitize(rawHtml);
});

const renderMarkdown = (text) => {
  return DOMPurify.sanitize(marked.parse(text));
};

const sendAiMessage = async () => {
  if (!aiInput.value.trim() || aiTyping.value) return;
  
  const userText = aiInput.value.trim();
  chatMessages.value.push({ role: 'user', content: userText });
  aiInput.value = '';
  aiTyping.value = true;
  
  await nextTick();
  scrollToBottom();

  try {
    // Formulate a prompt that includes the current chapter content as context
    const contextText = activeNote.value?.content ? activeNote.value.content.substring(0, 3000) : ''; 
    const systemPrompt = `You are a helpful AI Tutor for a student studying "${activeNote.value?.chapterTitle}". 
Here is the context of what they are reading: 
"""
${contextText}
"""
Based on this context, answer the student's question clearly, concisely, and encouragingly. Use formatting like bold or bullet points if it helps explain better.`;

    // Send to our backend chat endpoint
    const response = await api.post('/chat', {
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatMessages.value.map(m => ({ role: m.role, content: m.content }))
      ]
    });
    
    if (response.data && response.data.reply) {
      chatMessages.value.push({ role: 'ai', content: response.data.reply });
    } else {
      chatMessages.value.push({ role: 'ai', content: "I'm sorry, I encountered an error connecting to my brain." });
    }
  } catch (err) {
    console.error('AI Tutor error:', err);
    chatMessages.value.push({ role: 'ai', content: "Oops, something went wrong. Please try asking again." });
  } finally {
    aiTyping.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Reset chat if they switch chapters
watch(activeNoteId, () => {
  if (showAITutor.value) {
    chatMessages.value = [];
    chatMessages.value.push({ role: 'ai', content: `I see you switched to **${activeNote.value?.chapterTitle}**. What would you like me to explain from this chapter?` });
  } else {
    chatMessages.value = [];
  }
});
</script>
