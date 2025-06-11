
import React from 'react';
import { cn } from '@/lib/utils';
import { Diamond } from 'lucide-react';

interface AnswerButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  optionText: string;
  onClick: () => void;
  disabledForInteraction?: boolean; // For general game state disabling
  isCorrect?: boolean;
  isSelected?: boolean;
  index: number;
  isEliminatedByFiftyFifty?: boolean; // Specifically if 50:50 removed this
  isVisible: boolean; // Added prop to control visibility of content
}

const optionLetters = ['A', 'B', 'C', 'D'];

const AnswerButton: React.FC<AnswerButtonProps> = ({ 
  optionText,
  disabledForInteraction,
  isCorrect,
  isSelected,
  index,
  isEliminatedByFiftyFifty,
  isVisible, // Moved before ...props
  ...props // Capture other button props like onClick
}) => {
  const [isRevealed, setIsRevealed] = React.useState(false);

  const getShapeColors = () => {
    if (isRevealed) {
 if (isCorrect) return { fill: 'hsl(var(--success))', stroke: 'hsl(var(--success))', text: 'text-success-foreground' };
      if (isSelected && !isCorrect) return { fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--destructive))', text: 'text-destructive-foreground' };
      return { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--muted-foreground))', text: 'text-muted-foreground' }; // Revealed, unselected, incorrect
    }
    if (isSelected) return { fill: 'hsl(var(--card))', stroke: 'hsl(var(--accent))', text: 'text-accent-foreground' };
    return { fill: 'hsl(var(--card))', stroke: 'hsl(274 100% 35%)', text: 'text-foreground' };
  };

  const { fill, stroke, text: textColor } = getShapeColors();

  // Use isRevealed instead of the prop
  const displayRevealedState = isRevealed || (isSelected && !isCorrect); 

  // Determine if the button should be functionally disabled for clicks
  const buttonShouldBeDisabled =
    disabledForInteraction || 
    isEliminatedByFiftyFifty ||
    (displayRevealedState && !isCorrect && !isSelected); // Disable unselected incorrect options after reveal

  return (
    <button
      onClick={() => setIsRevealed(true)} // Always reveal on click
      disabled={buttonShouldBeDisabled}
      className={cn(
        "w-full h-[60px] md:h-[70px] relative group transition-opacity duration-300",
        // Apply opacity ONLY if eliminated by 50:50
        isEliminatedByFiftyFifty && "opacity-50 cursor-not-allowed",
        // OR if it's a revealed, unselected, incorrect option (and not already blurred by 50:50)
        (displayRevealedState && !isCorrect && !isSelected && !isEliminatedByFiftyFifty) && "opacity-70",
        // Animations
        (displayRevealedState && isCorrect) && "animate-pulse-correct",
        (displayRevealedState && isSelected && !isCorrect) && "animate-pulse-incorrect"
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
        <path d="M 15 0 L 285 0 L 300 25 L 285 50 L 15 50 L 0 25 Z"/>
      </svg>
      
      {/* Conditionally render content based on isVisible */}
      {isVisible && (
        <div className={cn("relative z-10 flex items-center w-full h-full px-4 md:px-6", textColor)}>
          <div className="flex items-center mr-3 md:mr-4">
            <Diamond className="w-3 h-3 md:w-4 md:h-4 text-white fill-white mr-2" />
            <span className="font-bold text-sm md:text-base text-white">{optionLetters[index]}</span>
          </div>
          <span className="text-sm md:text-base text-left flex-1 truncate">{optionText}</span>
        </div>
      )}
    </button>
  );
};

export default AnswerButton;
