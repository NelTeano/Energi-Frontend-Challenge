'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CryptoIconProps = {
  symbol: string; 
  size?: number;
};

export default function CryptoIcon({ symbol, size = 32 }: CryptoIconProps) {
  const [imgSrc, setImgSrc] = useState<string>('/icons/default.svg'); // Default fallback image
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (!symbol || symbol === "Default") {
        // If symbol is invalid, use the fallback image
        setImgSrc('/icons/default.svg');
        setLoading(false);
        return;
      }

      try {
        const iconPath = `/icons/${symbol.toUpperCase()}.svg`;
        const response = await fetch(iconPath);

        if (response.ok) {
          setImgSrc(iconPath);
        } else {
          setImgSrc('/icons/default.svg'); // Fallback image
        }
      } catch {
        setImgSrc('/icons/default.svg'); // Fallback image
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [symbol]); // Re-fetch image if symbol changes

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loader or placeholder
  }

  return (
    <Image
      src={imgSrc}
      alt={`${symbol.toUpperCase()} icon`}
      width={size}
      height={size}
    />
  );
}