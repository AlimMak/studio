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
    <div className="bg-gradient-to-br from-[#1a1440] via-[#2d1e5f] to-[#1a1440] rounded-2xl shadow-2xl border border-[#2d1e5f] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Award className="w-7 h-7 text-yellow-400" />
        <span className="text-2xl font-headline text-yellow-400 font-bold">Scoreboard</span>
      </div>
      <div className="space-y-3">
        {teams.length === 0 && <p className="text-center text-muted-foreground">No teams yet.</p>}
        {teams.map((team) => (
          <div
            key={team.id}
            className={`p-3 rounded-md border border-[#2d1e5f] bg-[#221a4a] transition-all duration-300 ${
              team.id === activeTeamId ? 'bg-yellow-400/10 border-yellow-400 scale-105' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-medium text-lg font-headline ${team.id === activeTeamId ? 'text-yellow-400 font-bold' : 'text-white'}`}>{team.name}</span>
              <span className={`font-bold text-xl font-headline ${team.id === activeTeamId ? 'text-yellow-400' : 'text-green-400'}`}>${team.score.toLocaleString()}</span>
            </div>
            {team.id === activeTeamId && (
              <div className="flex items-center justify-center mt-1 text-xs text-yellow-400">
                <Star className="w-3 h-3 mr-1 fill-current" /> Active Team
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
