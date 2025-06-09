
import React from 'react';
import type { TeamPollData } from '@/lib/types'; // Updated type
import { BarChart3, Users } from 'lucide-react'; // Added Users
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamPollResultsProps { // Renamed component and prop type
  pollData: TeamPollData[];
  options: string[];
}
const optionLetters = ['A', 'B', 'C', 'D'];

const TeamPollResults: React.FC<TeamPollResultsProps> = ({ pollData, options }) => { // Renamed component
  if (!pollData || pollData.length === 0) {
    return <p>No poll data available.</p>;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center justify-center gap-2">
          <Users className="w-7 h-7" /> Ask Your Team Results 
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pollData.map((item) => (
          <div key={item.optionIndex} className="space-y-1">
            <div className="flex justify-between items-center text-sm font-medium">
              <span>{optionLetters[item.optionIndex]}: {options[item.optionIndex]}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="w-full h-6 bg-muted rounded-full overflow-hidden border">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${item.percentage}%` }}
              >
                {item.percentage > 10 && <span className="text-xs font-bold text-accent-foreground">{item.percentage}%</span>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamPollResults; // Renamed export
