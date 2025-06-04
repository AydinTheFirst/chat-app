import { extendVariants, Input } from "@heroui/react";

export const StyledInput = extendVariants(Input, {
  defaultVariants: {
    variant: "underlined"
  }
});

export type StyledInputProps = React.ComponentProps<typeof StyledInput>;
