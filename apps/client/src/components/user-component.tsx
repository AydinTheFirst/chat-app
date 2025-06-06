import { extendVariants, User } from "@heroui/react";

export const UserComponent = extendVariants(User, {});

export type UserComponentProps = React.ComponentProps<typeof UserComponent>;
