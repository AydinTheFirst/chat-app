import { Button, extendVariants } from "@heroui/react";

export const StyledButton = extendVariants(Button, {
  defaultVariants: {
    color: "default"
  },
  variants: {
    color: {
      default:
        "bg-black text-white hover:bg-gray-950 dark:bg-white dark:text-black dark:hover:bg-gray-200",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    }
  }
});
