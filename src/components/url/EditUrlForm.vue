<script setup lang="ts">
import { ref } from 'vue';
import type { ShortUrl } from '../../types';
import { useUrlStore } from '../../stores/urls';

const props = defineProps<{
  url: ShortUrl;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const urlStore = useUrlStore();

const slug = ref(props.url.slug);
const tags = ref(props.url.tags.join(', '));
const isLoading = ref(false);
const error = ref('');

const saveChanges = async () => {
  error.value = '';
  
  if (!slug.value.trim()) {
    error.value = 'Slug cannot be empty';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const tagsArray = tags.value
      ? tags.value.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    
    const success = await urlStore.updateUrl(props.url.id, {
      slug: slug.value.trim(),
      tags: tagsArray,
      shortUrl: `https://sho.rt/${slug.value.trim()}`,
    });
    
    if (success) {
      emit('close');
    }
  } catch (e) {
    console.error('Error updating URL:', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div v-if="error" class="mb-4 p-3 bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 rounded-md text-sm">
      {{ error }}
    </div>
    
    <div class="space-y-4">
      <div>
        <label for="slug" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Slug</label>
        <input
          id="slug"
          v-model="slug"
          type="text"
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
      
      <div class="pt-3 flex justify-end space-x-2">
        <button
          @click="emit('close')"
          class="btn btn-outline"
          :disabled="isLoading"
        >
          Cancel
        </button>
        
        <button
          @click="saveChanges"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>