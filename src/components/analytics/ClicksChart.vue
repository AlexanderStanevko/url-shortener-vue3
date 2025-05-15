<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, TimeScale } from 'chart.js';
import { Line, Bar } from 'vue-chartjs';
import type { ClickEvent } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

const props = defineProps<{
  clicks: ClickEvent[];
  type?: 'daily' | 'hourly';
}>();

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Clicks',
      backgroundColor: 'rgba(80, 97, 252, 0.2)',
      borderColor: 'rgba(80, 97, 252, 1)',
      borderWidth: 2,
      borderRadius: 4,
      data: [],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        drawBorder: false,
      },
      ticks: {
        precision: 0,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
});

const processClickData = () => {
  const clicks = props.clicks;
  const clicksByPeriod = new Map();
  
  if (props.type === 'hourly') {
    // Group by hour
    clicks.forEach(click => {
      const date = new Date(click.timestamp);
      const hour = date.getHours();
      const hourLabel = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      
      if (!clicksByPeriod.has(hourLabel)) {
        clicksByPeriod.set(hourLabel, 0);
      }
      
      clicksByPeriod.set(hourLabel, clicksByPeriod.get(hourLabel) + 1);
    });
    
    // Generate all hours for complete data
    const allHours = Array.from({ length: 24 }, (_, i) => {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      return { label: hour, count: clicksByPeriod.get(hour) || 0 };
    });
    
    // Sort by hour
    allHours.sort((a, b) => {
      return parseInt(a.label) - parseInt(b.label);
    });
    
    chartData.value.labels = allHours.map(hour => hour.label);
    chartData.value.datasets[0].data = allHours.map(hour => hour.count);
  } else {
    // Group by day (default)
    clicks.forEach(click => {
      const date = new Date(click.timestamp);
      const day = date.toISOString().split('T')[0];
      
      if (!clicksByPeriod.has(day)) {
        clicksByPeriod.set(day, 0);
      }
      
      clicksByPeriod.set(day, clicksByPeriod.get(day) + 1);
    });
    
    // Sort by date
    const sortedDays = Array.from(clicksByPeriod.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    
    // Format dates for display
    chartData.value.labels = sortedDays.map(([day]) => {
      const date = new Date(day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    chartData.value.datasets[0].data = sortedDays.map(([_, count]) => count);
  }
};

// Process data when component mounts or when props change
watch(() => [props.clicks, props.type], () => {
  processClickData();
}, { immediate: true });

onMounted(() => {
  processClickData();
});
</script>

<template>
  <div class="h-64">
    <Bar v-if="props.clicks.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400">
      No click data available
    </div>
  </div>
</template>