import { Image, type ImageProps } from "@heroui/react";

import { CDN_URL } from "~/config";

export default function CdnImage({ src, ...rest }: ImageProps) {
  const imageSource = src && new URL(src, CDN_URL).toString();

  return (
    <Image
      src={imageSource}
      {...rest}
    />
  );
}
