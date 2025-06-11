
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
  isSelected,
  isTimerActive, // Added prop
  canSelect, // Added prop
  ...props // Capture other button props like onClick
}) => {
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const getShapeColors = () => {
    // Always render revealed state
 if (isCorrect) return { fill: 'hsl(var(--success))', stroke: 'hsl(var(--success))', text: 'text-success-foreground' };
      if (isSelected && !isCorrect && isRevealed) return { fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--destructive))', text: 'text-destructive-foreground' };
      return { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--muted-foreground))', text: 'text-muted-foreground' }; // Revealed, unselected, incorrect
    // Removed the unrevealed color logic as answers are always visible
    // if (isSelected) return { fill: 'hsl(var(--card))', stroke: 'hsl(var(--accent))', text: 'text-accent-foreground' };
    return { fill: 'hsl(var(--card))', stroke: 'hsl(274 100% 35%)', text: 'text-foreground' };
  };

  const { fill, stroke, text: textColor } = getShapeColors();

  // Since answers are always visible, always treat as revealed for styling purposes
  // It should be disabled if generally disabled, eliminated by 50:50,
  // or if it's an unselected, incorrect option (prevents re-clicking wrong answers)
  // ALSO disabled if selection is NOT allowed (timer not active) unless it's the first click to reveal
    // Re-evaluate disabling based on the always visible state
    (!isCorrect && !isSelected && !isEliminatedByFiftyFifty) ||
    (!canSelect); // Disable selection clicks if canSelect is false

  const handleClick = () => {
    // Since answers are always revealed, the first click directly attempts selection
    if (canSelect) { // Only allow clicks if selection is enabled
      // If timer is active, the first click ONLY reveals.
      // If timer is NOT active, the first click reveals AND selects immediately.
      if (canSelect) { // Use canSelect here to determine if a click should trigger selection
        if (isTimerActive) {
        setClickCount(1); // Start the click count for confirmation
      } else {
        props.onClick(); // If no timer, fire the click event immediately
      }
      }
    } else if (canSelect && isTimerActive && clickCount === 1) { // Only handle second click if selection is allowed and timer is active
      setClickCount(0); // Reset click count FIRST to prevent rapid clicks firing multiple times
    } else if (isTimerActive && clickCount === 1) {
      props.onClick(); // Fire the click event on the second click during timer
      setClickCount(0); // Reset click count
    }
  };
  return (
    <button
      onClick={handleClick} // Use the modified handleClick
      disabled={buttonShouldBeDisabled}
      className={cn( // Removed isVisible check from here
        // Removed isEliminatedByFiftyFifty check
        // OR if it's a revealed, unselected, incorrect option and NOT eliminated by 50:50
        (isRevealed && !isCorrect && !isSelected) && "opacity-70", // Use isRevealed from state
        // Animations
        (isCorrect) && "animate-pulse-correct",
        (isSelected && !isCorrect) && "animate-pulse-incorrect"
      )}

      aria-label={`Option ${optionLetters[index]}: ${optionText}`}
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

      {/* Conditionally render content based on isRevealed */}
      {/* Always render content */}
      <div className={cn("relative z-10 flex items-center w-full h-full px-4 md:px-6", textColor)}>
        <div className="flex items-center mr-3 md:mr-4">
          <Diamond className="w-3 h-3 md:w-4 md:h-4 text-white fill-white mr-2" />
          <span className="font-bold text-sm md:text-base text-white">{optionLetters[index]}</span>
        </div>
        <span className="text-sm md:text-base text-left flex-1 truncate">{optionText}</span>
      </div>) : null}
    </button>
  );
};

export default AnswerButton;
