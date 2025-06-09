
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GameLogoProps {
  className?: string;
  size?: 'small' | 'large';
}

const GameLogo: React.FC<GameLogoProps> = ({
  className,
  size = 'large',
}) => {
  const mainImageSize = size === 'large' ? { width: 250, height: 250 } : { width: 150, height: 150 };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* KBC Logo */}
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
