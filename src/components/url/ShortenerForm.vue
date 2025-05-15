<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUrlStore } from '../../stores/urls';
import { useAuthStore } from '../../stores/auth';
import { useToastStore } from '../../stores/toast';
import { copyToClipboard } from '../../utils/helpers';

const urlStore = useUrlStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const url = ref('');
const customSlug = ref('');
const tags = ref('');
const shortUrl = ref('');
const isLoading = ref(false);
const copied = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userId = computed(() => authStore.user?.id || null);

const shortenUrl = async () => {
  if (!url.value) {
    toastStore.addToast({
      type: 'error',
      message: 'Please enter a URL',
      duration: 3000,
    });
    return;
  }
  
  isLoading.value = true;
  shortUrl.value = '';
  
  try {
    const tagArray = tags.value
      ? tags.value.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    
    const newUrl = await urlStore.createShortUrl(
      url.value,
      userId.value,
      customSlug.value || null,
      tagArray
    );
    
    if (newUrl) {
      shortUrl.value = newUrl.shortUrl;
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
  } finally {
    isLoading.value = false;
  }
};

const copyToClip = async () => {
  if (!shortUrl.value) return;
  
  const success = await copyToClipboard(shortUrl.value);
  
  if (success) {
    copied.value = true;
    toastStore.addToast({
      type: 'success',
      message: 'Copied to clipboard!',
      duration: 2000,
    });
    
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } else {
    toastStore.addToast({
      type: 'error',
      message: 'Failed to copy to clipboard',
      duration: 3000,
    });
  }
};

const resetForm = () => {
  url.value = '';
  customSlug.value = '';
  tags.value = '';
  shortUrl.value = '';
  copied.value = false;
};
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="card bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Shorten Your URL</h2>
      
      <div class="space-y-4">
        <!-- URL Input -->
        <div>
          <label for="url" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">URL to shorten</label>
          <input
            id="url"
            v-model="url"
            type="url"
            placeholder="https://example.com/very/long/url/to/shorten"
            class="input"
            :disabled="isLoading"
            @keyup.enter="shortenUrl"
          />
        </div>
        
        <!-- Custom options (visible only for authenticated users) -->
        <div v-if="isAuthenticated" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="customSlug" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Custom slug (optional)</label>
            <input
              id="customSlug"
              v-model="customSlug"
              type="text"
              placeholder="my-custom-slug"
              class="input"
              :disabled="isLoading"
            />
          </div>
          
          <div>
            <label for="tags" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tags (comma separated)</label>
            <input
              id="tags"
              v-model="tags"
              type="text"
              placeholder="work, project, social"
              class="input"
              :disabled="isLoading"
            />
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            @click="shortenUrl"
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Shortening...' : 'Shorten' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Result -->
      <div v-if="shortUrl" class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md">
        <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Your shortened URL:</div>
        <div class="flex items-center">
          <input
            type="text"
            readonly
            :value="shortUrl"
            class="input flex-1 mr-2 bg-white dark:bg-neutral-800"
          />
          <button
            @click="copyToClip"
            class="btn p-2 h-10"
            :class="copied ? 'btn-secondary' : 'btn-outline'"
          >
            <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
        </div>
        
        <div class="flex justify-end mt-2">
          <button @click="resetForm" class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
            Create another
          </button>
        </div>
      </div>
    </div>
  </div>
</template>