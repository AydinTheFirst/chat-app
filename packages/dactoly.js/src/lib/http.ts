// lib/http.ts

import axios from 'axios';

import { DactolyClientConfig } from '~/types';

export function createInstance({ baseUrl, token }: DactolyClientConfig) {
  const instance = axios.create({
    baseURL: baseUrl?.concat('/api') || 'https://api.dactoly.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
}
