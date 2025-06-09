import { DactolyClient } from "dactoly.js";

import { API_URL } from "~/config";

const token = localStorage.getItem("token") ?? "";

const dactoly = new DactolyClient({
  baseUrl: API_URL,
  token
});

dactoly.http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { dactoly };
