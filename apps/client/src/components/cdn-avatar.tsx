import { Avatar, type AvatarProps } from "@heroui/react";

import { CDN_URL } from "~/config";

type CdnAvatarProps = AvatarProps;

export default function CdnAvatar({ src, ...props }: CdnAvatarProps) {
  const imageSource = src && new URL(src, CDN_URL).toString();

  return (
    <Avatar
      src={imageSource}
      {...props}
    />
  );
}
