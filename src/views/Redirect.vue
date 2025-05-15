<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUrlStore } from '../stores/urls';

const route = useRoute();
const router = useRouter();
const urlStore = useUrlStore();

onMounted(async () => {
  const slug = route.params.slug as string;
  
  if (!slug) {
    router.push('/');
    return;
  }
  
  const url = urlStore.getUrlBySlug(slug);
  
  if (!url) {
    router.push({
      name: 'NotFound',
      params: { pathMatch: route.path.substring(1).split('/') },
      query: route.query,
      hash: route.hash,
    });
    return;
  }
  
  await urlStore.recordClick(url.id, document.referrer || null);
  window.location.href = url.originalUrl;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <svg class="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Redirecting you...</h1>
    <p class="text-neutral-600 dark:text-neutral-400">Please wait while we redirect you to your destination.</p>
  </div>
</template>