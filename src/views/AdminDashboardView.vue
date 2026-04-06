<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors gap-4">
        <BrandLogo size="lg" />
        <div class="flex gap-4 items-center">
          <ThemeToggle />
          <router-link to="/dashboard" class="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition text-sm font-medium underline">
            Student View
          </router-link>
          <button @click="logout" class="px-4 py-2 bg-zinc-100 dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-sm font-medium text-red-600 dark:text-red-400">
            Logout
          </button>
        </div>
      </div>

      <!-- Platform Analytics Grid -->
      <div v-if="!loadingStats" class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Courses</h3>
          <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ courses.length }}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Active Quizzes</h3>
          <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ quizzes.length }}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Total Scholars
          </h3>
          <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ totalStudents }}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Submissions</h3>
          <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ allSubmissions.length }}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Platform Average</h3>
          <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ globalAverage }}%</p>
        </div>
      </div>
      <div v-else class="text-center py-6 text-zinc-500 animate-pulse">Loading analytics...</div>

      <!-- Content Management Section -->
      <h2 class="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">Content Creation</h2>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">

        <!-- Add Course -->
        <div class="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Create Course
          </h2>
          <form @submit.prevent="handleCreateCourse" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Course Title</label>
              <input v-model="courseForm.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black" placeholder="e.g. Advanced Vue 3">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Description</label>
              <textarea v-model="courseForm.description" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black" rows="3" placeholder="Course overview..."></textarea>
            </div>
            <button type="submit" :disabled="creatingCourse" class="w-full bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50">
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            Create Base Quiz
          </h2>
          <form @submit.prevent="handleCreateQuiz" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Select Course</label>
              <select v-model="quizForm.course" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black text-sm">
                <option value="" disabled>Choose a course</option>
                <option v-for="c in courses" :key="c._id" :value="c._id">{{ c.title }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Quiz Title</label>
              <input v-model="quizForm.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black" placeholder="e.g. Composition API Basics">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Time Limit (mins)</label>
              <input v-model="quizForm.timeLimit" type="number" min="1" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black">
            </div>
            <button type="submit" :disabled="creatingQuiz" class="w-full bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50">
              {{ creatingQuiz ? 'Creating...' : 'Create Shell Quiz' }}
            </button>
          </form>
          <div v-if="quizSuccessMsg" class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm text-center font-medium">
            {{ quizSuccessMsg }}
          </div>
        </div>

        <!-- AI Auto-Generate -->
        <div class="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent pointer-events-none"></div>
          <h2 class="text-xl font-bold mb-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-400 relative z-10 transition-colors uppercase tracking-widest text-[11px]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26.126.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            AI Assessment Generator
          </h2>
          <form @submit.prevent="handleGenerativeAI" class="space-y-4 relative z-10">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex items-end gap-2">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Select Target Quiz</label>
                    <select v-model="aiForm.quizId" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black text-sm">
                      <option value="" disabled>Choose a quiz</option>
                      <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }} ({{ q.questions?.length || 0 }} Qs)</option>
                    </select>
                  </div>
                  <button v-if="aiForm.quizId" @click="startQuizRename(quizzes.find(q => q._id === aiForm.quizId))" type="button" class="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:text-black dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-700" title="Rename Selected Quiz">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                </div>
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Question Count</label>
                <input v-model="aiForm.count" required type="number" min="1" max="200" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Course Material (Paste text or Upload Image/PDF)</label>
              <div class="mb-4">
                <label class="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Context & Study Material</label>
                <textarea v-model="aiForm.material" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black h-[120px] font-mono text-sm leading-relaxed mb-3" placeholder="Paste the reading material or academic context here..."></textarea>
              </div>
              
              <!-- Curriculum Asset Upload -->
              <div class="space-y-3">
                <label class="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Supplemental Study Materials</label>
                <div class="relative">
                  <!-- Active Upload Zone (only shows when under limit) -->
                  <label 
                    v-if="aiFiles.length < 10"
                    class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group bg-zinc-50/50 dark:bg-zinc-800/30 active:scale-[0.98]"
                  >
                    <div class="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors text-center">
                      <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:text-white transition-all mb-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                      </div>
                      <span class="text-xs font-bold uppercase tracking-wider">Upload New Source (Img/PDF)</span>
                      <span class="text-[10px] text-zinc-400">{{ aiFiles.length }}/10 sources active</span>
                    </div>
                    <input type="file" multiple accept="image/*,.pdf" class="hidden" @change="onAiFileChange" />
                  </label>

                  <!-- Locked Limit Card (shows when at 10) -->
                  <div 
                    v-else
                    class="flex items-center gap-4 p-5 border-2 border-amber-300 dark:border-amber-900/50 rounded-xl bg-amber-50/20 dark:bg-amber-950/20 text-left animate-in fade-in zoom-in-95 duration-300 pointer-events-none"
                  >
                    <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m1-11a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                      <span class="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">Upload Limit Reached</span>
                      <p class="text-[10px] text-amber-600/70 dark:text-amber-500/50 leading-tight">Remove a file below to replace it.</p>
                    </div>
                  </div>
                </div>
                
                <!-- Files Preview List -->
                <div v-if="aiFiles.length > 0" class="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                  <div v-for="(f, i) in aiFiles" :key="i" class="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg group shadow-sm transition-all animate-fade-in">
                    <span class="text-xs shrink-0">{{ f.type.includes('pdf') ? '📄' : '🖼️' }}</span>
                    <span class="flex-1 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 truncate">{{ f.name }}</span>
                    <button @click="removeAiFile(i)" type="button" class="p-1 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" :disabled="generatingAI" class="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 flex justify-center items-center gap-3 active:scale-98 uppercase tracking-widest text-xs">
              <svg v-if="!generatingAI" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ generatingAI ? 'Generating assignments...' : 'Craft Quiz with AI' }}</span>
            </button>
          </form>
          <div v-if="aiSuccessMsg" class="mt-4 relative z-10 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm text-center font-medium">{{ aiSuccessMsg }}</div>
          <div v-if="aiErrorMsg" class="mt-4 relative z-10 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-sm text-center font-medium">{{ aiErrorMsg }}</div>
        </div>
      </div>

      <!-- Inventory Management -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Course Inventory -->
        <div>
          <h2 class="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">Active Courses</h2>
          <div v-if="courses.length === 0" class="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p class="text-zinc-500">No courses yet.</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="course in courses"
              :key="course._id"
              class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <!-- Course Header Row -->
              <div class="p-4 flex items-center gap-3">
                <!-- Inline Rename / Display -->
                <div class="flex-1 min-w-0">
                  <div v-if="renamingId === course._id" class="flex items-center gap-2">
                    <input
                      v-model="renameTitle"
                      @keyup.enter="submitRename(course._id)"
                      @keyup.escape="cancelRename"
                      class="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      placeholder="New course title"
                      autofocus
                    />
                    <button @click="submitRename(course._id)" :disabled="renamingLoading" class="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg transition disabled:opacity-50">
                      {{ renamingLoading ? '...' : 'Save' }}
                    </button>
                    <button @click="cancelRename" class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium rounded-lg transition">Cancel</button>
                  </div>
                  <div v-else>
                    <h3 class="font-bold text-zinc-900 dark:text-white truncate">{{ course.title }}</h3>
                    <p class="text-xs text-zinc-500 mt-0.5">
                      {{ quizzes.filter(q => (q.course?._id || q.course) === course._id).length }} Quizzes &bull;
                      {{ course.materials?.length || 0 }} Materials
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-1 shrink-0">
                  <!-- Upload toggle -->
                  <button
                    @click="toggleUpload(course._id)"
                    :class="['p-2 rounded-lg transition-colors', uploadingId === course._id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200']"
                    title="Upload Material"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </button>
                  <!-- Rename toggle -->
                  <button
                    @click="startRename(course)"
                    :class="['p-2 rounded-lg transition-colors', renamingId === course._id ? 'text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200']"
                    title="Rename Course"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <!-- Delete -->
                  <button @click="handleDeleteCourse(course._id)" class="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg" title="Delete Course">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>

              <!-- Upload Panel (collapsible) -->
              <div v-if="uploadingId === course._id" class="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-4">
                <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Upload Course Material</p>
                <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors group">
                  <div class="flex flex-col items-center gap-1 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v12m0-12l-3 3m3-3l3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1"/></svg>
                    <span class="text-xs font-medium">{{ uploadFile ? uploadFile.name : 'Click to select image or PDF' }}</span>
                    <span class="text-[10px] text-zinc-400">JPG, PNG, WEBP, PDF · Max 20MB</span>
                  </div>
                  <input type="file" accept="image/*,.pdf" class="hidden" @change="onFileChange" />
                </label>

                <div v-if="uploadFile" class="mt-3 flex items-center gap-2">
                  <div class="flex-1 flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <span class="text-lg">{{ uploadFile.type === 'application/pdf' ? '📄' : '🖼️' }}</span>
                    <span class="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{{ uploadFile.name }}</span>
                    <span class="text-[10px] text-zinc-400 shrink-0">{{ (uploadFile.size / 1024 / 1024).toFixed(2) }} MB</span>
                  </div>
                  <button
                    @click="submitUpload(course._id)"
                    :disabled="uploadingFile"
                    class="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <div v-if="uploadingFile" class="w-3 h-3 border-2 border-white/30 border-t-zinc-900 rounded-full animate-spin"></div>
                    {{ uploadingFile ? 'Uploading...' : 'Upload' }}
                  </button>
                </div>

                <div v-if="uploadSuccessMsg" class="mt-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs text-center font-medium">{{ uploadSuccessMsg }}</div>
                <div v-if="uploadErrorMsg" class="mt-2 p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-xs text-center font-medium">{{ uploadErrorMsg }}</div>

                <!-- Existing Materials List -->
                <div v-if="course.materials && course.materials.length > 0" class="mt-4 space-y-2">
                  <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Uploaded Materials ({{ course.materials.length }})</p>
                  <div
                    v-for="mat in course.materials"
                    :key="mat._id"
                    class="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg group"
                  >
                    <span class="text-base shrink-0">{{ mat.type === 'pdf' ? '📄' : '🖼️' }}</span>
                    <a :href="mat.url" target="_blank" rel="noopener noreferrer" class="flex-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white truncate transition-colors">
                      {{ mat.name }}
                    </a>
                    <span class="text-[10px] text-zinc-400 shrink-0 uppercase font-bold bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{{ mat.type }}</span>
                    <button @click="handleDeleteMaterial(course._id, mat._id)" class="p-1 text-zinc-300 dark:text-zinc-600 hover:text-red-500 transition-colors shrink-0" title="Delete material">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
                <div v-else class="mt-4 text-center text-xs text-zinc-400 py-2">No materials uploaded yet.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Inventory -->
        <div>
          <h2 class="text-2xl font-bold mb-6 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">Quiz Practice Links</h2>
          <div v-if="quizzes.length === 0" class="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p class="text-zinc-500">No quizzes yet.</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="quiz in quizzes" :key="quiz._id" class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div v-if="renamingQuizId === quiz._id" class="flex items-center gap-2 mb-2">
                    <input
                      v-model="renameQuizTitle"
                      @keyup.enter="submitQuizRename(quiz._id)"
                      @keyup.escape="cancelQuizRename"
                      class="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-1 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="New quiz title"
                      autofocus
                    />
                    <button @click="submitQuizRename(quiz._id)" :disabled="renamingQuizLoading" class="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg transition">
                      {{ renamingQuizLoading ? '...' : 'Save' }}
                    </button>
                    <button @click="cancelQuizRename" class="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium rounded-lg">Cancel</button>
                  </div>
                  <h3 v-else class="font-bold text-zinc-900 dark:text-white">{{ quiz.title }}</h3>
                  
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">{{ quiz.course?.title || 'General' }}</span>
                    <span class="text-[10px] text-zinc-300">•</span>
                    <span class="text-[10px] text-zinc-400 font-bold">{{ quiz.questions?.length || 0 }} Qs</span>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="startQuizRename(quiz)" class="flex items-center gap-1.5 px-2 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all group" title="Rename Quiz">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    <span class="text-[10px] font-bold uppercase tracking-wider">Rename</span>
                  </button>
                  <button @click="handleDeleteQuiz(quiz._id)" class="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Delete Quiz">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <input type="text" readonly :value="getPracticeLink(quiz._id)" class="flex-1 bg-transparent text-[10px] font-mono text-zinc-400 focus:outline-none truncate">
                <button @click="copyLink(quiz._id)" class="px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded transition-colors">
                  {{ copiedId === quiz._id ? 'COPIED' : 'COPY' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scholarly Registry Section -->
      <div class="mt-20">
        <div class="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5 transition-colors">
          <div>
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Student Management</h2>
            <button @click="openEmailModal()" class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
              Broadcast to All 📣
            </button>
          </div>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Monitor registered students and platform engagement.</p>
          </div>
          <div class="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm shadow-indigo-500/5">
            {{ totalStudents }} Verified Students
          </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
          <div class="overflow-x-auto">
            <table class="w-full text-left font-sans">
              <thead>
                <tr class="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50">
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Student Profile</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Communications</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 text-center">Last Engagement</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 text-center">Device Signature</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 text-right">Status</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <tr v-for="student in incomingScholars" :key="student._id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs uppercase shadow-lg shadow-zinc-900/10 dark:shadow-none">
                        {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                      </div>
                      <div>
                        <p class="font-bold text-zinc-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors text-base lowercase tracking-tight">{{ student.fullName }}</p>
                        <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.25em] mt-0.5">ID:{{ student._id.slice(-6) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2 group/text">
                        <svg class="w-3.5 h-3.5 text-zinc-300 group-hover/text:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">{{ student.email }}</span>
                      </div>
                      <div v-if="student.phone" class="flex items-center gap-2 group/text">
                        <svg class="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{{ student.phone }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-center whitespace-nowrap">
                    <div class="inline-flex flex-col items-center">
                      <span class="text-[11px] font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                        {{ new Date(student.lastLogin || student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
                      </span>
                      <div class="flex items-center gap-1 mt-0.5">
                        <span class="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span class="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                          {{ formatFullTime(student.lastLogin || student.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <div class="flex flex-col items-center gap-1.5">
                      <div class="px-2.5 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.15em] rounded-lg shadow-sm">
                        {{ parseDevice(student.deviceInfo) }}
                      </div>
                      <span class="text-[8px] text-zinc-400 font-medium truncate max-w-[140px] opacity-60 group-hover:opacity-100 transition-opacity">
                        {{ student.deviceInfo?.split(') ')[0]?.split(' (')[1] || 'Web Browser' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm', student.accessStatus === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-100 dark:border-red-500/20']">
                      {{ student.accessStatus || 'Active' }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openEmailModal(student)" class="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all" title="Message Scholar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </button>
                      <button @click="handleDeleteStudent(student._id)" class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all" title="Remove Scholar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="incomingScholars.length === 0">
                  <td colspan="4" class="px-8 py-20 text-center">
                    <div class="flex flex-col items-center">
                      <div class="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </div>
                      <p class="text-zinc-400 font-medium italic text-sm">Waiting for scholars to register...</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 📧 EMAIL COMPOSER MODAL -->
    <div v-if="emailModalVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div class="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] mb-1" 
                :class="isBlastMode ? 'text-red-500' : 'text-indigo-500'">
              {{ isBlastMode ? 'Global Announcement' : 'Direct Message' }}
            </h2>
            <p class="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ isBlastMode ? `Message to All ${incomingScholars.length} Students` : `Message to ${emailTargetName}` }}
            </p>
          </div>
          <button @click="emailModalVisible = false" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">&times;</button>
        </div>

        <div class="p-10 space-y-6">
          <div>
            <label class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-3">Email Subject</label>
            <input v-model="emailSubject" type="text" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g., Examination Update">
          </div>
          <div>
            <label class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-3">Your Message</label>
            <textarea v-model="emailMessage" rows="6" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" placeholder="Draft your message to the scholar here..."></textarea>
          </div>
          
          <button @click="handleSendEmail" 
            :disabled="emailLoading"
            class="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-zinc-900/10 hover:translate-y-[-2px] transition-all disabled:opacity-50">
            {{ emailLoading ? 'Dispatching...' : 'Fire Dispatch 🚀' }}
          </button>
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
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000/api' 
    : 'https://prepflow-server.onrender.com/api',
  headers: {
    Authorization: `Bearer ${authStore.token}`
  }
});

// ── Core State ──────────────────────────────────────────────
const courses = ref([]);
const quizzes = ref([]);
const allSubmissions = ref([]);
const totalStudents = ref(0);
const incomingScholars = ref([]); // Full student list
const loadingStats = ref(true);
const copiedId = ref(null);

// ── Forms ────────────────────────────────────────────────────
const courseForm = ref({ title: '', description: '' });
const quizForm = ref({ course: '', title: '', timeLimit: 30 });
const aiForm = ref({ quizId: '', material: '', count: 100 });

// ── Loading Flags ─────────────────────────────────────────────
const creatingCourse = ref(false);
const creatingQuiz = ref(false);
const generatingAI = ref(false);

// ── Success/Error Messages ────────────────────────────────────
const successMsg = ref('');
const quizSuccessMsg = ref('');
const aiSuccessMsg = ref('');
const aiErrorMsg = ref('');

// ── Rename State ──────────────────────────────────────────────
const renamingId = ref(null);
const renameTitle = ref('');
const renamingLoading = ref(false);

const startRename = (course) => {
  if (renamingId.value === course._id) {
    cancelRename();
    return;
  }
  renamingId.value = course._id;
  renameTitle.value = course.title;
};

const cancelRename = () => {
  renamingId.value = null;
  renameTitle.value = '';
  renamingLoading.value = false;
};

const submitRename = async (id) => {
  if (!renameTitle.value.trim()) return;
  renamingLoading.value = true;
  try {
    await api.put(`/courses/${id}/rename`, { title: renameTitle.value.trim() });
    cancelRename();
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Error renaming course');
    renamingLoading.value = false;
  }
};

// ── Email System ────────────────────────────────────────────────
const emailModalVisible = ref(false);
const emailLoading = ref(false);
const emailSubject = ref('');
const emailMessage = ref('');
const emailTargetId = ref(null);
const emailTargetName = ref('');
const isBlastMode = ref(false);

const openEmailModal = (student = null) => {
  if (student) {
    isBlastMode.value = false;
    emailTargetId.value = student._id;
    emailTargetName.value = student.fullName;
  } else {
    isBlastMode.value = true;
    emailTargetName.value = 'All Registered Scholars';
  }
  
  emailSubject.value = isBlastMode.value ? 'Global Announcement: PrepUp CBT' : 'Update from PrepUp CBT';
  emailMessage.value = '';
  emailModalVisible.value = true;
};

const handleSendEmail = async () => {
  if (!emailMessage.value) return;
  emailLoading.value = true;
  try {
    const endpoint = isBlastMode.value ? '/students/email-blast' : '/students/email';
    const payload = isBlastMode.value 
      ? { subject: emailSubject.value, message: emailMessage.value }
      : { id: emailTargetId.value, subject: emailSubject.value, message: emailMessage.value };

    const res = await api.post(endpoint, payload);
    alert(res.data.message);
    emailModalVisible.value = false;
  } catch (err) {
    alert(err.response?.data?.message || 'Email dispatch failed');
  } finally {
    emailLoading.value = false;
  }
};

const handleDeleteStudent = async (id) => {
  if (!confirm('Permanently remove this scholar? This cannot be undone.')) return;
  try {
    await api.delete(`/students/${id}`);
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Error deleting student');
  }
};

// ── Quiz Rename State ───────────────────────────────────────────
const renamingQuizId = ref(null);
const renameQuizTitle = ref('');
const renamingQuizLoading = ref(false);

const startQuizRename = (quiz) => {
  if (renamingQuizId.value === quiz._id) {
    cancelQuizRename();
    return;
  }
  renamingQuizId.value = quiz._id;
  renameQuizTitle.value = quiz.title;
};

const cancelQuizRename = () => {
  renamingQuizId.value = null;
  renameQuizTitle.value = '';
  renamingQuizLoading.value = false;
};

const submitQuizRename = async (id) => {
  if (!renameQuizTitle.value.trim()) return;
  renamingQuizLoading.value = true;
  try {
    await api.put(`/quizzes/${id}/rename`, { title: renameQuizTitle.value.trim() });
    cancelQuizRename();
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Error renaming quiz');
    renamingQuizLoading.value = false;
  }
};

// ── Upload State ──────────────────────────────────────────────
const uploadingId = ref(null);
const uploadFile = ref(null);
const uploadingFile = ref(false);
const uploadSuccessMsg = ref('');
const uploadErrorMsg = ref('');

const toggleUpload = (courseId) => {
  if (uploadingId.value === courseId) {
    uploadingId.value = null;
    uploadFile.value = null;
    uploadSuccessMsg.value = '';
    uploadErrorMsg.value = '';
  } else {
    uploadingId.value = courseId;
    uploadFile.value = null;
    uploadSuccessMsg.value = '';
    uploadErrorMsg.value = '';
    // close rename if open
    if (renamingId.value) cancelRename();
  }
};

const onFileChange = (e) => {
  uploadFile.value = e.target.files[0] || null;
  uploadSuccessMsg.value = '';
  uploadErrorMsg.value = '';
};

const submitUpload = async (courseId) => {
  if (!uploadFile.value) return;
  uploadingFile.value = true;
  uploadSuccessMsg.value = '';
  uploadErrorMsg.value = '';

  const formData = new FormData();
  formData.append('file', uploadFile.value);

  try {
    await api.post(`/courses/${courseId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    uploadSuccessMsg.value = `"${uploadFile.value.name}" uploaded successfully!`;
    uploadFile.value = null;
    fetchCoreData();
    setTimeout(() => uploadSuccessMsg.value = '', 4000);
  } catch (err) {
    uploadErrorMsg.value = err.response?.data?.message || 'Upload failed. Check Cloudinary credentials.';
    setTimeout(() => uploadErrorMsg.value = '', 6000);
  } finally {
    uploadingFile.value = false;
  }
};

const handleDeleteMaterial = async (courseId, materialId) => {
  if (!confirm('Remove this material?')) return;
  try {
    await api.delete(`/courses/${courseId}/materials/${materialId}`);
    fetchCoreData();
  } catch (err) {
    alert('Error deleting material');
  }
};

// ── Analytics ─────────────────────────────────────────────────
const globalAverage = computed(() => {
  if (allSubmissions.value.length === 0) return 0;
  const total = allSubmissions.value.reduce((acc, sub) => acc + ((sub.score / sub.totalQuestions) * 100), 0);
  return Math.round(total / allSubmissions.value.length);
});

// ── Data Fetching ─────────────────────────────────────────────
const fetchCoreData = async () => {
  loadingStats.value = true;
  try {
    const courseRes = await api.get('/courses');
    courses.value = courseRes.data;
    const quizRes = await api.get('/quizzes');
    quizzes.value = quizRes.data;
    const subsData = await quizStore.fetchAllSubmissions();
    allSubmissions.value = subsData || [];

    const studentCountRes = await api.get('/students/count');
    totalStudents.value = studentCountRes.data.count;

    const studentListRes = await api.get('/students');
    incomingScholars.value = studentListRes.data;
  } catch (err) {
    console.error(err);
  } finally {
    loadingStats.value = false;
  }
};

const formatDate = (dateString, fallbackDate) => {
  const actualDate = dateString || fallbackDate;
  if (!actualDate) return 'Unknown';
  
  const date = new Date(actualDate);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatFullTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const parseDevice = (ua) => {
  if (!ua || ua === 'Unknown') return 'Legacy Account';
  if (ua.includes('iPhone')) return 'iPhone';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPad')) return 'iPad';
  if (ua.includes('Windows')) return 'Windows PC';
  if (ua.includes('Macintosh')) return 'MacBook';
  return 'Desktop';
};

onMounted(() => fetchCoreData());

// ── Course CRUD ───────────────────────────────────────────────
const handleCreateCourse = async () => {
  creatingCourse.value = true;
  successMsg.value = '';
  try {
    await api.post('/courses', courseForm.value);
    successMsg.value = 'Course created successfully!';
    courseForm.value = { title: '', description: '' };
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Error creating course');
  } finally {
    creatingCourse.value = false;
    setTimeout(() => successMsg.value = '', 3000);
  }
};

const handleDeleteCourse = async (id) => {
  if (!confirm('Are you sure? This will NOT delete associated quizzes, but they will lose their course reference.')) return;
  try {
    await api.delete(`/courses/${id}`);
    fetchCoreData();
  } catch (err) {
    alert('Error deleting course');
  }
};

// ── Quiz CRUD ─────────────────────────────────────────────────
const handleCreateQuiz = async () => {
  creatingQuiz.value = true;
  quizSuccessMsg.value = '';
  try {
    await api.post('/quizzes', quizForm.value);
    quizSuccessMsg.value = 'Quiz created! Now use the AI panel to add questions.';
    quizForm.value = { course: '', title: '', timeLimit: 30 };
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Error creating quiz');
  } finally {
    creatingQuiz.value = false;
    setTimeout(() => quizSuccessMsg.value = '', 6000);
  }
};

const handleDeleteQuiz = async (id) => {
  if (!confirm('Delete this quiz?')) return;
  try {
    await api.delete(`/quizzes/${id}`);
    fetchCoreData();
  } catch (err) {
    alert('Error deleting quiz');
  }
};

// ── AI Generate ───────────────────────────────────────────────
const aiFiles = ref([]);
const onAiFileChange = (e) => {
  const selected = Array.from(e.target.files);
  const remaining = 10 - aiFiles.value.length;
  if (remaining <= 0) return;
  
  const toAdd = selected.slice(0, remaining);
  aiFiles.value = [...aiFiles.value, ...toAdd];
  
  if (selected.length > remaining) {
    alert(`Only first 10 files were added (Limit reached).`);
  }
};

const removeAiFile = (index) => {
  aiFiles.value.splice(index, 1);
};

const handleGenerativeAI = async () => {
  generatingAI.value = true;
  aiSuccessMsg.value = '';
  aiErrorMsg.value = '';

  const formData = new FormData();
  aiFiles.value.forEach(f => formData.append('files', f));
  if (aiForm.value.material) formData.append('material', aiForm.value.material);
  formData.append('count', aiForm.value.count);

  try {
    await api.post(`/quizzes/${aiForm.value.quizId}/generate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    aiSuccessMsg.value = `${aiForm.value.count} Questions successfully generated and added!`;
    aiForm.value.material = '';
    aiFiles.value = [];
    fetchCoreData();
  } catch (err) {
    aiErrorMsg.value = err.response?.data?.message || 'Error communicating with AI. Check server logs.';
  } finally {
    generatingAI.value = false;
    setTimeout(() => { aiSuccessMsg.value = ''; aiErrorMsg.value = ''; }, 6000);
  }
};

// ── Practice Link utils ───────────────────────────────────────
const getPracticeLink = (id) => `${window.location.origin}/practice/${id}`;

const copyLink = (id) => {
  navigator.clipboard.writeText(getPracticeLink(id));
  copiedId.value = id;
  setTimeout(() => copiedId.value = null, 2000);
};

// ── Auth ──────────────────────────────────────────────────────
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
