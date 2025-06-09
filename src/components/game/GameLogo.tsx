import React from 'react';
import Image from 'next/image';

interface GameLogoProps {
  className?: string;
  size?: 'small' | 'large';
}

const GameLogo: React.FC<GameLogoProps> = ({ className, size = 'large' }) => {
  const imageSize = size === 'large' ? { width: 250, height: 250 } : { width: 150, height: 150 };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Image
        src="/kbc-official-logo.png"
        alt="Kaun Banega Crorepati Logo"
        width={imageSize.width}
        height={imageSize.height}
        priority // Preload the logo as it's important
        data-ai-hint="game show logo"
      />
    </div>
  );
};

export default GameLogo;
