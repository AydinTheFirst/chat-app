// lib/http.ts

import axios from 'axios';

export function createInstance(token: string, baseURL?: string) {
  const instance = axios.create({
    baseURL: baseURL?.concat('/api') || 'https://api.dictoly.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
}
