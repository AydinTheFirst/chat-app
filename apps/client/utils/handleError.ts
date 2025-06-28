import { isAxiosError } from "axios";
import { toast } from "sonner";

export const handleError = (error: unknown) => {
  let message = "An unexpected error occurred.";
  let desc = "";

  if (error instanceof Error) {
    message = error.message;
    desc = error.stack || "";
  }

  if (isAxiosError(error)) {
    if (!error.response) {
      message = "Network error. Please check your connection.";
    }

    if (error.response?.data) {
      const { errors, message: errorMessage } = error.response.data as {
        errors: string[];
        message: string;
      };

      if (errors && errors.length > 0) {
        message = errors.join(", ");
      } else if (errorMessage) {
        message = errorMessage;
      } else {
        message = "An error occurred while processing your request.";
      }
    }
  }

  toast.error(message, {
    description: desc
  });

  return {
    desc,
    message
  };
};
