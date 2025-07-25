/* eslint-disable @next/next/no-img-element */

import type { ImageProps } from "next/image";
import React from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | { src: string };
};

export default function Image({ src, alt, ...rest }: Props) {
  const imageSrc = typeof src === "string" ? src : (src as { src: string }).src;

  return <img src={imageSrc} alt={alt} {...rest} />;
}
