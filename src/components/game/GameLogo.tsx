
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GameLogoProps {
  className?: string;
  size?: 'small' | 'large';
  leftImageSrc?: string;
}

const GameLogo: React.FC<GameLogoProps> = ({
  className,
  size = 'large',
  leftImageSrc = '/don.png', 
}) => {
  const mainImageSize = size === 'large' ? { width: 250, height: 250 } : { width: 150, height: 150 };

  // Define intrinsic dimensions of your don.png for next/image's aspect ratio & blur placeholder with fill
  // These are not directly passed as width/height to the Image with fill, but can be useful for reference or other contexts.
  // Please update these if you know the actual dimensions of don.png for better optimization
  const donIntrinsicWidth = 300;  // Replace with actual width of don.png
  const donIntrinsicHeight = 800; // Replace with actual height of don.png

  return (
    // This root div takes the className and centers the KBC logo.
    // don.png is now fixed and out of this div's direct layout flow.
    <div className={cn('relative flex items-center justify-center', className)}>

      {/* Container for the fixed don.png image */}
      <div
        className="fixed left-0 top-[100px] bottom-0 z-0 print:hidden" // Positioned left, 100px from top, full height, behind other content
        style={{ width: '250px' }} // Increased width from 150px to 250px
      >
        <Image
          src={leftImageSrc}
          alt="Host figure" 
          fill // Makes the image fill its parent div
          style={{ objectFit: 'contain' }} // 'contain' respects aspect ratio. Use 'cover' to fill and crop.
          data-ai-hint="host portrait"
          sizes="250px" // Updated sizes prop to match new width
          priority 
        />
      </div>

      {/* KBC Logo - ensure it's visible above the fixed image */}
      <div className="relative z-10">
        <Image
          src="/kbc-official-logo.png"
          alt="Kaun Banega Crorepati Logo"
          width={mainImageSize.width}
          height={mainImageSize.height}
          priority
          data-ai-hint="game show logo"
        />
      </div>
    </div>
  );
};

export default GameLogo;
