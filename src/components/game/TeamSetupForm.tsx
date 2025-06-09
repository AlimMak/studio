import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Users } from 'lucide-react';

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
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Team Crorepati Challenge
        </CardTitle>
        <CardDescription className="text-muted-foreground">Create your teams to start the challenge!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {teamNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-grow">
                <Label htmlFor={`team-${index}`} className="text-sm font-medium">Team {index + 1} Name</Label>
                <Input
                  id={`team-${index}`}
                  type="text"
                  value={name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Enter Team ${index + 1} Name`}
                  required
                  className="mt-1"
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
            <Button type="button" variant="outline" onClick={addTeam} className="w-full flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Add Team
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
          Start Challenge!
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamSetupForm;
