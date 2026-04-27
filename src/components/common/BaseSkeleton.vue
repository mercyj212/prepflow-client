<template>
  <div
    :class="[
      'animate-pulse bg-zinc-300/60 dark:bg-zinc-800/60 rounded-xl',
      customClass
    ]"
    :style="{
      width: width,
      height: height
    }"
  ></div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1rem'
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>
