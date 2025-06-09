
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GameLogoProps {
  className?: string;
  size?: 'small' | 'large';
  leftImageSrc?: string; // Prop for the new image on the left
}

const GameLogo: React.FC<GameLogoProps> = ({
  className,
  size = 'large',
  leftImageSrc = 'https://placehold.co/125x125.png', // Default placeholder for the left image
}) => {
  const mainImageSize = size === 'large' ? { width: 250, height: 250 } : { width: 150, height: 150 };
  // Adjust left image size relative to the main logo size
  const leftImageDimensions = size === 'large' ? { width: 125, height: 125 } : { width: 75, height: 75 };

  return (
    <div className={cn('flex flex-row items-center justify-center gap-4', className)}>
      <Image
        src={leftImageSrc}
        alt="Secondary Brand Logo"
        width={leftImageDimensions.width}
        height={leftImageDimensions.height}
        data-ai-hint="brand icon" // AI hint for the left image
      />
      <Image
        src="/kbc-official-logo.png" // Existing KBC logo
        alt="Kaun Banega Crorepati Logo"
        width={mainImageSize.width}
        height={mainImageSize.height}
        priority
        data-ai-hint="game show logo"
      />
    </div>
  );
};

export default GameLogo;
