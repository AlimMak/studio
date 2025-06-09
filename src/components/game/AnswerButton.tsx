import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const getButtonClass = () => {
    if (reveal) {
      if (isCorrect) return 'bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))] opacity-100 text-[hsl(var(--success-foreground))] animate-pulse-correct';
      if (isSelected && !isCorrect) return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-incorrect';
      return 'bg-muted hover:bg-muted/80 text-muted-foreground';
    }
    if (isSelected) return 'bg-primary/80 hover:bg-primary/70 text-primary-foreground ring-2 ring-accent';
    return 'bg-primary hover:bg-primary/90 text-primary-foreground';
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || reveal}
      className={cn(
        "w-full justify-start text-left h-auto py-3 px-4 whitespace-normal break-words transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-base md:text-lg",
        getButtonClass()
      )}
      variant="default"
    >
      <span className="font-bold mr-2 text-accent">{optionLetters[index]}:</span> {optionText}
    </Button>
  );
};

export default AnswerButton;
