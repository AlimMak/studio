import React from 'react';
import type { Team } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star } from 'lucide-react';

interface ScoreboardProps {
  teams: Team[];
  activeTeamId?: string | null;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teams, activeTeamId }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center text-primary flex items-center justify-center gap-2">
          <Award className="w-7 h-7" /> Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teams.length === 0 && <p className="text-center text-muted-foreground">No teams yet.</p>}
        {teams.map((team) => (
          <div
            key={team.id}
            className={`p-3 rounded-md border transition-all duration-300 ${
              team.id === activeTeamId ? 'bg-accent/30 border-accent shadow-md scale-105' : 'bg-card'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-medium text-lg ${team.id === activeTeamId ? 'text-accent-foreground font-bold' : 'text-foreground'}`}>
                {team.name}
              </span>
              <span className={`font-bold text-xl ${team.id === activeTeamId ? 'text-accent-foreground' : 'text-primary'}`}>
                ${team.score.toLocaleString()}
              </span>
            </div>
            {team.id === activeTeamId && (
              <div className="flex items-center justify-center mt-1 text-xs text-accent-foreground">
                <Star className="w-3 h-3 mr-1 fill-current" /> Active Team
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
