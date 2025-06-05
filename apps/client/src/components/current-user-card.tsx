import { useAuth } from "~/hooks/use-auth";

import { UserCard, type UserCardProps } from "./user-card";

type CurrentUserCardProps = UserCardProps;

export default function CurrentUserCard(props: CurrentUserCardProps) {
  const { user } = useAuth();

  if (!user) return;

  return (
    <UserCard
      avatarProps={{
        src: user.avatarUrl ?? ""
      }}
      description={user.username}
      name={user.displayName}
      {...props}
    />
  );
}
