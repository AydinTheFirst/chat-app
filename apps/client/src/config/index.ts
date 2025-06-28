const { VITE_API_URL } = import.meta.env;

export const API_URL: string = VITE_API_URL || "/api";

export const CDN_URL = "https://cdn.chat-app.aydinthefirst.com";

export function cdnSource(path: string): string {
  const url = new URL(path, CDN_URL);
  return url.toString();
}
