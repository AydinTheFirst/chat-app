import { Link } from "react-router";

import { CDN_URL } from "~/config";

import type { User } from "dactoly.js";

import { UserComponent, type UserComponentProps } from "./user-component";
import UserStatus from "./user-status";

interface UserCardProps extends UserComponentProps {
  user: User;
}

export default function UserCard({ user, ...props }: UserCardProps) {
  const avatarSource = user.profile?.avatarUrl
    ? new URL(user.profile.avatarUrl, CDN_URL).toString()
    : undefined;

  return (
    <Link to={`/profile`}>
      <UserComponent
        avatarProps={{
          name: user.profile?.displayName,
          src: avatarSource
        }}
        description={<UserStatus userId={user.id} />}
        isFocusable
        name={user.profile?.displayName}
        {...props}
      />
    </Link>
  );
}
