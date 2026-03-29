<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <div class="w-full max-w-xl rounded-2xl bg-zinc-900 p-6 shadow-2xl border border-zinc-800">
      
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-zinc-400">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </p>
        <p class="text-sm font-semibold text-red-400">
          Time: {{ formattedTime }}
        </p>
      </div>

      <div class="w-full bg-zinc-700 rounded-full h-2 mb-4">
        <div
          class="bg-green-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <div class="mb-6">
        <h1 class="text-white text-xl font-semibold leading-relaxed">
          {{ currentQuestion.question }}
        </h1>
      </div>

      <div class="space-y-3">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="selectAnswer(option)"
          :disabled="answered"
          :class="[
            'w-full rounded-xl border px-4 py-3 text-left text-white transition hover:scale-[1.02]',
            getOptionClass(option)
          ]"
        >
          <span class="font-medium mr-2">{{ optionLabels[index] }}.</span>
          <span>{{ option }}</span>
        </button>
      </div>

      <div
        v-if="answered"
        class="mt-6 rounded-xl bg-zinc-800 p-4 border border-zinc-700"
      >
        <p v-if="isCorrect" class="text-green-400 font-semibold">
          Correct ✅
        </p>

        <div v-else>
          <p class="text-red-400 font-semibold mb-1">Wrong ❌</p>
          <p class="text-zinc-300">
            Correct answer:
            <span class="text-green-400 font-semibold">
              {{ currentQuestion.answer }}
            </span>
          </p>
        </div>

        <button
          @click="nextQuestion"
          class="mt-4 inline-flex items-center rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          {{ currentIndex === questions.length - 1 ? 'Finish' : 'Next Question' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { questions } from '../data/questions'

const router = useRouter()
const optionLabels = ['A', 'B', 'C', 'D']

const currentIndex = ref(0)
const selectedAnswer = ref('')
const answered = ref(false)
const score = ref(0)

const timeLeft = ref(1800)
let timer = null

const currentQuestion = computed(() => questions[currentIndex.value])

const isCorrect = computed(() => {
  return selectedAnswer.value === currentQuestion.value.answer
})

const progress = computed(() => {
  return ((currentIndex.value + 1) / questions.length) * 100
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      goToResult()
    }
  }, 1000)
}

function goToResult() {
  router.push({
    path: '/result',
    query: {
      score: score.value,
      total: questions.length,
    },
  })
}

function selectAnswer(option) {
  if (answered.value) return

  selectedAnswer.value = option
  answered.value = true

  if (option === currentQuestion.value.answer) {
    score.value++
  }
}

function getOptionClass(option) {
  if (!answered.value) {
    return 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
  }

  if (option === currentQuestion.value.answer) {
    return 'border-green-500 bg-zinc-900'
  }

  if (option === selectedAnswer.value) {
    return 'border-red-500 bg-zinc-900'
  }

  return 'border-zinc-700 bg-zinc-900 opacity-70'
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    selectedAnswer.value = ''
    answered.value = false
  } else {
    goToResult()
  }
}

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>