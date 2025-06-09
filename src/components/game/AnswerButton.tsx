import React from 'react';
import { cn } from '@/lib/utils';
import { Diamond } from 'lucide-react';

interface AnswerButtonProps {
  optionText: string;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
  reveal?: boolean;
  index: number;
}

const optionLetters = ['A', 'B', 'C', 'D'];

const AnswerButton: React.FC<AnswerButtonProps> = ({
  optionText,
  onClick,
  disabled,
  isCorrect,
  isSelected,
  reveal,
  index,
}) => {
  const getShapeColors = () => {
    if (reveal) {
      if (isCorrect) return { fill: 'hsl(var(--success))', stroke: 'hsl(var(--success))', text: 'text-success-foreground' };
      if (isSelected && !isCorrect) return { fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--destructive))', text: 'text-destructive-foreground' };
      return { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--muted-foreground))', text: 'text-muted-foreground' };
    }
    if (isSelected) return { fill: 'hsl(var(--card))', stroke: 'hsl(var(--accent))', text: 'text-accent-foreground' }; // Gold/Accent for selected
    return { fill: 'hsl(var(--card))', stroke: 'hsl(274 100% 35%)', text: 'text-foreground' }; // Default KBC Purple border
  };

  const { fill, stroke, text: textColor } = getShapeColors();
  constisDisabledOrRevealed = disabled || (reveal && !(isSelected && !isCorrect) && !isCorrect);


  return (
    <button
      onClick={onClick}
      disabled={isDisabledOrRevealed}
      className={cn(
        "w-full h-[60px] md:h-[70px] relative group transition-opacity duration-300",
        isDisabledOrRevealed && !isCorrect && "opacity-50 cursor-not-allowed",
        (reveal && isCorrect) && "animate-pulse-correct",
        (reveal && isSelected && !isCorrect) && "animate-pulse-incorrect"
      )}
      aria-label={`Option ${optionLetters[index]}: ${optionText}`}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 300 50" // Adjusted viewBox
        preserveAspectRatio="none"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      >
        {/* Elongated hexagon path */}
        <path d="M 15 0 L 285 0 L 300 25 L 285 50 L 15 50 L 0 25 Z" />
      </svg>
      
      <div className={cn("relative z-10 flex items-center w-full h-full px-4 md:px-6", textColor)}>
        {/* Left Diamond and Letter */}
        <div className="flex items-center mr-3 md:mr-4">
          <Diamond className="w-3 h-3 md:w-4 md:h-4 text-white fill-white mr-2" />
          <span className="font-bold text-sm md:text-base text-white">{optionLetters[index]}</span>
        </div>
        <span className="text-sm md:text-base text-left flex-1 truncate">{optionText}</span>
      </div>
    </button>
  );
};

export default AnswerButton;
