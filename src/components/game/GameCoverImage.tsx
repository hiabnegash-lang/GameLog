"use client";

import { useState } from "react";
import Image from "next/image";

interface GameCoverImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export function GameCoverImage({ src, alt, fill, className, sizes }: GameCoverImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-dark-hover">
        <span className="text-4xl">🎮</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setErrored(true)}
    />
  );
}
