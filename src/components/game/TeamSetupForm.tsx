import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
// Removed Users icon and CardTitle, CardDescription as GameLogo will replace them
// import GameLogo from './GameLogo'; // GameLogo is now passed from page.tsx or used there directly

interface TeamSetupFormProps {
  onStartGame: (teamNames: string[]) => void;
  maxTeams?: number;
}

const TeamSetupForm: React.FC<TeamSetupFormProps> = ({ onStartGame, maxTeams = 6 }) => {
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1']);

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const addTeam = () => {
    if (teamNames.length < maxTeams) {
      setTeamNames([...teamNames, `Team ${teamNames.length + 1}`]);
    }
  };

  const removeTeam = (index: number) => {
    if (teamNames.length > 1) {
      const newTeamNames = teamNames.filter((_, i) => i !== index);
      setTeamNames(newTeamNames);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTeamNames = teamNames.filter(name => name.trim() !== '');
    if (validTeamNames.length > 0) {
      onStartGame(validTeamNames);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl bg-gradient-to-br from-[#1a1440] via-[#2d1e5f] to-[#1a1440] rounded-[2rem]">
      <CardHeader className="text-center pt-6 pb-2">
        {/* GameLogo will be displayed above this form in page.tsx */}
        <p className="text-white">Create your teams to start the challenge!</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {teamNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-grow">
                <Label htmlFor={`team-${index}`} className="text-sm font-medium text-white">Team {index + 1} Name</Label>
                <Input
                  id={`team-${index}`}
                  type="text"
                  value={name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Enter Team ${index + 1} Name`}
                  required
                  className="mt-1 bg-[#221a4a] text-white placeholder:text-gray-400 border-[#2d1e5f] focus:border-yellow-400"
                />
              </div>
              {teamNames.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTeam(index)}
                  aria-label="Remove team"
                  className="mt-6 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
          {teamNames.length < maxTeams && (
            <Button type="button" variant="outline" onClick={addTeam} className="w-full flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20">
              <PlusCircle className="w-5 h-5" /> Add Team
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full text-lg py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow">
          Start Challenge!
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamSetupForm;
