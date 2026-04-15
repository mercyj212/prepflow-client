<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-4">
    <div class="w-full sm:max-w-xl bg-white dark:bg-zinc-900 border-[0.5px] border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl p-5">
      <h3 class="text-[18px] font-medium text-zinc-900 dark:text-white">Review flagged questions</h3>
      <p class="mt-1 text-[14px] font-normal text-zinc-500 dark:text-zinc-400">
        You have {{ flaggedIndexes.length }} flagged question(s). Select any question to review before you submit.
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="index in flaggedIndexes"
          :key="index"
          type="button"
          @click="$emit('jump', index)"
          class="px-3 py-1.5 rounded-lg border-[0.5px] border-[#e5e5e5] dark:border-[#2a2a2a] text-[13px] font-medium text-zinc-700 dark:text-zinc-200"
        >
          Question {{ index + 1 }}
        </button>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg border-[0.5px] border-[#e5e5e5] dark:border-[#2a2a2a] text-[14px] font-medium text-zinc-700 dark:text-zinc-100"
        >
          Keep reviewing
        </button>
        <button
          type="button"
          @click="$emit('submit')"
          class="px-4 py-2 rounded-lg border-[0.5px] border-brand bg-brand text-white text-[14px] font-medium"
        >
          Submit now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'jump', 'submit']);

defineProps({
  open: { type: Boolean, default: false },
  flaggedIndexes: { type: Array, default: () => [] }
});
</script>
