"use client";

import { useState, useEffect } from "react";

interface ProfileImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ProfileImage({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/default-avatar.svg" 
}: ProfileImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  // Update imageSrc when src prop changes
  useEffect(() => {
    if (src) {
      setImageSrc(src);
      setHasError(false);
    } else {
      setImageSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}
