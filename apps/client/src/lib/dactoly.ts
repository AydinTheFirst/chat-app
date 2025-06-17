import { Client } from "dactoly.js";

import { API_URL } from "~/config";

const dactoly = new Client({
  baseUrl: API_URL,
  token: localStorage.getItem("token") || ""
});

dactoly.api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

dactoly.api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const fetcher = (url: string) =>
  dactoly.api.get(url).then((res) => res.data);

export default dactoly;
