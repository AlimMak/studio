import React from 'react';
import { cn } from '@/lib/utils';
import { Diamond } from 'lucide-react';

interface AnswerButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  optionText: string;
  onClick: () => void;
  disabledForInteraction?: boolean; // For general game state disabling
  isCorrect?: boolean;
  index: number;
  isTimerActive: boolean; // Prop to indicate if the timer is active
  canSelect: boolean; // Prop to indicate if selection is enabled
}

const optionLetters = ['A', 'B', 'C', 'D'];

const AnswerButton: React.FC<AnswerButtonProps> = ({ 
  optionText,
  disabledForInteraction,
  isCorrect,
  index,
  isTimerActive, // Added prop
  canSelect, // Added prop
  ...props // Capture other button props like onClick
}) => {
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const getShapeColors = () => {
    if (isCorrect) return { fill: 'hsl(var(--success))', stroke: 'hsl(var(--success))', text: 'text-success-foreground' };
    return { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--muted-foreground))', text: 'text-muted-foreground' };
  };

  const { fill, stroke, text: textColor } = getShapeColors();

  // Compute disabled state
  const buttonShouldBeDisabled = disabledForInteraction || !canSelect;

  const handleClick = () => {
    if (canSelect) {
      if (isTimerActive) {
        setClickCount(1);
      } else {
        props.onClick();
      }
    } else if (canSelect && isTimerActive && clickCount === 1) {
      setClickCount(0);
    } else if (isTimerActive && clickCount === 1) {
      props.onClick();
      setClickCount(0);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={buttonShouldBeDisabled}
      className={cn(
        // Animations
        (isCorrect) && "animate-pulse-correct"
      )}
      aria-label={`Option ${optionLetters[index]}: ${optionText}`}
      {...props}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 300 50"
        preserveAspectRatio="none"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      >
        <path d="M 15 0 L 285 0 L 300 25 L 285 50 L 15 50 L 0 25 Z"/>
      </svg>
      <div className={cn("relative z-10 flex items-center w-full h-full px-4 md:px-6", textColor)}>
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
