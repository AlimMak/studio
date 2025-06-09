import React from 'react';
import type { AudiencePollData } from '@/lib/types';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AudiencePollResultsProps {
  pollData: AudiencePollData[];
  options: string[];
}
const optionLetters = ['A', 'B', 'C', 'D'];

const AudiencePollResults: React.FC<AudiencePollResultsProps> = ({ pollData, options }) => {
  if (!pollData || pollData.length === 0) {
    return <p>No poll data available.</p>;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center justify-center gap-2">
          <BarChart3 className="w-7 h-7" /> Audience Poll Results
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

export default AudiencePollResults;
