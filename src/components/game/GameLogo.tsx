
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

  // Please update these if you know the actual dimensions of don.png for better optimization
  const donIntrinsicWidth = 300; 
  const donIntrinsicHeight = 800;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>

      {/* Container for the fixed don.png image */}
      <div
        className="fixed left-0 top-[100px] bottom-0 z-0 print:hidden hidden md:block" // Hidden on small screens, visible on md and up
        style={{ width: '500px' }} 
      >
        <Image
          src={leftImageSrc}
          alt="Host figure background" 
          fill 
          style={{ objectFit: 'contain' }} 
          data-ai-hint="host portrait"
          sizes="500px" 
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
