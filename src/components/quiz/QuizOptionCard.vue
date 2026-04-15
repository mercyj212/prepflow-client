<template>
  <button
    type="button"
    class="w-full text-left p-5 rounded-[12px] border-[0.5px] flex items-center gap-4 transition-all duration-200 group relative"
    :class="[cardClass, !disabled ? 'active:scale-[0.99] active:bg-zinc-50' : '']"
    :disabled="disabled"
    :aria-label="`Option ${label}`"
  >
    <div 
      class="w-9 h-9 shrink-0 rounded-full border-[0.5px] flex items-center justify-center text-[13px] font-medium transition-colors" 
      :class="badgeClass"
    >
      {{ label }}
    </div>
    <div class="flex-1">
      <span class="text-[16px] font-normal leading-relaxed text-zinc-900 dark:text-zinc-100">{{ text }}</span>
    </div>
    
    <!-- Visual feedback icon for answered states -->
    <div v-if="disabled" class="shrink-0">
      <div v-if="showSuccessIcon" class="text-success">
        <Check :size="20" :stroke-width="3" />
      </div>
      <div v-else-if="showDangerIcon" class="text-danger">
        <X :size="20" :stroke-width="3" />
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { Check, X } from 'lucide-vue-next';

const props = defineProps({
  label: { type: String, required: true },
  text: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  cardClass: { type: [String, Array, Object], default: '' },
  badgeClass: { type: [String, Array, Object], default: '' }
});

const showSuccessIcon = computed(() => {
  const str = String(props.cardClass);
  return str.includes('border-success') || str.includes('text-success');
});

const showDangerIcon = computed(() => {
  const str = String(props.cardClass);
  return str.includes('border-danger') || str.includes('text-danger');
});
</script>

