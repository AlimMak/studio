
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Team, Question, GamePhase, TeamPollData } from '@/lib/types'; // Updated to TeamPollData
import { getQuestions } from '@/lib/questions';
import { generateQuestionVariation } from '@/ai/flows/question-variation';

import TeamSetupForm from '@/components/game/TeamSetupForm';
import Scoreboard from '@/components/game/Scoreboard';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import AnswerButton from '@/components/game/AnswerButton';
import TimerDisplay from '@/components/game/TimerDisplay';
import LifelineControls from '@/components/game/LifelineControls';
import TeamPollResults from '@/components/game/TeamPollResults'; // Renamed import
import GameLogo from '@/components/game/GameLogo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PartyPopper, ChevronRight } from 'lucide-react';

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
  const [fiftyFiftyUsedThisTurn, setFiftyFiftyUsedThisTurn] = useState(false);
  const [fiftyFiftyOptions, setFiftyFiftyOptions] = useState<number[] | null>(null);

  const [showTeamPoll, setShowTeamPoll] = useState(false); // Renamed from showAudiencePoll
  const [teamPollData, setTeamPollData] = useState<TeamPollData[] | null>(null); // Renamed from audiencePollData
  const [showPhoneAFriend, setShowPhoneAFriend] = useState(false);

  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const activeTeam = teams[activeTeamIndex];

  const timerTickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const handleStartGame = useCallback((teamNames: string[]) => {
    const newTeams: Team[] = teamNames.map((name, index) => ({
      id: `team-${index + 1}-${Date.now()}`,
      name: name.trim(),
      score: 0,
      lifelines: { fiftyFifty: true, phoneAFriend: true, askYourTeam: true }, // Renamed lifeline
    }));
    setTeams(newTeams);
    setCurrentQuestionIndex(0);
    setActiveTeamIndex(0);
    setGamePhase('PLAYING');
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setFiftyFiftyUsedThisTurn(false);
    setFiftyFiftyOptions(null);
    setShowTeamPoll(false); // Renamed
    setTeamPollData(null); // Renamed
    setShowPhoneAFriend(false);
  }, [
    setTeams, 
    setCurrentQuestionIndex, 
    setActiveTeamIndex, 
    setGamePhase,
    setAnswerRevealed,
    setSelectedAnswer,
    setFiftyFiftyUsedThisTurn,
    setFiftyFiftyOptions,
    setShowTeamPoll, // Renamed
    setTeamPollData, // Renamed
    setShowPhoneAFriend
  ]);

  useEffect(() => {
    const audio = new Audio('/sounds/timer-tick.mp3');
    audio.preload = 'auto';
    audio.loop = true; 
  
    const onCanPlayThrough = () => {
      if (audio) {
        timerTickAudioRef.current = audio;
        setIsAudioInitialized(true);
      }
    };
    
    const onError = (e: Event) => {
      console.error("Audio loading error:", e);
    };
  
    audio.addEventListener('canplaythrough', onCanPlayThrough);
    audio.addEventListener('error', onError);
    audio.load(); 
  
    return () => {
      if (timerTickAudioRef.current) {
        timerTickAudioRef.current.pause();
        timerTickAudioRef.current.currentTime = 0; 
      }
      timerTickAudioRef.current = null; 
      setIsAudioInitialized(false); 
      audio.removeEventListener('canplaythrough', onCanPlayThrough);
      audio.removeEventListener('error', onError);
    };
  }, []);

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
            return q; 
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
    if (gamePhase === 'PLAYING' && currentQuestion && teams.length > 0 && !answerRevealed) { 
      setTimeLeft(currentQuestion.timeLimit);
      setSelectedAnswer(null);
      setAnswerRevealed(false); 
      setFiftyFiftyUsedThisTurn(false);
      setFiftyFiftyOptions(null);
      setShowTeamPoll(false); // Renamed
      setShowPhoneAFriend(false);
      setTimerActive(true); 

      if (isAudioInitialized && timerTickAudioRef.current) {
        timerTickAudioRef.current.currentTime = 0; 
        timerTickAudioRef.current.play().catch(error => console.error("Error playing timer sound:", error));
      }
    } else if (gamePhase !== 'PLAYING' && gamePhase !== 'SETUP' ) { 
        setTimerActive(false);
        if (isAudioInitialized && timerTickAudioRef.current) {
            timerTickAudioRef.current.pause();
            timerTickAudioRef.current.currentTime = 0;
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, currentQuestion, activeTeamIndex, isAudioInitialized, teams.length, answerRevealed]);


  const handleAnswerSelect = useCallback((optionIndex: number | null) => {
    if (answerRevealed || !timerActive || optionIndex === null) return;

    setTimerActive(false); 
    if (isAudioInitialized && timerTickAudioRef.current) {
      timerTickAudioRef.current.pause();
      timerTickAudioRef.current.currentTime = 0;
    }

    setSelectedAnswer(optionIndex);
    setAnswerRevealed(true);

    const isCorrect = currentQuestion && optionIndex === currentQuestion.correctAnswerIndex;
    
    setTimeout(() => {
      if (isCorrect) {
        toast({ title: "Correct!", description: `+ $${currentQuestion?.moneyValue?.toLocaleString() || 0}`, variant: "default", duration: 2000 });
        setTeams(prevTeams => prevTeams.map(team => 
          team.id === activeTeam?.id ? { ...team, score: team.score + (currentQuestion?.moneyValue || 0) } : team
        ));
      } else {
         toast({ title: "Incorrect!", description: "Better luck next time.", variant: "destructive", duration: 2000 });
      }
    }, 1500);
  }, [
    answerRevealed, 
    timerActive, 
    currentQuestion, 
    activeTeam, 
    toast, 
    isAudioInitialized,
  ]);
  
  const proceedToNextTurnOrQuestion = useCallback(() => {
    if (!answerRevealed || gamePhase !== 'PLAYING') return;

    const nextTeamIndex = (activeTeamIndex + 1) % teams.length;
    setActiveTeamIndex(nextTeamIndex);

    if (nextTeamIndex === 0) { 
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGamePhase('GAME_OVER');
         if (isAudioInitialized && timerTickAudioRef.current) {
            timerTickAudioRef.current.pause();
            timerTickAudioRef.current.currentTime = 0;
        }
      }
    }
    setAnswerRevealed(false); 

  }, [answerRevealed, gamePhase, activeTeamIndex, teams, currentQuestionIndex, questions.length, setGamePhase, setActiveTeamIndex, setCurrentQuestionIndex, isAudioInitialized]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
  
    if (timerActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); 
      }, 1000);
    } else if (timerActive && timeLeft === 0) { 
      handleAnswerSelect(null);
    }
  
    return () => {
      clearInterval(intervalId); 
    };
  }, [timerActive, timeLeft, handleAnswerSelect]); 


  const handleUseLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam') => { // Updated type
    if (!activeTeam || !currentQuestion || disabledLifeline(type)) return;

    const newTeams = teams.map(t => {
      if (t.id === activeTeam.id) {
        return { ...t, lifelines: { ...t.lifelines, [type]: false } };
      }
      return t;
    });
    setTeams(newTeams);

    if (type === 'fiftyFifty') {
      setFiftyFiftyUsedThisTurn(true);
      const correctAnswer = currentQuestion.correctAnswerIndex;
      const incorrectOptions = currentQuestion.options
        .map((_, i) => i)
        .filter(i => i !== correctAnswer);
      
      const optionsToHide: number[] = [];
      const numToHide = Math.min(2, incorrectOptions.length); 
      while(optionsToHide.length < numToHide && incorrectOptions.length > 0) { 
          const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
          const optionToHide = incorrectOptions.splice(randomIndex, 1)[0]; 
          optionsToHide.push(optionToHide);
      }
      setFiftyFiftyOptions(optionsToHide);
      toast({ title: "50:50 Used!", description: "Two incorrect options removed." });
    } else if (type === 'phoneAFriend') {
      setShowPhoneAFriend(true);
      toast({ title: "Phone a Friend Used!", description: "Consulting an expert..." });
    } else if (type === 'askYourTeam') { // Renamed from audiencePoll
      const pollResults: TeamPollData[] = currentQuestion.options.map((_, index) => ({ // Updated type
        optionIndex: index,
        percentage: 0,
      }));
      let remainingPercentage = 100;
      
      if (currentQuestion.options.length > 0) { 
        pollResults[currentQuestion.correctAnswerIndex].percentage = Math.floor(Math.random() * 41) + 30; 
        remainingPercentage -= pollResults[currentQuestion.correctAnswerIndex].percentage;

        const otherOptionIndices = currentQuestion.options.map((_,i) => i).filter(i => i !== currentQuestion.correctAnswerIndex);
        otherOptionIndices.forEach((optIndex, arrIdx) => {
            if (arrIdx === otherOptionIndices.length -1) { 
                pollResults[optIndex].percentage = remainingPercentage;
            } else {
                const randomShare = Math.floor(Math.random() * (remainingPercentage / (otherOptionIndices.length - arrIdx || 1))); 
                pollResults[optIndex].percentage = randomShare;
                remainingPercentage -= randomShare;
            }
        });
        
        let currentSum = pollResults.reduce((sum, item) => sum + item.percentage, 0);
        if (currentSum !== 100 && pollResults.length > 0) {
            const diff = 100 - currentSum;
            const targetIdx = pollResults.findIndex(p => p.optionIndex !== currentQuestion.correctAnswerIndex && p.percentage + diff >= 0); 
            if (targetIdx !== -1) {
              pollResults[targetIdx].percentage += diff;
            } else { 
              const fallbackIdx = pollResults.findIndex(p => p.percentage + diff >=0);
              if (fallbackIdx !== -1) pollResults[fallbackIdx].percentage += diff;
              else if (pollResults.length > 0) pollResults[0].percentage += diff; 
            }
        }
      }

      setTeamPollData(pollResults.sort((a,b) => b.percentage - a.percentage)); // Renamed
      setShowTeamPoll(true); // Renamed
      toast({ title: "Ask Your Team Used!", description: "See what your team thinks." }); // Updated toast
    }
  };
  
  const disabledLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam'): boolean => { // Updated type
      if(!activeTeam) return true;
      return !activeTeam.lifelines[type] || answerRevealed || !timerActive || (type === 'fiftyFifty' && fiftyFiftyUsedThisTurn);
  }

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
          setCurrentQuestionIndex(0);
          setActiveTeamIndex(0);
          setAnswerRevealed(false);
          setSelectedAnswer(null);
          setFiftyFiftyUsedThisTurn(false);
          setFiftyFiftyOptions(null);
          setShowTeamPoll(false); // Renamed
          setTeamPollData(null); // Renamed
          setShowPhoneAFriend(false);
          if (isAudioInitialized && timerTickAudioRef.current) {
            timerTickAudioRef.current.pause();
            timerTickAudioRef.current.currentTime = 0;
          }
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
  
  return (
    <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center animate-fade-in-slow">
      <header className="w-full mb-2 md:mb-4">
        <GameLogo size="small" />
      </header>
      
      <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
        <div className="w-full mb-2 md:mb-4">
         {currentQuestion && <TimerDisplay timeLeft={timeLeft} maxTime={currentQuestion.timeLimit} /> }
        </div>

        <div className="w-full mb-4 md:mb-6">
          {currentQuestion && <QuestionDisplay
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            revealAnswer={answerRevealed}
            isAnswerDisabled={answerRevealed || !timerActive}
          />}
        </div>

        {currentQuestion && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            {currentQuestion.options.map((option, index) => (
              <AnswerButton
                key={index}
                index={index}
                optionText={option}
                onClick={() => handleAnswerSelect(index)}
                disabled={answerRevealed || !timerActive || (fiftyFiftyOptions?.includes(index) ?? false)}
                isSelected={selectedAnswer === index}
                isCorrect={index === currentQuestion.correctAnswerIndex}
                reveal={answerRevealed}
              />
            ))}
          </div>
        )}
        
        {answerRevealed && gamePhase === 'PLAYING' && (
            <div className="flex justify-center mt-2 md:mt-4 mb-4 md:mb-6">
              <Button onClick={proceedToNextTurnOrQuestion} size="lg" className="text-lg py-3 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                Continue <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
        )}

        <div className="w-full md:w-3/4 lg:w-2/3">
          <LifelineControls 
            activeTeam={activeTeam} 
            onUseLifeline={handleUseLifeline} 
            disabled={answerRevealed || !timerActive || !currentQuestion} 
          />
          <div className="mt-6">
            <Scoreboard teams={teams} activeTeamId={activeTeam.id} />
          </div>
        </div>
      </div>


      <Dialog open={showTeamPoll} onOpenChange={setShowTeamPoll}> {/* Renamed */}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask Your Team Results</DialogTitle> {/* Updated title */}
            <DialogDescription>
              Your team has cast their votes. Here are the results: {/* Updated description */}
            </DialogDescription>
          </DialogHeader>
          {teamPollData && currentQuestion && <TeamPollResults pollData={teamPollData} options={currentQuestion.options}/>} {/* Renamed */}
          <DialogFooter>
            <Button onClick={() => setShowTeamPoll(false)}>Close</Button> {/* Renamed */}
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
            {currentQuestion && currentQuestion.options[currentQuestion.correctAnswerIndex] ? 
             `Your friend thinks the answer might be <strong className="text-accent">${currentQuestion.options[currentQuestion.correctAnswerIndex]}</strong>.`
             : "Your friend is thinking..."}
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
