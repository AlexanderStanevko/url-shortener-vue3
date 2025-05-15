<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUrlStore } from "../stores/urls";
import { useToastStore } from "../stores/toast";
import ClicksChart from "../components/analytics/ClicksChart.vue";
import ClickLogTable from "../components/analytics/ClickLogTable.vue";
import { downloadAsFile } from "../utils/helpers";

const router = useRouter();
const route = useRoute();
const urlStore = useUrlStore();
const toastStore = useToastStore();

const isLoading = ref(true);
const chartType = ref<"daily" | "hourly">("daily");
const isExporting = ref(false);

const urlId = computed(() => route.params.id as string);
const url = computed(() => urlStore.getUrlById(urlId.value));
const clicks = computed(() => urlStore.getClicksForUrl(urlId.value));

const exportAnalytics = async () => {
  if (!url.value) return;

  isExporting.value = true;

  try {
    // Generate CSV
    const csv = urlStore.exportClicksAsCsv(urlId.value);

    // Create filename
    const filename = `analytics_${url.value.slug}_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    // Download file
    downloadAsFile(csv, filename);

    toastStore.addToast({
      type: "success",
      message: "Analytics exported successfully",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error exporting analytics:", error);
    toastStore.addToast({
      type: "error",
      message: "Failed to export analytics",
      duration: 3000,
    });
  } finally {
    isExporting.value = false;
  }
};

const goBack = () => {
  router.push("/dashboard");
};

onMounted(async () => {
  isLoading.value = true;

  // In a real app, we would load data from the server here
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!url.value) {
    toastStore.addToast({
      type: "error",
      message: "URL not found",
      duration: 3000,
    });
    router.push("/dashboard");
    return;
  }

  isLoading.value = false;
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"
      ></div>
      <p class="mt-2 text-neutral-600 dark:text-neutral-400">
        Loading analytics data...
      </p>
    </div>

    <template v-else-if="url">
      <!-- Header with Back Button -->
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="mr-3 p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Analytics for {{ url.slug }}
          </h1>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm">
            {{ url.shortUrl }}
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card bg-white dark:bg-neutral-800 p-5">
          <h2
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase"
          >
            Total Clicks
          </h2>
          <p
            class="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            {{ url.clicks }}
          </p>
        </div>

        <div class="card bg-white dark:bg-neutral-800 p-5">
          <h2
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase"
          >
            Original URL
          </h2>
          <p
            class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate"
          >
            {{ url.originalUrl }}
          </p>
        </div>

        <div class="card bg-white dark:bg-neutral-800 p-5">
          <h2
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase"
          >
            Created On
          </h2>
          <p class="mt-2 text-neutral-900 dark:text-neutral-100">
            {{ new Date(url.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="card bg-white dark:bg-neutral-800 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2
            class="text-lg font-medium text-neutral-900 dark:text-neutral-100"
          >
            Click Activity
          </h2>

          <div class="flex items-center space-x-2">
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="chartType = 'daily'"
                class="px-3 py-1.5 text-sm font-medium rounded-l-md"
                :class="[
                  chartType === 'daily'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600',
                ]"
              >
                Daily
              </button>
              <button
                @click="chartType = 'hourly'"
                class="px-3 py-1.5 text-sm font-medium rounded-r-md"
                :class="[
                  chartType === 'hourly'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600',
                ]"
              >
                Hourly
              </button>
            </div>

            <button
              @click="exportAnalytics"
              class="btn btn-outline py-1.5 text-sm"
              :disabled="isExporting || clicks.length === 0"
            >
              <svg
                v-if="isExporting"
                class="animate-spin -ml-1 mr-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ isExporting ? "Exporting..." : "Export CSV" }}
            </button>
          </div>
        </div>

        <ClicksChart :clicks="clicks" :type="chartType" />
      </div>

      <!-- Click Log Table -->
      <div class="card bg-white dark:bg-neutral-800">
        <h2
          class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4"
        >
          Click Log
        </h2>

        <ClickLogTable :clicks="clicks" />
      </div>
    </template>
  </div>
</template>
