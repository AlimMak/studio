import React from 'react';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  maxTime: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, maxTime }) => {
  const progressPercentage = maxTime > 0 ? (timeLeft / maxTime) * 100 : 0;
  let progressColorClass = 'bg-green-500';
  if (progressPercentage < 50) progressColorClass = 'bg-yellow-500';
  if (progressPercentage < 25) progressColorClass = 'bg-red-500';

  return (
    <div className="flex flex-col items-center my-4 p-3 rounded-lg shadow-inner bg-background/50">
      <div className="flex items-center text-primary mb-2">
        <Clock className="w-8 h-8 mr-2" />
        <span className="text-4xl font-bold tabular-nums">{timeLeft}s</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${progressColorClass}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
