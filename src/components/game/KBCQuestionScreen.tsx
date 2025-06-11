import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Diamond } from 'lucide-react';

interface KBCQuestionScreenProps {
  question: string;
  options: string[];
  onAnswerSelect: (index: number) => void;
  selectedAnswer: number | null;
  correctAnswer: number | null;
  answerRevealed: boolean;
  timer: { timeLeft: number; maxTime: number; active: boolean; onStart: () => void };
  onQuit: () => void;
  lifelines: React.ReactNode;
  disabledOptions?: number[];
  isAnswerDisabled: boolean;
  continueButton?: React.ReactNode;
  activeTeamName: string;
  questionValue: number;
}

const optionLetters = ['A', 'B', 'C', 'D'];

const KBCQuestionScreen: React.FC<KBCQuestionScreenProps> = ({
  question,
  options,
  onAnswerSelect,
  selectedAnswer,
  correctAnswer,
  answerRevealed,
  timer,
  onQuit,
  lifelines,
  disabledOptions = [],
  isAnswerDisabled,
  continueButton,
  activeTeamName,
  questionValue,
}) => {
  // Track which answers have been revealed before the timer starts
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);

  // Reset revealed answers when the question changes
  useEffect(() => {
    setRevealedAnswers([]);
  }, [question]);

  // Helper to reveal answer text on click if timer is not active
  const handleRevealOrSelect = (idx: number, isDisabled: boolean) => {
    if (!timer.active) {
      if (!revealedAnswers.includes(idx)) {
        setRevealedAnswers(prev => [...prev, idx]);
      }
    } else if (!isDisabled) {
      onAnswerSelect(idx);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-10 pb-6">
      <div className="bg-gradient-to-br from-[#1a1440] via-[#2d1e5f] to-[#1a1440] w-[75vw] max-w-5xl mx-auto p-6 rounded-[2rem] shadow-2xl flex justify-center">
        <div className="w-full max-w-4xl bg-[#1a1440] rounded-[2rem] p-5 flex flex-col items-center space-y-4">

          {/* Timer + Lifeline Row */}
          <div className="w-full flex justify-between items-center">
            <Button onClick={onQuit} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg shadow text-xl">
              Quit
            </Button>
            <div className="flex-1 flex justify-center gap-6">{lifelines}</div>
            <div className="flex items-center space-x-2">
              <Clock className="w-7 h-7 text-yellow-300" />
              <span className="text-yellow-300 font-extrabold text-2xl">{timer.timeLeft}s</span>
            </div>
          </div>

          {/* Timer Bar */}
          <div className="w-full h-2.5 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${timer.maxTime > 0 ? (timer.timeLeft / timer.maxTime) * 100 : 0}%` }}
            />
          </div>

          {/* Team Turn and Question Value */}
          <div className="w-full flex flex-col items-center mb-2">
            <div className="text-lg md:text-xl font-semibold text-accent-foreground bg-[#2d1e5f] rounded-t-xl px-6 py-2 shadow flex flex-col md:flex-row md:items-center gap-2">
              <span className="font-bold text-yellow-400">{activeTeamName}</span>
              <span className="hidden md:inline-block mx-2">|</span>
              <span className="font-bold text-green-400">${questionValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full text-center px-4 py-3 bg-[#2d1e5f] rounded-xl shadow text-white text-xl font-bold relative">
            <Diamond className="absolute left-4 top-3 text-yellow-400" />
            <Diamond className="absolute right-4 top-3 text-yellow-400" />
            {question}
          </div>

          {/* Start Timer Prompt */}
          {!timer.active && (
            <div className="flex flex-col items-center">
              <Button onClick={timer.onStart} className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2.5 rounded-full shadow text-lg font-bold">
                Start Timer
              </Button>
              <p className="text-yellow-200 text-sm mt-1">Start the timer to enable answering</p>
            </div>
          )}

          {/* Answer Options */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, idx) => {
              let style = "bg-[#1b1464] text-white hover:bg-[#2e3192]";
              if (answerRevealed) {
                if (idx === correctAnswer) style = "bg-green-600 text-white animate-pulse";
                else if (selectedAnswer === idx) style = "bg-red-600 text-white animate-pulse";
                else style = "bg-gray-600 text-white opacity-60";
              } else if (selectedAnswer === idx) {
                style = "bg-blue-700 text-white";
              }

              const isDisabled = timer.active && (disabledOptions.includes(idx) || isAnswerDisabled);
              // Hide answer text if timer is not active and not revealed
              const hideTextClass = !timer.active && !revealedAnswers.includes(idx) ? 'text-[#1a1440]' : '';

              return (
                <button
                  key={idx}
                  onClick={() => handleRevealOrSelect(idx, isDisabled)}
                  disabled={isDisabled}
                  className={`w-full flex items-center px-4 py-2.5 rounded-lg shadow font-semibold text-base ${style} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="w-8 h-8 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center mr-4">
                    {optionLetters[idx]}
                  </span>
                  <span className={`text-left ${hideTextClass}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          {continueButton && (
            <div className="w-full flex justify-center pt-3">{continueButton}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KBCQuestionScreen;
