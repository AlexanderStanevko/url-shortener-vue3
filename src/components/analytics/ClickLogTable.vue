<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ClickEvent } from '../../types';
import { formatDate } from '../../utils/helpers';

const props = defineProps<{
  clicks: ClickEvent[];
}>();

const sortBy = ref('timestamp');
const sortDirection = ref('desc');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const sortedClicks = computed(() => {
  const sorted = [...props.clicks].sort((a, b) => {
    if (sortBy.value === 'timestamp') {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      return sortDirection.value === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });
  
  return sorted;
});

const paginatedClicks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  
  return sortedClicks.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(props.clicks.length / itemsPerPage.value));

const toggleSort = (column: string) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'desc';
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const formatUserAgent = (userAgent: string | null) => {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
  
  return 'Other';
};
</script>

<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
    <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
      <thead class="bg-neutral-50 dark:bg-neutral-800">
        <tr>
          <th 
            scope="col" 
            class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
            @click="toggleSort('timestamp')"
          >
            <div class="flex items-center space-x-1">
              <span>Timestamp</span>
              <span v-if="sortBy === 'timestamp'">
                <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-neutral-900 dark:text-neutral-100">User Agent</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-neutral-900 dark:text-neutral-100">Referrer</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-900">
        <tr v-for="click in paginatedClicks" :key="click.id">
          <td class="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-neutral-900 dark:text-neutral-100">
            {{ formatDate(click.timestamp) }}
          </td>
          <td class="whitespace-nowrap px-3 py-3 text-sm text-neutral-700 dark:text-neutral-300">
            {{ formatUserAgent(click.userAgent) }}
          </td>
          <td class="whitespace-nowrap px-3 py-3 text-sm text-neutral-700 dark:text-neutral-300">
            {{ click.referrer || 'Direct' }}
          </td>
        </tr>
        <tr v-if="paginatedClicks.length === 0">
          <td colspan="3" class="px-3 py-4 text-sm text-neutral-500 dark:text-neutral-400 text-center">
            No click data available
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 sm:px-6">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-neutral-700 dark:text-neutral-300">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, props.clicks.length) }}</span>
            of
            <span class="font-medium">{{ props.clicks.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="goToPage(Math.max(1, currentPage - 1))"
              class="relative inline-flex items-center rounded-l-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-2 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
              :disabled="currentPage === 1"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              class="relative inline-flex items-center border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium"
              :class="[
                page === currentPage 
                  ? 'z-10 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
                  : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(Math.min(totalPages, currentPage + 1))"
              class="relative inline-flex items-center rounded-r-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-2 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
              :disabled="currentPage === totalPages"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>