import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, UsersRound, Scissors, HelpCircle } from 'lucide-react';
import type { Team } from '@/lib/types';

interface LifelineControlsProps {
  activeTeam: Team | null;
  onUseLifeline: (type: 'fiftyFifty' | 'phoneAFriend' | 'audiencePoll') => void;
  disabled?: boolean;
}

const LifelineControls: React.FC<LifelineControlsProps> = ({ activeTeam, onUseLifeline, disabled }) => {
  if (!activeTeam) return null;

  const lifelineButtonClass = "flex-1 min-w-[120px] md:min-w-[150px] py-6 text-sm md:text-base flex-col h-auto gap-1 shadow-md hover:shadow-lg transition-shadow";

  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-3 text-primary">Lifelines</h3>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => onUseLifeline('fiftyFifty')}
          disabled={!activeTeam.lifelines.fiftyFifty || disabled}
          variant="outline"
          className={lifelineButtonClass}
          aria-label="Use 50:50 Lifeline"
        >
          <Scissors className="w-6 h-6 mb-1 text-primary" />
          50:50
          {!activeTeam.lifelines.fiftyFifty && <span className="text-xs text-destructive">(Used)</span>}
        </Button>
        <Button
          onClick={() => onUseLifeline('phoneAFriend')}
          disabled={!activeTeam.lifelines.phoneAFriend || disabled}
          variant="outline"
          className={lifelineButtonClass}
          aria-label="Use Phone a Friend Lifeline"
        >
          <Smartphone className="w-6 h-6 mb-1 text-primary" />
          Phone a Friend
          {!activeTeam.lifelines.phoneAFriend && <span className="text-xs text-destructive">(Used)</span>}
        </Button>
        <Button
          onClick={() => onUseLifeline('audiencePoll')}
          disabled={!activeTeam.lifelines.audiencePoll || disabled}
          variant="outline"
          className={lifelineButtonClass}
          aria-label="Use Audience Poll Lifeline"
        >
          <UsersRound className="w-6 h-6 mb-1 text-primary" />
          Audience Poll
          {!activeTeam.lifelines.audiencePoll && <span className="text-xs text-destructive">(Used)</span>}
        </Button>
      </div>
    </div>
  );
};

export default LifelineControls;
