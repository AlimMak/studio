import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle } from 'lucide-react';

interface RulesDisplayProps {
  onProceed: () => void;
}

const RulesDisplay: React.FC<RulesDisplayProps> = ({ onProceed }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-gradient-to-br from-[#1a1440] via-[#2d1e5f] to-[#1a1440] animate-fade-in rounded-[2rem]">
      <CardHeader className="text-center pt-6 pb-4">
        <div className="flex justify-center items-center mb-4">
            <BookOpen className="w-12 h-12 text-yellow-400" />
        </div>
        <CardTitle className="text-3xl font-headline text-white">Game Rules</CardTitle>
        <CardDescription className="text-yellow-200">Read carefully before you begin the challenge!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-white px-6 md:px-8">
        <p className="text-lg">Welcome to the Team Crorepati Challenge!</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Each team will face a series of multiple-choice questions.
            <ul className="list-decimal list-inside space-y-1 pl-6 mt-1">
              <li>Only 1 answer is correct</li>
              <li>Questions will get progressively harder</li>
            </ul>
          </li>
          <li>Each team will have a representative or captain that will answer the question</li>
          <li>Each question has a monetary value and a time limit. The time limit increases as the monetary value increases.</li>
          <li>Answer correctly to earn the money and advance. An incorrect answer or running out of time means the team's turn ends for that question set.</li>
          <li>Teams have three lifelines:
            <ul className="list-decimal list-inside space-y-1 pl-6 mt-1">
                <li><strong className="text-yellow-400">50:50:</strong> Removes two incorrect answer choices.</li>
                <li><strong className="text-yellow-400">Expert Panel:</strong> A panel of experts give their opinion on the question and their answer choice.</li>
                <li><strong className="text-yellow-400">Audience Poll:</strong> The audience along with all teams will be asked to raise their hand for the answer they believe is correct. Once our team finalizes the poll we will give the team the results.  The team can then use that information to make their final decision.</li>
            </ul>
          </li>
          <li>Each lifeline can be used only once per team throughout the game.</li>
          <li>The team with the highest score at the end of all questions wins the challenge!</li>
          <li><strong className="text-yellow-400">NO HELP</strong> from the audience is allowed unless the audience poll is being used</li>
          <li><strong className="text-yellow-400">NO CELL PHONE USE WILL BE ALLOWED</strong></li>
        </ul>
        <p className="font-semibold text-center pt-2"><strong className="text-yellow-400">Good Luck to All Teams!</strong></p>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={onProceed} className="w-full text-lg py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow">
          <CheckCircle className="mr-2 w-5 h-5 text-black" /> Got It, Let's Play!
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RulesDisplay;
