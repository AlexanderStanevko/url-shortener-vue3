export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ShortUrl {
  id: string;
  userId: string | null;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  clicks: number;
}

export interface ClickEvent {
  id: string;
  urlId: string;
  timestamp: string;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number;
}

export interface Modal {
  id: string;
  title: string;
  content?: string;
  component?: any;
  props?: any;
}