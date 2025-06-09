"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Team, Question, GamePhase, AudiencePollData } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { generateQuestionVariation } from '@/ai/flows/question-variation';

import TeamSetupForm from '@/components/game/TeamSetupForm';
import Scoreboard from '@/components/game/Scoreboard';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import TimerDisplay from '@/components/game/TimerDisplay';
import LifelineControls from '@/components/game/LifelineControls';
import AudiencePollResults from '@/components/game/AudiencePollResults';
import GameLogo from '@/components/game/GameLogo'; // Added
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PartyPopper } from 'lucide-react';

const MAX_TEAMS = 6;
const AI_VARIATION_CHANCE = 0.3; // 30% chance to vary a question

export default function CrorepatiChallengePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('SETUP');
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [fiftyFiftyOptions, setFiftyFiftyOptions] = useState<number[] | null>(null);

  const [showAudiencePoll, setShowAudiencePoll] = useState(false);
  const [audiencePollData, setAudiencePollData] = useState<AudiencePollData[] | null>(null);
  const [showPhoneAFriend, setShowPhoneAFriend] = useState(false);

  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const activeTeam = teams[activeTeamIndex];

  const loadQuestions = useCallback(async () => {
    const baseQuestions = getQuestions();
    const variedQuestions = await Promise.all(
      baseQuestions.map(async (q) => {
        if (Math.random() < AI_VARIATION_CHANCE) {
          try {
            const variation = await generateQuestionVariation({ question: q.text });
            return { ...q, text: variation.variedQuestion, originalText: q.text };
          } catch (error) {
            console.error("Failed to vary question:", error);
            return q; // Fallback to original if AI fails
          }
        }
        return q;
      })
    );
    setQuestions(variedQuestions);
  }, []);

  useEffect(() => {
    if (gamePhase === 'PLAYING') {
      loadQuestions();
    }
  }, [gamePhase, loadQuestions]);
  
  useEffect(() => {
    if (gamePhase === 'PLAYING' && currentQuestion && !timerActive && !answerRevealed) {
      setTimeLeft(currentQuestion.timeLimit);
      setTimerActive(true);
      setSelectedAnswer(null);
      setFiftyFiftyUsed(false);
      setFiftyFiftyOptions(null);
    }
  }, [gamePhase, currentQuestion, timerActive, answerRevealed]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      handleAnswerSelect(null); // Time's up, treat as incorrect or no answer
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);


  const handleStartGame = (teamNames: string[]) => {
    const newTeams: Team[] = teamNames.slice(0, MAX_TEAMS).map((name, index) => ({
      id: `team-${index + 1}`,
      name,
      score: 0,
      lifelines: { fiftyFifty: true, phoneAFriend: true, audiencePoll: true },
    }));
    setTeams(newTeams);
    setGamePhase('PLAYING');
    setCurrentQuestionIndex(0);
    setActiveTeamIndex(0);
    setAnswerRevealed(false);
  };

  const handleAnswerSelect = (optionIndex: number | null) => {
    if (answerRevealed || !timerActive) return;

    setTimerActive(false);
    setSelectedAnswer(optionIndex);
    setAnswerRevealed(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    
    setTimeout(() => {
      if (isCorrect) {
        toast({ title: "Correct!", description: `+ $${currentQuestion.moneyValue.toLocaleString()}`, variant: "default", duration: 2000 });
        setTeams(prevTeams => prevTeams.map(team => 
          team.id === activeTeam.id ? { ...team, score: team.score + currentQuestion.moneyValue } : team
        ));
      } else {
         toast({ title: "Incorrect!", description: "Better luck next time.", variant: "destructive", duration: 2000 });
      }
      
      setTimeout(() => {
        setAnswerRevealed(false);
        setSelectedAnswer(null);
        setFiftyFiftyUsed(false);
        setFiftyFiftyOptions(null);

        const nextTeamIndex = (activeTeamIndex + 1) % teams.length;
        setActiveTeamIndex(nextTeamIndex);

        if (nextTeamIndex === 0) {
          if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setGamePhase('GAME_OVER');
          }
        }
        setTimerActive(false); 
      }, 2000); 
    }, 1500);
  };

  const handleUseLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'audiencePoll') => {
    if (!activeTeam || disabledLifeline(type)) return;

    const newTeams = teams.map(t => {
      if (t.id === activeTeam.id) {
        return { ...t, lifelines: { ...t.lifelines, [type]: false } };
      }
      return t;
    });
    setTeams(newTeams);

    if (type === 'fiftyFifty') {
      setFiftyFiftyUsed(true);
      const correctAnswer = currentQuestion.correctAnswerIndex;
      const incorrectOptions = currentQuestion.options
        .map((_, i) => i)
        .filter(i => i !== correctAnswer);
      
      const optionsToHide: number[] = [];
      while(optionsToHide.length < 2 && incorrectOptions.length > optionsToHide.length) {
          const randomIncorrectIdx = Math.floor(Math.random() * incorrectOptions.length);
          const optionToHide = incorrectOptions[randomIncorrectIdx];
          if (!optionsToHide.includes(optionToHide)) {
              optionsToHide.push(optionToHide);
          }
      }
      setFiftyFiftyOptions(optionsToHide);
      toast({ title: "50:50 Used!", description: "Two incorrect options removed." });
    } else if (type === 'phoneAFriend') {
      setShowPhoneAFriend(true);
      toast({ title: "Phone a Friend Used!", description: "Consulting an expert..." });
    } else if (type === 'audiencePoll') {
      const pollResults: AudiencePollData[] = currentQuestion.options.map((_, index) => ({
        optionIndex: index,
        percentage: 0,
      }));
      let remainingPercentage = 100;
      pollResults[currentQuestion.correctAnswerIndex].percentage = Math.floor(Math.random() * 40) + 30; 
      remainingPercentage -= pollResults[currentQuestion.correctAnswerIndex].percentage;

      const otherOptionIndices = currentQuestion.options.map((_,i) => i).filter(i => i !== currentQuestion.correctAnswerIndex);
      otherOptionIndices.forEach((optIndex, arrIdx) => {
          if (arrIdx === otherOptionIndices.length -1) {
              pollResults[optIndex].percentage = remainingPercentage;
          } else {
              const randomShare = Math.floor(Math.random() * (remainingPercentage / (otherOptionIndices.length - arrIdx)));
              pollResults[optIndex].percentage = randomShare;
              remainingPercentage -= randomShare;
          }
      });
      
      if (remainingPercentage > 0 && pollResults.length > 0) {
          // find first non-correct answer and add remaining percentage
          const firstNonCorrect = pollResults.find(pr => pr.optionIndex !== currentQuestion.correctAnswerIndex);
          if(firstNonCorrect) firstNonCorrect.percentage += remainingPercentage;
          else pollResults[0].percentage += remainingPercentage; // fallback
      }

      setAudiencePollData(pollResults.sort((a,b) => b.percentage - a.percentage));
      setShowAudiencePoll(true);
      toast({ title: "Audience Poll Used!", description: "See what the audience thinks." });
    }
  };
  
  const disabledLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'audiencePoll'): boolean => {
      if(!activeTeam) return true;
      return !activeTeam.lifelines[type] || answerRevealed || !timerActive || (type === 'fiftyFifty' && fiftyFiftyUsed);
  }

  const getDisplayedOptionsIndices = () => {
    if (fiftyFiftyUsed && fiftyFiftyOptions) {
      return currentQuestion.options.map((_, i) => i).filter(i => !fiftyFiftyOptions.includes(i));
    }
    return currentQuestion.options.map((_, i) => i);
  };

  if (gamePhase === 'SETUP') {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <GameLogo className="mb-8" />
        <TeamSetupForm onStartGame={handleStartGame} maxTeams={MAX_TEAMS} />
      </main>
    );
  }

  if (gamePhase === 'GAME_OVER') {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center animate-fade-in">
        <GameLogo className="mb-6" />
        <PartyPopper className="w-24 h-24 text-accent mb-6 animate-bounce" />
        <h1 className="text-5xl font-bold font-headline mb-4 text-primary">Game Over!</h1>
        {sortedTeams.length > 0 && (
          <p className="text-3xl mb-8">
            🎉 Congratulations <span className="text-accent font-semibold">{sortedTeams[0].name}</span>! 🎉
          </p>
        )}
        <h2 className="text-2xl font-semibold mb-4">Final Scores:</h2>
        <Scoreboard teams={sortedTeams} />
        <Button onClick={() => {
          setGamePhase('SETUP'); 
          setTeams([]); 
          }} className="mt-8 text-lg py-3 px-6">
          Play Again
        </Button>
      </main>
    );
  }

  if (!currentQuestion || !activeTeam) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <GameLogo className="mb-8" />
        <p className="text-xl">Loading game...</p>
      </main>
    );
  }
  
  const displayedOptionIndices = getDisplayedOptionsIndices();

  return (
    <main className="flex-grow container mx-auto p-4 flex flex-col items-start justify-center animate-fade-in-slow">
      <header className="w-full mb-6">
        <GameLogo size="small" />
      </header>
      <div className="w-full flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 order-2 md:order-1">
          <Scoreboard teams={teams} activeTeamId={activeTeam.id} />
          <LifelineControls activeTeam={activeTeam} onUseLifeline={handleUseLifeline} disabled={answerRevealed || !timerActive} />
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 order-1 md:order-2 space-y-6">
          <TimerDisplay timeLeft={timeLeft} maxTime={currentQuestion.timeLimit} />
          <QuestionDisplay
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            revealAnswer={answerRevealed}
            disabledOptions={fiftyFiftyOptions || []} 
            isAnswerDisabled={answerRevealed || !timerActive}
          />
        </div>
      </div>

      <Dialog open={showAudiencePoll} onOpenChange={setShowAudiencePoll}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audience Poll</DialogTitle>
            <DialogDescription>
              The audience has voted. Here are the results:
            </DialogDescription>
          </DialogHeader>
          {audiencePollData && <AudiencePollResults pollData={audiencePollData} options={currentQuestion.options}/>}
          <DialogFooter>
            <Button onClick={() => setShowAudiencePoll(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPhoneAFriend} onOpenChange={setShowPhoneAFriend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phone a Friend</DialogTitle>
          </DialogHeader>
          <DialogDescription className="my-4 text-lg text-center">
            📞 Calling your friend... Ring ring... 📞
            <br/><br/>
            Your friend thinks the answer might be <strong className="text-accent">{currentQuestion.options[currentQuestion.correctAnswerIndex]}</strong>.
            <br/> (But remember, they're not always right!)
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowPhoneAFriend(false)}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
