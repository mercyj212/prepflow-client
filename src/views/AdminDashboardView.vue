<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors gap-4">
        <div>
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-500">
            Admin Portal
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2">Manage courses, monitor analytics, and construct interactive quizzes.</p>
        </div>
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
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white relative z-10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Auto-Generate with AI
          </h2>
          <form @submit.prevent="handleGenerativeAI" class="space-y-4 relative z-10">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Select Target Quiz</label>
                <select v-model="aiForm.quizId" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black text-sm">
                  <option value="" disabled>Choose a quiz</option>
                  <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }} ({{ q.questions?.length || 0 }} Qs)</option>
                </select>
              </div>
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Question Count</label>
                <input v-model="aiForm.count" required type="number" min="1" max="200" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Course Material (Paste text, notes, or chapter)</label>
              <textarea v-model="aiForm.material" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:ring-black focus:border-black h-[178px] font-mono text-sm leading-relaxed" placeholder="Paste the reading material here..."></textarea>
            </div>
            <button type="submit" :disabled="generatingAI" class="w-full bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2">
              <div v-if="generatingAI" class="w-4 h-4 border-2 border-white/30 border-t-zinc-900 rounded-full animate-spin"></div>
              <span>{{ generatingAI ? 'AI is analyzing and generating...' : 'Generate Questions' }}</span>
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
                <div>
                  <h3 class="font-bold text-zinc-900 dark:text-white">{{ quiz.title }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">{{ quiz.course?.title || 'General' }}</span>
                    <span class="text-[10px] text-zinc-300">•</span>
                    <span class="text-[10px] text-zinc-400 font-bold">{{ quiz.questions?.length || 0 }} Qs</span>
                  </div>
                </div>
                <button @click="handleDeleteQuiz(quiz._id)" class="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Delete Quiz">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
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
  baseURL: 'https://prepflow-server.onrender.com/api',
  headers: {
    Authorization: `Bearer ${authStore.token}`
  }
});

// ── Core State ──────────────────────────────────────────────
const courses = ref([]);
const quizzes = ref([]);
const allSubmissions = ref([]);
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
  } catch (err) {
    console.error(err);
  } finally {
    loadingStats.value = false;
  }
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
    aiForm.value.material = '';
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
