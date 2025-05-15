<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect, computed } from "vue";

const props = defineProps<{
  title: string;
  content?: string;
  component?: any;
  props?: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const modal = ref<HTMLElement | null>(null);

const componentProps = computed(() => props.props || {});

const close = () => {
  emit("close");
};

// Close modal when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (modal.value && !modal.value.contains(event.target as Node)) {
    close();
  }
};

// Close modal when pressing Escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    close();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  // Prevent scrolling of background content
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);

  // Restore scrolling
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div
          class="absolute inset-0 bg-neutral-900 opacity-75 dark:opacity-90"
        ></div>
      </div>

      <!-- Modal -->
      <div
        ref="modal"
        class="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <!-- Header -->
        <div
          class="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center"
        >
          <h3
            class="text-lg font-medium text-neutral-900 dark:text-neutral-100"
            id="modal-headline"
          >
            {{ title }}
          </h3>
          <button
            @click="close"
            class="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-4 py-3">
          <p v-if="content" class="text-neutral-700 dark:text-neutral-300">
            {{ content }}
          </p>
          <component
            v-if="component"
            :is="component"
            v-bind="componentProps"
            @close="close"
          />

          <!-- <component
            v-if="component"
            :is="component"
            v-bind="props"
            @close="close"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add transition styles */
</style>
