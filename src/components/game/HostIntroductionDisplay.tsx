
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, PlayCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HostIntroductionDisplayProps {
  onProceed: () => void;
}

const HostIntroductionDisplay: React.FC<HostIntroductionDisplayProps> = ({ onProceed }) => {
  const [hostRevealed, setHostRevealed] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card animate-fade-in">
      <CardHeader className="text-center pt-6 pb-4">
        <div className="flex justify-center items-center mb-4">
          <UserCircle className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">
          {hostRevealed ? "Meet Your Host!" : "Welcome to Kaun Banega Crorepati!"}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "space-y-4 text-card-foreground px-6 md:px-8 min-h-[200px]",
        !hostRevealed && "pb-2" // Reduce bottom padding when host is not revealed
      )}>
        {!hostRevealed ? (
          <>
            <p className="text-lg text-center">
              An electrifying game of wits and teamwork awaits!
            </p>
            <p className="text-center text-muted-foreground">
              Behind every great game is a great guide. Click below to meet yours.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center my-4 animate-fade-in">
              <Image
                src="/host.jpg"
                alt="Host Portrait"
                width={150}
                height={150}
                className="rounded-full border-4 border-accent shadow-lg"
                data-ai-hint="host portrait"
              />
            </div>
            <p className="text-xl text-center font-semibold text-accent animate-fade-in">
              Sharif Maredia!
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="p-6">
        {!hostRevealed ? (
          <Button
            onClick={() => setHostRevealed(true)}
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="mr-2 w-5 h-5" /> Reveal the Host
          </Button>
        ) : (
          <Button
            onClick={onProceed}
            className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground animate-fade-in"
          >
            <PlayCircle className="mr-2 w-5 h-5" /> Proceed to Team Setup
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HostIntroductionDisplay;
