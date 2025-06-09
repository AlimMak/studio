
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Users, XCircle } from 'lucide-react'; // Replaced MessageCircleQuestion with Users
import type { Team } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LifelineControlsProps {
  activeTeam: Team | null;
  onUseLifeline: (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam') => void;
  disabled?: boolean; // General disable for all lifelines (e.g. answer revealed)
}

const LifelineControls: React.FC<LifelineControlsProps> = ({ activeTeam, onUseLifeline, disabled }) => {
  if (!activeTeam) return null;

  const lifelineBaseClass = "rounded-full w-16 h-16 md:w-20 md:h-20 p-0 flex flex-col items-center justify-center shadow-lg border-2 transition-all duration-300 focus:ring-4 focus:ring-offset-2 focus:ring-offset-background";
  const activeLifelineClass = "bg-card hover:bg-primary/20 border-[hsl(274,100%,35%)] hover:border-accent text-foreground focus:ring-accent";
  const usedLifelineClass = "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed opacity-60";


  const renderLifelineButton = (
    type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam',
    icon: React.ReactNode,
    label: string | React.ReactNode
  ) => {
    const isLifelineUsed = !activeTeam.lifelines[type];
    return (
      <div className="flex flex-col items-center">
        <Button
            onClick={() => onUseLifeline(type)}
            disabled={isLifelineUsed || disabled}
            variant="outline"
            className={cn(
            lifelineBaseClass,
            isLifelineUsed || disabled ? usedLifelineClass : activeLifelineClass
            )}
            aria-label={`Use ${typeof label === 'string' && label.length > 0 ? label : type.replace(/([A-Z])/g, ' $1').trim()} Lifeline`}
        >
            {isLifelineUsed ? <XCircle className="w-8 h-8 md:w-10 md:h-10" /> : icon}
        </Button>
        {typeof label === 'string' && label.length > 0 && !isLifelineUsed && (
             <span className="mt-1 text-xs text-foreground">{label}</span>
        )}
         {isLifelineUsed && (
             <span className="mt-1 text-xs text-destructive">(Used)</span>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 p-4">
      <div className="flex justify-around items-center gap-3 md:gap-4">
        {renderLifelineButton(
          'fiftyFifty',
          <span className="font-bold text-lg md:text-xl">50:50</span>,
          "50:50" // Added label here
        )}
        {renderLifelineButton(
          'askYourTeam', 
          <Users className="w-7 h-7 md:w-8 md:h-8" />, 
          "Ask Team" 
        )}
        {renderLifelineButton(
          'phoneAFriend',
          <Phone className="w-7 h-7 md:w-8 md:h-8" />,
          "Phone"
        )}
      </div>
    </div>
  );
};

export default LifelineControls;
