<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUrlStore } from '../stores/urls';
import { useToastStore } from '../stores/toast';
import ShortenerForm from '../components/url/ShortenerForm.vue';
import LinkCard from '../components/url/LinkCard.vue';

const authStore = useAuthStore();
const urlStore = useUrlStore();
const toastStore = useToastStore();

const isLoading = ref(true);
const search = ref('');
const selectedTag = ref('');
const sortBy = ref('date');
const sortOrder = ref('desc');

const user = computed(() => authStore.user);
const userId = computed(() => user.value?.id || null);

// Get user URLs
const userUrls = computed(() => {
  if (!userId.value) return [];
  return urlStore.getUserUrls(userId.value);
});

// Filter and sort URLs
const filteredAndSortedUrls = computed(() => {
  let filtered = [...userUrls.value];
  
  // Filter by search term
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(url => 
      url.slug.toLowerCase().includes(searchLower) ||
      url.originalUrl.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(url => 
      url.tags.includes(selectedTag.value)
    );
  }
  
  // Sort
  return filtered.sort((a, b) => {
    if (sortBy.value === 'date') {
      const dateA = new Date(sortOrder.value === 'desc' ? a.createdAt : b.createdAt).getTime();
      const dateB = new Date(sortOrder.value === 'desc' ? b.createdAt : a.createdAt).getTime();
      return dateB - dateA;
    } else if (sortBy.value === 'clicks') {
      return sortOrder.value === 'desc' 
        ? b.clicks - a.clicks 
        : a.clicks - b.clicks;
    } else if (sortBy.value === 'alphabetical') {
      return sortOrder.value === 'desc'
        ? b.slug.localeCompare(a.slug)
        : a.slug.localeCompare(b.slug);
    }
    return 0;
  });
});

// Get unique tags from all user URLs
const availableTags = computed(() => {
  const tagSet = new Set<string>();
  
  userUrls.value.forEach(url => {
    url.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
});

// Statistics
const totalUrls = computed(() => userUrls.value.length);
const totalClicks = computed(() => 
  userUrls.value.reduce((sum, url) => sum + url.clicks, 0)
);
const averageClicksPerUrl = computed(() => 
  totalUrls.value ? (totalClicks.value / totalUrls.value).toFixed(1) : '0'
);

const handleUrlDeleted = (_: string) => {
  toastStore.addToast({
    type: 'success',
    message: 'URL deleted successfully',
    duration: 3000,
  });
};

const clearFilters = () => {
  search.value = '';
  selectedTag.value = '';
  sortBy.value = 'date';
  sortOrder.value = 'desc';
};

onMounted(async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  isLoading.value = false;
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
      <p class="mt-2 text-neutral-600 dark:text-neutral-400">
        Create and manage your shortened URLs
      </p>
    </div>
    
    <div class="mb-8">
      <ShortenerForm />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="card bg-white dark:bg-neutral-800 p-5">
        <h2 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">Total URLs</h2>
        <p class="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ totalUrls }}</p>
      </div>
      
      <div class="card bg-white dark:bg-neutral-800 p-5">
        <h2 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">Total Clicks</h2>
        <p class="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ totalClicks }}</p>
      </div>
      
      <div class="card bg-white dark:bg-neutral-800 p-5">
        <h2 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">Avg. Clicks per URL</h2>
        <p class="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ averageClicksPerUrl }}</p>
      </div>
    </div>
    
    <div class="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Search URLs or slugs"
              class="input pl-10"
            />
          </div>
        </div>
        
        <div class="w-full md:w-48">
          <label for="tag-filter" class="sr-only">Filter by tag</label>
          <select
            id="tag-filter"
            v-model="selectedTag"
            class="input"
          >
            <option value="">All tags</option>
            <option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>
        
        <div class="w-full md:w-48">
          <label for="sort-by" class="sr-only">Sort by</label>
          <select
            id="sort-by"
            v-model="sortBy"
            class="input"
            @change="sortOrder = 'desc'"
          >
            <option value="date">Sort by date</option>
            <option value="clicks">Sort by clicks</option>
            <option value="alphabetical">Sort alphabetically</option>
          </select>
        </div>
        
        <button
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          class="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700"
        >
          <span class="sr-only">Toggle sort order</span>
          <svg v-if="sortOrder === 'desc'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
          <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
        </button>
        
        <button
          v-if="search || selectedTag || sortBy !== 'date' || sortOrder !== 'desc'"
          @click="clearFilters"
          class="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          Clear filters
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-neutral-600 dark:text-neutral-400">Loading your URLs...</p>
    </div>
    
    <div v-else-if="userUrls.length === 0" class="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No URLs yet</h3>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Get started by creating your first shortened URL above.</p>
    </div>
    
    <div v-else class="space-y-4">
      <div v-if="filteredAndSortedUrls.length === 0" class="text-center py-8 bg-white dark:bg-neutral-800 rounded-lg shadow">
        <p class="text-neutral-600 dark:text-neutral-400">No URLs match your current filters</p>
        <button @click="clearFilters" class="mt-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          Clear filters
        </button>
      </div>
      
      <LinkCard 
        v-for="url in filteredAndSortedUrls" 
        :key="url.id" 
        :url="url"
        @deleted="handleUrlDeleted"
      />
    </div>
  </div>
</template>