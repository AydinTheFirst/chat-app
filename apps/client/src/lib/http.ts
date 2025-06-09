import axios from "axios";
import { toast } from "sonner";

import { dactoly } from "./dactoly";

const { http } = dactoly;

const handleError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return toast.error("An unexpected error occurred");
  }

  if (!error.response) {
    return toast.error("Could not connect to the server");
  }

  if (error.response.status === 401) {
    return toast.error("Unauthorized");
  }

  interface ErrorResponse {
    errors?: string[];
    message: string;
  }

  const { errors, message } = error.response.data as ErrorResponse;

  return toast.error(message, {
    description: errors ? errors.join(", ") : undefined
  });
};

const fetcher = (url: string) => http.get(url).then((res) => res.data);

const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await http.post<string[]>("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

const saveToken = (token: string) => {
  localStorage.setItem("token", token);
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export { fetcher, handleError, http, saveToken, uploadFiles };
