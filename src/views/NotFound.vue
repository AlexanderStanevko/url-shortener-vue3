<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <h1 class="text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
    <h2 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Page Not Found</h2>
    <p class="text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <button @click="goHome" class="btn btn-primary px-6 py-2">
      Go back home
    </button>
  </div>
</template>