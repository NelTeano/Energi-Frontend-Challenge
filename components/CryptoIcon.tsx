'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CryptoIconProps = {
  symbol: string; 
  size?: number;
};

export default function CryptoIcon({ symbol, size = 32 }: CryptoIconProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const iconPath = `/icons/${symbol.toUpperCase()}.svg`;
        // Simulating a check for image availability
        const response = await fetch(iconPath);
        
        if (response.ok) {
          setImgSrc(iconPath);
        } else {
          setImgSrc('/icons/default.svg'); // fallback image
        }
        } catch (error) {
          setImgSrc('/icons/default.svg'); // fallback image
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
