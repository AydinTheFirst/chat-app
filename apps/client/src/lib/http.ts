import axios from "axios";
import { toast } from "sonner";

import dactoly from "./dactoly";

const { api: http } = dactoly;

const handleError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    toast.error("An unexpected error occurred.");
    return;
  }

  if (!error.response) {
    toast.error("Network error. Please check your connection.");
    return;
  }

  const { errors, message } = error.response.data;
  const errros = Array.isArray(errors) ? errors : [errors];

  toast.error(message, {
    description: errros.join(", ")
  });
};

export { handleError, http };
