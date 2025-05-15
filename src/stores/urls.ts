import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ShortUrl, ClickEvent } from "../types";
import { useToastStore } from "./toast";
import { generateId, generateSlug } from "../utils/helpers";

export const useUrlStore = defineStore("urls", () => {
  const toastStore = useToastStore();

  // State
  const urls = ref<ShortUrl[]>([]);
  const clickEvents = ref<ClickEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Initialize from localStorage
  try {
    const savedUrls = localStorage.getItem("shortUrls");
    const savedClicks = localStorage.getItem("clickEvents");

    if (savedUrls) {
      urls.value = JSON.parse(savedUrls);
    }

    if (savedClicks) {
      clickEvents.value = JSON.parse(savedClicks);
    }
  } catch (e) {
    console.error("Failed to parse saved data from localStorage", e);
  }

  // Private methods
  const saveToLocalStorage = () => {
    localStorage.setItem("shortUrls", JSON.stringify(urls.value));
    localStorage.setItem("clickEvents", JSON.stringify(clickEvents.value));
  };

  // Getters
  const getUrlById = (id: string) => {
    return urls.value.find((url) => url.id === id) || null;
  };

  const getUrlBySlug = (slug: string) => {
    return urls.value.find((url) => url.slug === slug) || null;
  };

  const getUserUrls = (userId: string | null) => {
    return urls.value.filter((url) => url.userId === userId);
  };

  const getClicksForUrl = (urlId: string) => {
    return clickEvents.value.filter((click) => click.urlId === urlId);
  };

  // Actions
  const createShortUrl = async (
    originalUrl: string,
    userId: string | null = null,
    customSlug: string | null = null,
    tags: string[] = []
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Validate URL
      try {
        new URL(originalUrl);
      } catch (e) {
        error.value = "Invalid URL format";
        toastStore.addToast({
          type: "error",
          message: "Invalid URL format",
          duration: 3000,
        });
        return null;
      }

      // Create slug (either custom or generated)
      let slug = customSlug?.trim() || generateSlug();

      // Check if slug already exists
      const slugExists = urls.value.some((url) => url.slug === slug);
      if (slugExists && customSlug) {
        error.value = "Custom slug already in use";
        toastStore.addToast({
          type: "error",
          message: "Custom slug already in use",
          duration: 3000,
        });
        return null;
      } else if (slugExists) {
        // Generate a new slug if the randomly generated one exists
        slug = generateSlug();
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Create new short URL
      const newUrl: ShortUrl = {
        id: generateId(),
        userId,
        originalUrl,
        shortUrl: `https://sho.rt/${slug}`,
        slug,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clicks: 0,
      };

      // Add to state
      urls.value.push(newUrl);

      // Save to localStorage
      saveToLocalStorage();

      toastStore.addToast({
        type: "success",
        message: "URL shortened successfully",
        duration: 3000,
      });

      return newUrl;
    } catch (e) {
      error.value = "Failed to create short URL";
      toastStore.addToast({
        type: "error",
        message: "Failed to create short URL",
        duration: 3000,
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateUrl = async (id: string, updates: Partial<ShortUrl>) => {
    loading.value = true;
    error.value = null;

    try {
      const index = urls.value.findIndex((url) => url.id === id);

      if (index === -1) {
        error.value = "URL not found";
        toastStore.addToast({
          type: "error",
          message: "URL not found",
          duration: 3000,
        });
        return false;
      }

      // Check if slug is being updated and if it already exists
      if (updates.slug && updates.slug !== urls.value[index].slug) {
        const slugExists = urls.value.some(
          (url) => url.slug === updates.slug && url.id !== id
        );

        if (slugExists) {
          error.value = "Custom slug already in use";
          toastStore.addToast({
            type: "error",
            message: "Custom slug already in use",
            duration: 3000,
          });
          return false;
        }

        // Update shortUrl if slug is changed
        updates.shortUrl = `https://sho.rt/${updates.slug}`;
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the URL
      urls.value[index] = {
        ...urls.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      saveToLocalStorage();

      toastStore.addToast({
        type: "success",
        message: "URL updated successfully",
        duration: 3000,
      });

      return true;
    } catch (e) {
      error.value = "Failed to update URL";
      toastStore.addToast({
        type: "error",
        message: "Failed to update URL",
        duration: 3000,
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteUrl = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const index = urls.value.findIndex((url) => url.id === id);

      if (index === -1) {
        error.value = "URL not found";
        toastStore.addToast({
          type: "error",
          message: "URL not found",
          duration: 3000,
        });
        return false;
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove URL
      urls.value.splice(index, 1);

      // Remove related click events
      clickEvents.value = clickEvents.value.filter(
        (click) => click.urlId !== id
      );

      // Save to localStorage
      saveToLocalStorage();

      toastStore.addToast({
        type: "success",
        message: "URL deleted successfully",
        duration: 3000,
      });

      return true;
    } catch (e) {
      error.value = "Failed to delete URL";
      toastStore.addToast({
        type: "error",
        message: "Failed to delete URL",
        duration: 3000,
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const recordClick = async (urlId: string, referrer: string | null = null) => {
    try {
      const urlIndex = urls.value.findIndex((url) => url.id === urlId);

      if (urlIndex === -1) {
        return false;
      }

      // Increment click count
      urls.value[urlIndex].clicks += 1;

      // Create click event
      const clickEvent: ClickEvent = {
        id: generateId(),
        urlId,
        timestamp: new Date().toISOString(),
        referrer,
        userAgent: navigator.userAgent || null,
        ip: null, // In a real app, this would come from the server
      };

      // Add to click events
      clickEvents.value.push(clickEvent);

      // Save to localStorage
      saveToLocalStorage();

      return true;
    } catch (e) {
      console.error("Failed to record click", e);
      return false;
    }
  };

  const exportClicksAsCsv = (urlId: string): string => {
    const url = getUrlById.value(urlId);
    if (!url) return "";

    const clicks = getClicksForUrl.value(urlId);

    // Create CSV header
    let csv = "ID,URL,Timestamp,Referrer,User Agent\n";

    // Add data rows
    clicks.forEach((click) => {
      csv += `${click.id},${url.shortUrl},${click.timestamp},${
        click.referrer || "N/A"
      },${click.userAgent || "N/A"}\n`;
    });

    return csv;
  };

  return {
    urls,
    clickEvents,
    loading,
    error,
    getUrlById,
    getUrlBySlug,
    getUserUrls,
    getClicksForUrl,
    createShortUrl,
    updateUrl,
    deleteUrl,
    recordClick,
    exportClicksAsCsv,
  };
});
