
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Team, Question, GamePhase } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { generateQuestionVariation } from '@/ai/flows/question-variation';

import HostIntroductionDisplay from '@/components/game/HostIntroductionDisplay';
import TeamSetupForm from '@/components/game/TeamSetupForm';
import Scoreboard from '@/components/game/Scoreboard';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import AnswerButton from '@/components/game/AnswerButton';
import TimerDisplay from '@/components/game/TimerDisplay';
import LifelineControls from '@/components/game/LifelineControls';
import GameLogo from '@/components/game/GameLogo';
import RulesDisplay from '@/components/game/RulesDisplay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PartyPopper, ChevronRight, TimerIcon, PlayIcon, Gamepad2 } from 'lucide-react';

const MAX_TEAMS = 6;
const AI_VARIATION_CHANCE = 0;
const LIFELINE_DIALOG_DURATION = 30;

export default function CrorepatiChallengePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('TITLE_SCREEN');
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [areAnswersVisible, setAreAnswersVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerManuallyStartedThisTurn, setTimerManuallyStartedThisTurn] = useState(false);

  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [fiftyFiftyUsedThisTurn, setFiftyFiftyUsedThisTurn] = useState(false);
  const [fiftyFiftyOptions, setFiftyFiftyOptions] = useState<number[] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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

  const backgroundMusicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isBackgroundAudioInitialized, setIsBackgroundAudioInitialized] = useState(false);

  const prevGamePhaseRef = useRef<GamePhase | undefined>();
  const prevCurrentQuestionIndexRef = useRef<number | undefined>();
  const prevActiveTeamIndexRef = useRef<number | undefined>();


  const resetGameStates = useCallback(() => {
    setTeams([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setActiveTeamIndex(0);
    setTimeLeft(0);
    setTimerActive(false);
    setTimerManuallyStartedThisTurn(false);
    setAnswerRevealed(false);
    setFiftyFiftyUsedThisTurn(false);
    setFiftyFiftyOptions(null);
    setSelectedAnswer(null);
    setShowTeamPoll(false);
    setShowPhoneAFriend(false);
    setIsLifelineDialogActive(false);
    setAskTeamLifelineTimer(LIFELINE_DIALOG_DURATION);
    setAskTeamLifelineTimerActive(false);
    setPhoneAFriendLifelineTimer(LIFELINE_DIALOG_DURATION);
    setPhoneAFriendLifelineTimerActive(false);
    setMainTimerWasActiveBeforeLifeline(false);

    prevGamePhaseRef.current = undefined;
    prevCurrentQuestionIndexRef.current = undefined;
    prevActiveTeamIndexRef.current = undefined;

    if (isAudioInitialized && timerTickAudioRef.current) {
        if (!timerTickAudioRef.current.paused) {
            timerTickAudioRef.current.pause();
        }
        timerTickAudioRef.current.currentTime = 0;
    }
    if (isBackgroundAudioInitialized && backgroundMusicAudioRef.current) {
        if (!backgroundMusicAudioRef.current.paused) {
            backgroundMusicAudioRef.current.pause();
        }
        backgroundMusicAudioRef.current.currentTime = 0;
    }
  }, [isAudioInitialized, isBackgroundAudioInitialized]);

  const handleProceedToHostIntro = useCallback(() => {
    setGamePhase('HOST_INTRODUCTION');
    prevGamePhaseRef.current = 'TITLE_SCREEN';
  }, []);

  const handleProceedToSetup = useCallback(() => {
    setGamePhase('SETUP');
    prevGamePhaseRef.current = 'HOST_INTRODUCTION';
  }, []);

  const handleStartGame = useCallback((teamNames: string[]) => {
    if (gamePhase !== 'SETUP') {
      resetGameStates();
    }
    const newTeams: Team[] = teamNames.map((name, index) => ({
      id: `team-${index + 1}-${Date.now()}`,
      name: name.trim(),
      score: 0,
      lifelines: { fiftyFifty: true, phoneAFriend: true, askYourTeam: true },
    }));
    setTeams(newTeams);
    setCurrentQuestionIndex(0);
    setActiveTeamIndex(0);
    setGamePhase('RULES');
    prevGamePhaseRef.current = 'SETUP';
  }, [resetGameStates, gamePhase]);


  const handleProceedToPlay = useCallback(() => {
    setGamePhase('PLAYING');
    prevGamePhaseRef.current = 'RULES';
  }, []);


  useEffect(() => {
    const audio = new Audio('/sounds/timer-tick.mp3');
    audio.loop = true;
    timerTickAudioRef.current = audio;

    const handleCanPlay = () => {
      setIsAudioInitialized(true);
    };
    const handleError = (e: Event) => {
      setIsAudioInitialized(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.load();

    return () => {
      if (timerTickAudioRef.current) {
        timerTickAudioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        timerTickAudioRef.current.removeEventListener('error', handleError);
        if (!timerTickAudioRef.current.paused) {
            timerTickAudioRef.current.pause();
        }
        try {
            // @ts-ignore
            if (timerTickAudioRef.current.srcObject && timerTickAudioRef.current.srcObject.getTracks) {
              // @ts-ignore
              const tracks = timerTickAudioRef.current.srcObject.getTracks();
              tracks.forEach((track: MediaStreamTrack) => track.stop());
            }
        } catch (e) {
        }
        timerTickAudioRef.current.srcObject = null;
        timerTickAudioRef.current.src = '';
        timerTickAudioRef.current.load();
        timerTickAudioRef.current = null;
      }
      setIsAudioInitialized(false);
    };
  }, []);

  useEffect(() => {
    const bgAudio = new Audio('/sounds/background-music.mp3');
    backgroundMusicAudioRef.current = bgAudio;

    const handleBgCanPlay = () => {
      setIsBackgroundAudioInitialized(true);
    };
    const handleBgError = (e: Event) => {
      setIsBackgroundAudioInitialized(false);
    };

    bgAudio.addEventListener('canplaythrough', handleBgCanPlay);
    bgAudio.addEventListener('error', handleBgError);
    bgAudio.load();

    return () => {
      if (backgroundMusicAudioRef.current) {
        backgroundMusicAudioRef.current.removeEventListener('canplaythrough', handleBgCanPlay);
        backgroundMusicAudioRef.current.removeEventListener('error', handleBgError);
        if (!backgroundMusicAudioRef.current.paused) {
          backgroundMusicAudioRef.current.pause();
        }
        try {
            // @ts-ignore
          if (backgroundMusicAudioRef.current.srcObject && backgroundMusicAudioRef.current.srcObject.getTracks) {
             // @ts-ignore
            const tracks = backgroundMusicAudioRef.current.srcObject.getTracks();
            tracks.forEach((track: MediaStreamTrack) => track.stop());
          }
        } catch (e) {
        }
        backgroundMusicAudioRef.current.srcObject = null;
        backgroundMusicAudioRef.current.src = '';
        backgroundMusicAudioRef.current.load();
        backgroundMusicAudioRef.current = null;
      }
      setIsBackgroundAudioInitialized(false);
    };
  }, []);

  useEffect(() => {
    if (!isBackgroundAudioInitialized || !backgroundMusicAudioRef.current) {
      return;
    }

    if (gamePhase === 'TITLE_SCREEN') {
      backgroundMusicAudioRef.current.loop = true;
      backgroundMusicAudioRef.current.play().catch(error => {
      });
    } else {
      if (backgroundMusicAudioRef.current && !backgroundMusicAudioRef.current.paused) {
        backgroundMusicAudioRef.current.pause();
        backgroundMusicAudioRef.current.currentTime = 0;
      }
    }
  }, [gamePhase, isBackgroundAudioInitialized]);


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
    if ((gamePhase === 'PLAYING' || gamePhase === 'RULES') && questions.length === 0) {
      loadQuestions();
    }
  }, [gamePhase, questions.length, loadQuestions]);


  useEffect(() => {
    let isNewTurnInitialization = false;

    if (gamePhase === 'PLAYING' && currentQuestion && teams.length > 0 && activeTeam) {
      const gameJustStarted = (prevGamePhaseRef.current === 'RULES' || prevGamePhaseRef.current === 'SETUP') && gamePhase === 'PLAYING';
      const questionIndexChanged = prevCurrentQuestionIndexRef.current !== currentQuestionIndex && prevCurrentQuestionIndexRef.current !== undefined;
      const questionsJustLoaded = prevCurrentQuestionIndexRef.current === undefined && currentQuestionIndex === 0 && !!currentQuestion && (prevGamePhaseRef.current === 'RULES' || prevGamePhaseRef.current === 'SETUP');

      if ( (gameJustStarted && !!currentQuestion) ||
           (questionIndexChanged && !!currentQuestion) ||
           questionsJustLoaded
      ) {
         isNewTurnInitialization = true;
      }
    }

    if (isNewTurnInitialization) {
        if (isAudioInitialized && timerTickAudioRef.current) {
            if (!timerTickAudioRef.current.paused) {
                timerTickAudioRef.current.pause();
            }
           timerTickAudioRef.current.currentTime = 0;
        }

        setTimeLeft(currentQuestion.timeLimit);
        setFiftyFiftyUsedThisTurn(false);
        setFiftyFiftyOptions(null);
        setAnswerRevealed(false);
        setSelectedAnswer(null);
 setTimerActive(false);
        setAreAnswersVisible(false);
        setAreAnswersVisible(true); // Make answers visible by default
    } else if (gamePhase === 'TITLE_SCREEN' || gamePhase === 'HOST_INTRODUCTION' || gamePhase === 'SETUP' || gamePhase === 'RULES') {
        if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
            timerTickAudioRef.current.pause();
        }
        setTimerActive(false);
    } else if (gamePhase === 'GAME_OVER' || (gamePhase === 'PLAYING' && (answerRevealed || isLifelineDialogActive))) {
        if(timerActive) {
            if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
                timerTickAudioRef.current.pause();
            }
            setTimerActive(false);
        }
    }

    if ((gamePhase === 'PLAYING' && currentQuestion) || gamePhase === 'question' || gamePhase !== 'PLAYING') {
 prevGamePhaseRef.current = gamePhase;
      prevCurrentQuestionIndexRef.current = currentQuestionIndex;
      prevActiveTeamIndexRef.current = activeTeamIndex;

 }

  }, [
    gamePhase, currentQuestion, activeTeamIndex, currentQuestionIndex, teams.length,
    isLifelineDialogActive, activeTeam, answerRevealed, isAudioInitialized, areAnswersVisible
  ]);

  const handleAnswerSelect = useCallback((optionIndex: number | null) => {
    if (optionIndex !== null) { // User selected an answer
        if (!timerManuallyStartedThisTurn) {
            toast({ title: "Timer Not Started", description: "Please start the timer before selecting an answer.", variant: "destructive", duration: 2000 });
            return;
        }
    }
    // Fall through if optionIndex is null (time's up) or if above checks pass for user click

    if (!currentQuestion || !activeTeam) {
        return; // Should not happen if game is in PLAYING and question/team are set
    }

    setSelectedAnswer(optionIndex);
    setTimerActive(false); // Stop timer immediately
    if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.pause(); // Stop audio immediately
    }
    setAnswerRevealed(true); // Reveal correct/incorrect state and show "Continue" button

    const isCorrect = optionIndex !== null && optionIndex === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      const pointsWon = currentQuestion.moneyValue;
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === activeTeam.id
            ? { ...team, score: team.score + pointsWon }
            : team
        )
      );
      toast({
        title: "Correct!",
        description: `You've won $${pointsWon.toLocaleString()}!`,
        variant: "success",
        duration: 3000,
      });
    } else {
      toast({
        title: optionIndex === null ? "Time's Up!" : "Incorrect",
        description: "Better luck next time!",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [
      timerManuallyStartedThisTurn, currentQuestion, activeTeam, isAudioInitialized,
      toast // Removed timeLeft from dependencies as its direct check here could be problematic
  ]);

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
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      if (isAudioInitialized && timerTickAudioRef.current && timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.play().catch(error => {
        });
      }
    } else if (timerActive && timeLeft === 0 && !isLifelineDialogActive && !answerRevealed && currentQuestion && currentQuestion.timeLimit > 0 && timerManuallyStartedThisTurn) {
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.pause();
      }
      handleAnswerSelect(null); 
    } else {
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.pause();
      }
    }

    return () => {
      clearInterval(intervalId);
      if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.pause();
      }
    };
  }, [timerActive, timeLeft, isLifelineDialogActive, answerRevealed, handleAnswerSelect, currentQuestion, isAudioInitialized, timerManuallyStartedThisTurn]);

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

    if (mainTimerWasActiveBeforeLifeline && timerManuallyStartedThisTurn && currentQuestion && !answerRevealed && timeLeft > 0) {
      setTimerActive(true);
    }
    setMainTimerWasActiveBeforeLifeline(false);
  };


  const disabledLifeline = (type: 'fiftyFifty' | 'phoneAFriend' | 'askYourTeam'): boolean => {
      if(!activeTeam) return true;
      if (answerRevealed) return true;
      if (type === 'fiftyFifty' && !areAnswersVisible) return true;
      if (type === 'fiftyFifty' ) {
          return !activeTeam.lifelines.fiftyFifty || fiftyFiftyUsedThisTurn;
      }
      if (isLifelineDialogActive) return true;
      return !activeTeam.lifelines[type];
  }

  const handleStartManualTimer = () => {
    if (!answerRevealed && timeLeft > 0 && !timerManuallyStartedThisTurn && currentQuestion && currentQuestion.timeLimit > 0 && !isLifelineDialogActive) {
      if (isAudioInitialized && timerTickAudioRef.current) {
        timerTickAudioRef.current.currentTime = 0;
      }
      setTimerActive(true);
      setTimerManuallyStartedThisTurn(true);
    }
  };

  if (gamePhase === 'TITLE_SCREEN') {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <GameLogo className="mb-12" />
        <Button
          onClick={handleProceedToHostIntro}
          className="text-xl py-8 px-12 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          <Gamepad2 className="mr-3 w-7 h-7" /> Let's Play!
        </Button>
      </main>
    );
  }

  if (gamePhase === 'HOST_INTRODUCTION') {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <GameLogo className="mb-8" />
        <HostIntroductionDisplay onProceed={handleProceedToSetup} />
      </main>
    );
  }

  if (gamePhase === 'SETUP') {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <GameLogo className="mb-8" />
        <TeamSetupForm onStartGame={handleStartGame} maxTeams={MAX_TEAMS} />
      </main>
    );
  }

  if (gamePhase === 'RULES') {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4 animate-fade-in">
        <GameLogo className="mb-8" />
        <RulesDisplay onProceed={handleProceedToPlay} />
      </main>
    );
  }


  if (gamePhase === 'GAME_OVER') {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    if (isAudioInitialized && timerTickAudioRef.current && !timerTickAudioRef.current.paused) {
        timerTickAudioRef.current.pause();
    }
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
          resetGameStates();
          setGamePhase('TITLE_SCREEN');
          }} className="mt-8 text-lg py-3 px-6">
          Play Again
        </Button>
      </main>
    );
  }

  if ((gamePhase === 'PLAYING' || gamePhase === 'RULES') && (questions.length === 0 || (gamePhase === 'PLAYING' && !currentQuestion))) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <GameLogo className="mb-8" />
        <p className="text-xl">Loading game...</p>
      </main>
    );
  }

  if (gamePhase === 'PLAYING' && (!currentQuestion || !activeTeam) ) {
     return (
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <GameLogo className="mb-8" />
        <p className="text-xl">Error: Game in inconsistent state. Please restart.</p>
         <Button onClick={() => { resetGameStates(); setGamePhase('TITLE_SCREEN'); }} className="mt-4">Restart</Button>
      </main>
    );
  }


  const isStartTimerButtonDisabled = areAnswersVisible || answerRevealed || timerManuallyStartedThisTurn || timeLeft === 0 || (currentQuestion && currentQuestion.timeLimit === 0) || isLifelineDialogActive;
  const generalAnswerButtonDisabledCondition = answerRevealed || !timerManuallyStartedThisTurn || timeLeft === 0 || isLifelineDialogActive || !areAnswersVisible;

  return (
    <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center animate-fade-in-slow">
      <header className="w-full mb-2 md:mb-4 flex flex-col items-center">
        <GameLogo size="small" />
        {currentQuestion && <TimerDisplay timeLeft={timeLeft} maxTime={currentQuestion.timeLimit} />}
        
      </header>

      {currentQuestion && (
        <div className="w-full mb-4 md:mb-6">
          <QuestionDisplay
            question={currentQuestion}
            onAnswerSelect={() => {}}
            selectedAnswer={selectedAnswer}
            isAnswerDisabled={generalAnswerButtonDisabledCondition}
          />
        </div>
      )}

      {currentQuestion && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          {currentQuestion.options.map((option, index) => (
            <AnswerButton
              key={index}
              index={index}
              optionText={option}
              onClick={() => handleAnswerSelect(index)}
              disabledForInteraction={generalAnswerButtonDisabledCondition}
              isEliminatedByFiftyFifty={fiftyFiftyUsedThisTurn && (fiftyFiftyOptions?.includes(index) ?? false)}
              isSelected={selectedAnswer === index}
              isCorrect={index === currentQuestion.correctAnswerIndex}
              isVisible={areAnswersVisible}
              isTimerActive={timerActive && timerManuallyStartedThisTurn}
              canSelect={timerManuallyStartedThisTurn && areAnswersVisible && !answerRevealed}
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
          disabled={disabledLifeline('fiftyFifty') && disabledLifeline('phoneAFriend') && disabledLifeline('askYourTeam') || isLifelineDialogActive}
        />
        <div className="mt-6">
          <Scoreboard teams={teams} activeTeamId={activeTeam?.id} />
        </div>
      </div>


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

    