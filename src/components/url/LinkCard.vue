<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import type { ShortUrl } from '../../types';
import { useUrlStore } from '../../stores/urls';
import { useModalStore } from '../../stores/modal';
import { useToastStore } from '../../stores/toast';
import { formatRelativeTime, copyToClipboard, truncateText } from '../../utils/helpers';
import EditUrlForm from './EditUrlForm.vue';

const props = defineProps<{
  url: ShortUrl;
}>();

const emit = defineEmits<{
  (e: 'deleted', id: string): void;
}>();

const router = useRouter();
const urlStore = useUrlStore();
const modalStore = useModalStore();
const toastStore = useToastStore();

const copied = ref(false);
const isDeleting = ref(false);

const formattedDate = computed(() => formatRelativeTime(props.url.createdAt));
const originalUrl = computed(() => truncateText(props.url.originalUrl, 40));

const copyShortUrl = async () => {
  const success = await copyToClipboard(props.url.shortUrl);
  
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

const viewAnalytics = () => {
  router.push(`/analytics/${props.url.id}`);
};

const editUrl = () => {
  modalStore.openModal({
    title: 'Edit URL',
    component: EditUrlForm,
    props: {
      url: props.url,
    },
  });
};

const confirmDelete = () => {
  modalStore.openModal({
    title: 'Delete URL',
    content: `Are you sure you want to delete this shortened URL? This action cannot be undone.`,
    component: {
      setup() {
        const handleConfirm = async () => {
          isDeleting.value = true;
          const success = await urlStore.deleteUrl(props.url.id);
          
          if (success) {
            emit('deleted', props.url.id);
          }
          
          modalStore.closeModal();
          isDeleting.value = false;
        };
        
        return () => h('div', { class: 'flex justify-end space-x-3 mt-4' }, [
          h('button', {
            onClick: () => modalStore.closeModal(),
            class: 'btn btn-outline'
          }, 'Cancel'),
          h('button', {
            onClick: handleConfirm,
            class: 'btn bg-error-600 hover:bg-error-700 text-white',
            disabled: isDeleting.value
          }, isDeleting.value ? 'Deleting...' : 'Delete')
        ]);
      }
    }
  });
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 shadow rounded-lg overflow-hidden transform transition-all duration-200 hover:shadow-md">
    <div class="p-4">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            {{ props.url.slug }}
          </h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            {{ originalUrl }}
          </p>
        </div>
        
        <div class="flex space-x-1">
          <button 
            @click="editUrl"
            class="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          
          <button 
            @click="confirmDelete"
            class="p-1.5 text-neutral-500 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-500 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
        <div class="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </div>
        
        <div class="flex items-center">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {{ props.url.clicks }} clicks
          </span>
        </div>
      </div>
      
      <div v-if="props.url.tags.length > 0" class="mt-2">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="tag in props.url.tags" 
            :key="tag"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="bg-neutral-50 dark:bg-neutral-700/50 p-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap md:flex-nowrap gap-2">
      <div class="flex items-center flex-1 min-w-0">
        <div class="truncate text-sm font-medium text-primary-600 dark:text-primary-400">
          {{ props.url.shortUrl }}
        </div>
        <button 
          @click="copyShortUrl" 
          class="ml-2 p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          :title="copied ? 'Copied!' : 'Copy to clipboard'"
        >
          <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
      </div>
      
      <button 
        @click="viewAnalytics"
        class="btn btn-primary py-1 px-3 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Analytics
      </button>
    </div>
  </div>
</template>