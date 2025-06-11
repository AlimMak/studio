
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, PlayCircle } from 'lucide-react';

interface HostIntroductionDisplayProps {
  onProceed: () => void;
}

const HostIntroductionDisplay: React.FC<HostIntroductionDisplayProps> = ({ onProceed }) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card animate-fade-in">
      <CardHeader className="text-center pt-6 pb-4">
        <div className="flex justify-center items-center mb-4">
          <UserCircle className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">Meet Your Host!</CardTitle>
        <CardDescription className="text-muted-foreground">Get ready for an exciting challenge!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-card-foreground px-6 md:px-8">
        <div className="flex justify-center my-4">
          <Image
            src="https://placehold.co/300x300.png"
            alt="Host Portrait"
            width={200}
            height={200}
            className="rounded-full border-4 border-accent shadow-lg"
            data-ai-hint="host portrait"
          />
        </div>
        <p className="text-lg text-center">
          Welcome, everyone, to the Team Crorepati Challenge!
        </p>
        <p className="text-center text-muted-foreground">
          I'm your host, and I'm thrilled to guide you through this electrifying game of wits and teamwork.
          Prepare for challenging questions, exciting lifelines, and a chance to win big!
        </p>
        <p className="font-semibold text-center pt-2">
          Are you ready to begin?
        </p>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={onProceed} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlayCircle className="mr-2 w-5 h-5" /> Proceed to Team Setup
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HostIntroductionDisplay;
