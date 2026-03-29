<template>
    <div class="min-h-screen bg-black flex items-center justify-center px-4">
        <div class="w-full max-w-md rounded-2xl bg-zinc-900 p-8 text-white shadow-2xl border border-zinc-800">
            <h1 class="text-3xl font-bold text-center mb-4 ">Your Result</h1>

            <p class="text-center text-lg mb-2">
                You scored
            </p>

            <p class="text-center text-4xl font-bold text-green-400 mb-6">
                {{ score }} / {{ total }}
            </p>

            <button 
                @click="goHome"
                class="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
            >
                Try Again
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const score = Number(route.query.score || 0)
const total = Number(route.query.total || 0)

const percentage = computed(() => {
    if (!total) return 0
    return Math.round((score / total) * 100)
})

function goHome() {
    router.push('/')
}
</script>