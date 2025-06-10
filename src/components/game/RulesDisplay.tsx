
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle } from 'lucide-react';

interface RulesDisplayProps {
  onProceed: () => void;
}

const RulesDisplay: React.FC<RulesDisplayProps> = ({ onProceed }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card animate-fade-in">
      <CardHeader className="text-center pt-6 pb-4">
        <div className="flex justify-center items-center mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">Game Rules</CardTitle>
        <CardDescription className="text-muted-foreground">Read carefully before you begin the challenge!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-card-foreground px-6 md:px-8">
        <p className="text-lg">Welcome to the Team Crorepati Challenge!</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Each team will face a series of multiple-choice questions.</li>
          <li>Each question has a monetary value and a time limit. The time limit decreases as the money value increases.</li>
          <li>Answer correctly to earn the money and advance. An incorrect answer or running out of time means the team's turn ends for that question set.</li>
          <li>The game timer must be started manually by the host for each question by clicking the "Start Timer" button.</li>
          <li>Teams have three lifelines:
            <ul className="list-decimal list-inside space-y-1 pl-6 mt-1">
                <li><strong>50:50:</strong> Removes two incorrect answer choices.</li>
                <li><strong>Phone a Friend:</strong> Allows consulting an external party (simulated).</li>
                <li><strong>Ask Your Team:</strong> Allows the team to discuss the answer (simulated poll).</li>
            </ul>
          </li>
          <li>Each lifeline can be used only once per team throughout the game.</li>
          <li>The team with the highest score at the end of all questions wins the challenge!</li>
        </ul>
        <p className="font-semibold text-center pt-2">Good luck to all teams!</p>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={onProceed} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
          <CheckCircle className="mr-2 w-5 h-5" /> Got It, Let's Play!
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RulesDisplay;
