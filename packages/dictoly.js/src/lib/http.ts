// lib/http.ts

import axios from 'axios';

export function createInstance(token: string, baseURL?: string) {
  const instance = axios.create({
    baseURL: baseURL || 'https://api.dictoly.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
}
