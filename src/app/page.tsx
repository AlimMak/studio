
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Team, Question, GamePhase } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { generateQuestionVariation } from '@/ai/flows/question-variation';

import TeamSetupForm from '@/components/game/TeamSetupForm';
import Scoreboard from '@/components/game/Scoreboard';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import AnswerButton from '@/components/game/AnswerButton';
import TimerDisplay from '@/components/game/TimerDisplay';
import LifelineControls from '@/components/game/LifelineControls';
import GameLogo from '@/components/game/GameLogo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PartyPopper, ChevronRight, TimerIcon } from 'lucide-react';

const MAX_TEAMS = 6;
const AI_VARIATION_CHANCE = 0; 
const LIFELINE_DIALOG_DURATION = 30;

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

  const [showTeamPoll, setShowTeamPoll] = useState(false);
  const [showPhoneAFriend, setShowPhoneAFriend] = useState(false);

  const [isLifelineDialogActive, setIsLifelineDialogActive] = useState(false);

  const [askTeamLifelineTimer, setAskTeamLifelineTimer] = useState(LIFELINE_DIALOG_DURATION);
  const [askTeamLifelineTimerActive, setAskTeamLifelineTimerActive] = useState(false);

  const [phoneAFriendLifelineTimer, setPhoneAFriendLifelineTimer] = useState(LIFELINE_DIALOG_DURATION);
  const [phoneAFriendLifelineTimerActive, setPhoneAFriendLifelineTimerActive] = useState(false);

  const [mainTimerWasActiveBeforeLifeline, setMainTimerWasActiveBeforeLifeline] = useState(false);


  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const activeTeam = teams[activeTeamIndex];

  const timerTickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const prevGamePhaseRef = useRef<GamePhase | undefined>();
  const prevCurrentQuestionIndexRef = useRef<number | undefined>();
  const prevActiveTeamIndexRef = useRef<number | undefined>();


  const handleStartGame = useCallback((teamNames: string[]) => {
    const newTeams: Team[] = teamNames.map((name, index) => ({
      id: `team-${index + 1}-${Date.now()}`,
      name: name.trim(),
      score: 0,
      lifelines: { fiftyFifty: true, phoneAFriend: true, askYourTeam: true },
    }));
    setTeams(newTeams);
    setCurrentQuestionIndex(0);
    setActiveTeamIndex(0);
    setGamePhase('PLAYING');
    
    prevGamePhaseRef.current = 'SETUP'; 
    prevCurrentQuestionIndexRef.current = undefined;
    prevActiveTeamIndexRef.current = undefined;

    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setFiftyFiftyUsedThisTurn(false);
    setFiftyFiftyOptions(null);
    setShowTeamPoll(false);
    setShowPhoneAFriend(false);
    setIsLifelineDialogActive(false);
    setAskTeamLifelineTimer(LIFELINE_DIALOG_DURATION);
    setAskTeamLifelineTimerActive(false);
    setPhoneAFriendLifelineTimer(LIFELINE_DIALOG_DURATION);
    setPhoneAFriendLifelineTimerActive(false);
    setMainTimerWasActiveBeforeLifeline(false);
    // Timer will be started by the main useEffect when questions load
  }, []);

  useEffect(() => {
    console.log("Audio: Initializing audio element");
    const audio = new Audio('/sounds/timer-tick.mp3');
    audio.loop = true;
    timerTickAudioRef.current = audio;

    const handleCanPlay = () => {
      setIsAudioInitialized(true);
      console.log("Audio: Ready to play (isAudioInitialized true)");
    };
    const handleError = (e: Event) => {
      console.error("Audio: Error loading audio:", e);
      setIsAudioInitialized(false); 
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    audio.load(); 

    return () => {
      console.log("Audio: Cleaning up audio element");
      if (timerTickAudioRef.current) {
        timerTickAudioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        timerTickAudioRef.current.removeEventListener('error', handleError);
        timerTickAudioRef.current.pause();
        timerTickAudioRef.current.srcObject = null; // More robust cleanup
        timerTickAudioRef.current.src = ''; 
        timerTickAudioRef.current = null;
      }
      setIsAudioInitialized(false);
    };
  }, []);

  const loadQuestions = useCallback(async () => {
    const baseQuestions = getQuestions();
    if (AI_VARIATION_CHANCE > 0) {
      const variedQuestions = await Promise.all(
        baseQuestions.map(async (q) => {
          if (Math.random() < AI_VARIATION_CHANCE) {
            try {
              const variation = await generateQuestionVariation({ question: q.text });
              return { ...q, text: variation.variedQuestion, originalText: q.text };
            } catch (error) {
              console.error("Failed to vary question:", error);
              toast({
                title: "AI Question Error",
                description: "Could not vary a question. Using original.",
                variant: "destructive",
                duration: 3000,
              });
              return q;
            }
          }
          return q;
        })
      );
      setQuestions(variedQuestions);
    } else {
      setQuestions(baseQuestions);
    }
  }, [toast]);

  useEffect(() => {
    if (gamePhase === 'PLAYING' && questions.length === 0) {
      loadQuestions();
    }
  }, [gamePhase, questions.length, loadQuestions]);


  useEffect(() => {
    let isNewTurnInitialization = false;

    if (gamePhase === 'PLAYING' && currentQuestion && teams.length > 0 && activeTeam) {
      const gameJustStarted = prevGamePhaseRef.current === 'SETUP' && gamePhase === 'PLAYING';
      const questionIndexChanged = prevCurrentQuestionIndexRef.current !== currentQuestionIndex && prevCurrentQuestionIndexRef.current !== undefined;
      const activeTeamIndexChanged = prevActiveTeamIndexRef.current !== activeTeamIndex && prevActiveTeamIndexRef.current !== undefined;
      const questionsJustLoaded = prevCurrentQuestionIndexRef.current === undefined && currentQuestionIndex === 0 && !!currentQuestion;

      if ( (gameJustStarted && !!currentQuestion) ||
           (questionIndexChanged && !!currentQuestion) ||
           (activeTeamIndexChanged && !!currentQuestion) ||
           questionsJustLoaded
      ) {
         isNewTurnInitialization = true;
      }
    }
    
    if (isNewTurnInitialization) {
        console.log("TIMER_DEBUG: New turn initialization. Q_ID:", currentQuestion.id, "TimeLimit:", currentQuestion.timeLimit, "isLifelineActive:", isLifelineDialogActive);
        
        if (isAudioInitialized && timerTickAudioRef.current) {
            console.log("Audio: Pausing and resetting audio for new turn.");
            timerTickAudioRef.current.pause();
            timerTickAudioRef.current.currentTime = 0; // Reset audio to start for new question
        }

        setTimeLeft(currentQuestion.timeLimit);
        setSelectedAnswer(null);
        setFiftyFiftyUsedThisTurn(false);
        setFiftyFiftyOptions(null);
        setAnswerRevealed(false); 

        if (currentQuestion.timeLimit > 0 && !isLifelineDialogActive) {
            console.log("TIMER_DEBUG: Setting timerActive to true for new turn.");
            setTimerActive(true); 
        } else { 
            console.log("TIMER_DEBUG: Setting timerActive to false for new turn. Reason: timeLimit <= 0 or lifeline dialog active.");
            setTimerActive(false); 
             if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) { // Ensure audio is paused if timer doesn't start
                timerTickAudioRef.current.pause();
            }
        }
    } else if (gamePhase === 'SETUP') {
        console.log("TIMER_DEBUG: Game in SETUP phase. Setting timerActive to false.");
        if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
            console.log("Audio: Pausing audio (SETUP phase).");
            timerTickAudioRef.current.pause();
        }
        setTimerActive(false); 
        setTimeLeft(0);
        setAnswerRevealed(false);
        setSelectedAnswer(null);
        setFiftyFiftyUsedThisTurn(false);
        setFiftyFiftyOptions(null);
        setShowTeamPoll(false);
        setShowPhoneAFriend(false);
        setIsLifelineDialogActive(false);
        setAskTeamLifelineTimer(LIFELINE_DIALOG_DURATION);
        setAskTeamLifelineTimerActive(false);
        setPhoneAFriendLifelineTimer(LIFELINE_DIALOG_DURATION);
        setPhoneAFriendLifelineTimerActive(false);
        setMainTimerWasActiveBeforeLifeline(false);
    } else if (gamePhase === 'GAME_OVER' || (gamePhase === 'PLAYING' && (answerRevealed || isLifelineDialogActive))) {
        if(timerActive) { 
            console.log("TIMER_DEBUG: Game over, answer revealed, or lifeline. Setting timerActive to false.");
            if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
                console.log("Audio: Pausing audio (Game Over/Revealed/Lifeline).");
                timerTickAudioRef.current.pause();
            }
            setTimerActive(false); 
        }
    }
    
    prevGamePhaseRef.current = gamePhase;
    prevCurrentQuestionIndexRef.current = currentQuestionIndex;
    prevActiveTeamIndexRef.current = activeTeamIndex;

  }, [
    gamePhase, currentQuestion, activeTeamIndex, currentQuestionIndex, teams.length, 
    isLifelineDialogActive, toast, activeTeam, answerRevealed, isAudioInitialized // Added isAudioInitialized
  ]);


  const handleAnswerSelect = useCallback((optionIndex: number | null) => {
    if (answerRevealed || (!timerActive && optionIndex !== null && currentQuestion && timeLeft > 0 && currentQuestion.timeLimit > 0) ) {
      return;
    }
    if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        console.log("Audio: Pausing audio (answer selected).");
        timerTickAudioRef.current.pause();
    }
    setTimerActive(false); 
    setSelectedAnswer(optionIndex);
    setAnswerRevealed(true);

    const isCorrect = currentQuestion && optionIndex !== null && optionIndex === currentQuestion.correctAnswerIndex;

    setTimeout(() => {
      if (isCorrect) {
        toast({ title: "Correct!", description: `+ $${currentQuestion?.moneyValue?.toLocaleString() || 0}`, variant: "default", duration: 2000 });
        setTeams(prevTeams => prevTeams.map(team =>
          team.id === activeTeam?.id ? { ...team, score: team.score + (currentQuestion?.moneyValue || 0) } : team
        ));
      } else {
         toast({ title: optionIndex === null ? "Time's Up!" : "Incorrect!", description: "Better luck next time.", variant: "destructive", duration: 2000 });
      }
    }, 1500);
  }, [answerRevealed, timerActive, currentQuestion, activeTeam, toast, timeLeft, isAudioInitialized]);

  const proceedToNextTurnOrQuestion = useCallback(() => {
    if (!answerRevealed || gamePhase !== 'PLAYING') return;

    const nextQuestionIndexToUse = currentQuestionIndex + 1;
    
    if (nextQuestionIndexToUse < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndexToUse); 
    } else {
      setGamePhase('GAME_OVER');
    }
  }, [answerRevealed, gamePhase, currentQuestionIndex, questions.length]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (timerActive && timeLeft > 0 && !isLifelineDialogActive) {
      console.log("TIMER_DEBUG: Interval timer starting. timeLeft:", timeLeft);
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      if (isAudioInitialized && timerTickAudioRef.current && timerTickAudioRef.current.paused) { // Play if paused
        console.log(`Audio: Attempting to play timer tick from timer useEffect. Current time: ${timerTickAudioRef.current.currentTime}`);
        // DO NOT reset currentTime here, it's done on new turn init
        timerTickAudioRef.current.play().catch(error => {
            console.error("Audio: Playback error in timer useEffect:", error);
        });
      }
    } else if (timerActive && timeLeft === 0 && !isLifelineDialogActive && !answerRevealed && currentQuestion && currentQuestion.timeLimit > 0) { 
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        console.log("Audio: Pausing timer tick (time up).");
        timerTickAudioRef.current.pause();
      }
      console.log("TIMER_DEBUG: Time's up! Handling answer select null.");
      handleAnswerSelect(null); 
    } else { 
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        console.log("Audio: Pausing timer tick (timer not active, or other condition like lifeline/revealed).");
        timerTickAudioRef.current.pause();
      }
    }
    
    return () => {
      clearInterval(intervalId);
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        console.log("Audio: Pausing timer tick (timer effect cleanup).");
        timerTickAudioRef.current.pause();
      }
    };
  }, [timerActive, timeLeft, isLifelineDialogActive, answerRevealed, handleAnswerSelect, currentQuestion, isAudioInitialized]);

  useEffect(() => {
    let lifelineIntervalId: NodeJS.Timeout | undefined;
    if (askTeamLifelineTimerActive && askTeamLifelineTimer > 0) {
      lifelineIntervalId = setInterval(() => {
        setAskTeamLifelineTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (askTeamLifelineTimerActive && askTeamLifelineTimer === 0) {
      setAskTeamLifelineTimerActive(false);
    }
    return () => clearInterval(lifelineIntervalId);
  }, [askTeamLifelineTimerActive, askTeamLifelineTimer]);

  useEffect(() => {
    let lifelineIntervalId: NodeJS.Timeout | undefined;
    if (phoneAFriendLifelineTimerActive && phoneAFriendLifelineTimer > 0) {
      lifelineIntervalId = setInterval(() => {
        setPhoneAFriendLifelineTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (phoneAFriendLifelineTimerActive && phoneAFriendLifelineTimer === 0) {
      setPhoneAFriendLifelineTimerActive(false);
    }
    return () => clearInterval(lifelineIntervalId);
  }, [phoneAFriendLifelineTimerActive, phoneAFriendLifelineTimer]);


  const handleUseLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam') => {
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
    } else if (type === 'phoneAFriend' || type === 'askYourTeam') {
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        console.log("Audio: Pausing audio (lifeline used).");
        timerTickAudioRef.current.pause();
      }
      setMainTimerWasActiveBeforeLifeline(timerActive); 
      setTimerActive(false); 
      setIsLifelineDialogActive(true);

      if (type === 'phoneAFriend') {
        setPhoneAFriendLifelineTimer(LIFELINE_DIALOG_DURATION);
        setPhoneAFriendLifelineTimerActive(false); 
        setShowPhoneAFriend(true);
        toast({ title: "Phone a Friend Used!", description: "Dialog open. Start the timer when ready." });
      } else { 
        setAskTeamLifelineTimer(LIFELINE_DIALOG_DURATION);
        setAskTeamLifelineTimerActive(false); 
        setShowTeamPoll(true);
        toast({ title: "Ask Your Team Used!", description: "Dialog open. Start the timer when ready." });
      }
    }
  };

  const closeLifelineDialog = (type: 'askYourTeam' | 'phoneAFriend') => {
    if (type === 'askYourTeam') {
      setShowTeamPoll(false);
      setAskTeamLifelineTimerActive(false); 
    } else { 
      setShowPhoneAFriend(false);
      setPhoneAFriendLifelineTimerActive(false); 
    }
    
    setIsLifelineDialogActive(false);

    if (mainTimerWasActiveBeforeLifeline && currentQuestion && !answerRevealed && timeLeft > 0) {
      setTimerActive(true); 
    }
    setMainTimerWasActiveBeforeLifeline(false); 
  };


  const disabledLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam'): boolean => {
      if(!activeTeam) return true;
      if (answerRevealed) return true; 
      if (type === 'fiftyFifty') {
          return !activeTeam.lifelines.fiftyFifty || fiftyFiftyUsedThisTurn;
      }
      if (isLifelineDialogActive) return true;
      return !activeTeam.lifelines[type];
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
          setQuestions([]); 
          setCurrentQuestionIndex(0);
          setActiveTeamIndex(0);
          if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
            console.log("Audio: Pausing audio on Play Again.");
            timerTickAudioRef.current.pause();
          }
          setTimerActive(false);
          setTimeLeft(0);
          setAnswerRevealed(false);
          setSelectedAnswer(null);
          setFiftyFiftyUsedThisTurn(false);
          setFiftyFiftyOptions(null);
          setShowTeamPoll(false);
          setShowPhoneAFriend(false);
          setIsLifelineDialogActive(false);
          setAskTeamLifelineTimer(LIFELINE_DIALOG_DURATION);
          setAskTeamLifelineTimerActive(false);
          setPhoneAFriendLifelineTimer(LIFELINE_DIALOG_DURATION);
          setPhoneAFriendLifelineTimerActive(false);
          setMainTimerWasActiveBeforeLifeline(false);
          }} className="mt-8 text-lg py-3 px-6">
          Play Again
        </Button>
      </main>
    );
  }

  if (!currentQuestion || !activeTeam || questions.length === 0) {
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
            isAnswerDisabled={answerRevealed || (!timerActive && timeLeft > 0 && currentQuestion.timeLimit > 0 && !isLifelineDialogActive)} 
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
                disabled={answerRevealed || (!timerActive && timeLeft > 0 && currentQuestion.timeLimit > 0 && !isLifelineDialogActive) || (fiftyFiftyOptions?.includes(index) ?? false)}
                isSelected={selectedAnswer === index}
                isCorrect={index === currentQuestion.correctAnswerIndex}
                reveal={answerRevealed}
              />
            ))}
          </div>
        )}

        {answerRevealed && gamePhase === 'PLAYING' && !isLifelineDialogActive && (
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
            disabled={disabledLifeline('fiftyFifty') && disabledLifeline('phoneAFriend') && disabledLifeline('askYourTeam')}
          />
          <div className="mt-6">
            <Scoreboard teams={teams} activeTeamId={activeTeam.id} />
          </div>
        </div>
      </div>


      {/* Ask Your Team Dialog */}
      <Dialog open={showTeamPoll} onOpenChange={(isOpen) => { if(!isOpen) closeLifelineDialog('askYourTeam'); else setShowTeamPoll(true); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask Your Team</DialogTitle>
          </DialogHeader>
          <DialogDescription className="my-4 text-lg text-center">
            Confer with your team.
          </DialogDescription>
          <div className="my-6 flex flex-col items-center space-y-4">
            <div className="text-6xl font-bold text-primary flex items-center">
              <TimerIcon className="w-12 h-12 mr-3"/>
              {askTeamLifelineTimer}s
            </div>
            <Button
              onClick={() => {
                if (askTeamLifelineTimer > 0 && !askTeamLifelineTimerActive) { 
                  setAskTeamLifelineTimerActive(true);
                }
              }}
              disabled={askTeamLifelineTimerActive || askTeamLifelineTimer === 0}
              size="lg"
              className="w-full"
            >
              {askTeamLifelineTimer === 0 ? "Time Up" : (askTeamLifelineTimerActive ? "Timer Running..." : `Start ${LIFELINE_DIALOG_DURATION}s Timer`)}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => closeLifelineDialog('askYourTeam')}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone a Friend Dialog */}
      <Dialog open={showPhoneAFriend} onOpenChange={(isOpen) => { if(!isOpen) closeLifelineDialog('phoneAFriend'); else setShowPhoneAFriend(true); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Phone a Friend</DialogTitle>
          </DialogHeader>
          <DialogDescription className="my-4 text-lg text-center">
            You have {LIFELINE_DIALOG_DURATION} seconds to 'call' your friend.
          </DialogDescription>
           <div className="my-6 flex flex-col items-center space-y-4">
            <div className="text-6xl font-bold text-primary flex items-center">
              <TimerIcon className="w-12 h-12 mr-3"/>
              {phoneAFriendLifelineTimer}s
            </div>
            <Button
              onClick={() => {
                 if (phoneAFriendLifelineTimer > 0 && !phoneAFriendLifelineTimerActive) { 
                    setPhoneAFriendLifelineTimerActive(true);
                 }
              }}
              disabled={phoneAFriendLifelineTimerActive || phoneAFriendLifelineTimer === 0}
              size="lg"
              className="w-full"
            >
              {phoneAFriendLifelineTimer === 0 ? "Time Up" : (phoneAFriendLifelineTimerActive ? "Timer Running..." : `Start ${LIFELINE_DIALOG_DURATION}s Timer`)}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => closeLifelineDialog('phoneAFriend')}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
    
    

    

    

    

    
