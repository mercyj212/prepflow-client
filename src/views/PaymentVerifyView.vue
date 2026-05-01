<template>
  <NeoAppShell>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <NeoCard variant="extruded" class="w-full max-w-md p-10 !rounded-[32px] text-center">
        <Loader2 v-if="status === 'verifying'" class="mx-auto mb-6 animate-spin text-zinc-400" :size="48" />
        <CheckCircle v-else-if="status === 'success'" class="mx-auto mb-6 text-emerald-500" :size="56" />
        <XCircle v-else class="mx-auto mb-6 text-rose-500" :size="56" />

        <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {{ title }}
        </h1>
        <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {{ message }}
        </p>

        <button
          v-if="status !== 'verifying'"
          @click="goNext"
          class="mt-8 w-full rounded-2xl bg-zinc-900 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          Continue
        </button>
      </NeoCard>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckCircle, Loader2, XCircle } from 'lucide-vue-next';
import api from '../api/axios';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();

const status = ref('verifying');
const courseId = ref(null);

const title = computed(() => {
  if (status.value === 'success') return 'Payment Confirmed';
  if (status.value === 'failed') return 'Payment Verification Failed';
  return 'Verifying Payment';
});

const message = computed(() => {
  if (status.value === 'success') return 'Your course access has been unlocked.';
  if (status.value === 'failed') return 'We could not confirm this transaction. Please try again or contact support.';
  return 'Please wait while we confirm your transaction with Paystack.';
});

const goNext = () => {
  if (courseId.value) {
    router.push('/subjects');
    return;
  }
  router.push('/dashboard');
};

onMounted(async () => {
  const reference = route.query.reference || route.query.trxref;
  if (!reference) {
    status.value = 'failed';
    return;
  }

  try {
    const { data } = await api.get(`/payments/verify/${reference}`);
    courseId.value = data.courseId || null;
    status.value = 'success';
  } catch (error) {
    console.error('[PAYMENT_VERIFY_ERR]:', error);
    status.value = 'failed';
  }
});
</script>
