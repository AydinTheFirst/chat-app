import { DactolyClient } from "dactoly.js";

import { API_URL } from "~/config";

const token = localStorage.getItem("token") ?? "";

const dactoly = new DactolyClient({
  baseUrl: API_URL,
  token
});

export { dactoly };
