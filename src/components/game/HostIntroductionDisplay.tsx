import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, PlayCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HostIntroductionDisplayProps {
  onProceed: () => void;
  onStopBackgroundMusic: () => void;
}

const HostIntroductionDisplay: React.FC<HostIntroductionDisplayProps> = ({ onProceed }) => {
  const [hostRevealed, setHostRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleRevealHost = () => {
    setHostRevealed(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Host reveal audio playback failed:", error);
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-gradient-to-br from-[#1a1440] via-[#2d1e5f] to-[#1a1440] animate-fade-in rounded-[2rem]">
      <CardHeader className="text-center pt-6 pb-4">
        <div className="flex justify-center items-center mb-4">
          <UserCircle className="w-16 h-16 text-yellow-400" />
        </div>
        <CardTitle className="text-3xl font-headline text-white">
          {hostRevealed ? "Meet Your Host!" : "Welcome to Kaun Banega Crorepati!"}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "space-y-4 text-white px-6 md:px-8 min-h-[100px]",
        !hostRevealed && "pb-2" // Reduce bottom padding when host is not revealed
      )}>
        {!hostRevealed ? (
          <>
            <p className="text-lg text-center">
              An electrifying game of wits and teamwork awaits!
            </p>
            <p className="text-center text-yellow-200">
              Behind every great game is a great guide. Are you ready to meet yours?
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center my-4 animate-fade-in">
              <Image
                src="/host.jpg"
                alt="Host Portrait"
                width={300}
                height={300}
                className="rounded-lg border-4 border-yellow-400 shadow-lg"
                data-ai-hint="host portrait"
              />
            </div>
            <p className="text-xl text-center font-semibold text-yellow-400 animate-fade-in">
              Sharif Maredia
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="p-6">
        {!hostRevealed ? (
          <Button
            onClick={handleRevealHost}
            className="w-full text-lg py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow"
          >
            <Sparkles className="mr-2 w-5 h-5" /> Reveal the Host
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Rewind for next time if needed
              }
              onProceed();
            }}
            className="w-full text-lg py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow animate-fade-in"
          >
            <PlayCircle className="mr-2 w-5 h-5" /> Proceed to Team Setup
          </Button>
        )}
      </CardFooter>
      <audio ref={audioRef} src="/audio/host_reveal.mp3" preload="auto" />
    </Card>
  );
};

export default HostIntroductionDisplay;
