import React from 'react';
import { Sparkles } from 'lucide-react';

const GameLogo: React.FC<{ className?: string; size?: 'small' | 'large' }> = ({ className, size = 'large' }) => {
  const titleSize = size === 'large' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl';
  const subTextSize = size === 'large' ? 'text-sm' : 'text-xs';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <h1 className={`${titleSize} font-bold font-headline`}>
        <span className="text-primary">Team</span>
        <span className="text-accent"> Crorepati</span>
      </h1>
      <p className={`${subTextSize} text-muted-foreground flex items-center mt-1`}>
        <Sparkles className="w-4 h-4 mr-1 text-accent" />
        The Ultimate Trivia Challenge
      </p>
    </div>
  );
};

export default GameLogo;
