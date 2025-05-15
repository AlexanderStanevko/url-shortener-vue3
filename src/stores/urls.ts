import { defineStore } from "pinia";
import { ref } from "vue";
import type { ShortUrl, ClickEvent } from "../types";
import { useToastStore } from "./toast";
import { generateId, generateSlug } from "../utils/helpers";

export const useUrlStore = defineStore("urls", () => {
  const toastStore = useToastStore();

  const urls = ref<ShortUrl[]>([]);
  const clickEvents = ref<ClickEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

  const saveToLocalStorage = () => {
    localStorage.setItem("shortUrls", JSON.stringify(urls.value));
    localStorage.setItem("clickEvents", JSON.stringify(clickEvents.value));
  };

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

  const createShortUrl = async (
    originalUrl: string,
    userId: string | null = null,
    customSlug: string | null = null,
    tags: string[] = []
  ) => {
    loading.value = true;
    error.value = null;

    try {
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

      let slug = customSlug?.trim() || generateSlug();

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
        slug = generateSlug();
      }

      await new Promise((resolve) => setTimeout(resolve, 600));


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

      urls.value.push(newUrl);

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

        updates.shortUrl = `https://sho.rt/${updates.slug}`;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      urls.value[index] = {
        ...urls.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

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

      await new Promise((resolve) => setTimeout(resolve, 500));

      urls.value.splice(index, 1);

      clickEvents.value = clickEvents.value.filter(
        (click) => click.urlId !== id
      );

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

      urls.value[urlIndex].clicks += 1;

      const clickEvent: ClickEvent = {
        id: generateId(),
        urlId,
        timestamp: new Date().toISOString(),
        referrer,
        userAgent: navigator.userAgent || null,
        ip: null,
      };

      clickEvents.value.push(clickEvent);
      saveToLocalStorage();

      return true;
    } catch (e) {
      console.error("Failed to record click", e);
      return false;
    }
  };

  const exportClicksAsCsv = (urlId: string): string => {
    const url = getUrlById(urlId);
    if (!url) return "";

    const clicks = getClicksForUrl(urlId);

    let csv = "ID,URL,Timestamp,Referrer,User Agent\n";

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
