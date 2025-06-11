import React from 'react';
import type { Question } from '@/lib/types';
import { Diamond } from 'lucide-react'; // Using Diamond for the motif

interface QuestionDisplayProps {
  question: Question;
  onAnswerSelect: (optionIndex: number) => void; // Kept for consistency, though not used here
  selectedAnswer: number | null; // Kept for consistency
  disabledOptions?: number[]; // Kept for consistency
  isAnswerDisabled: boolean; // Kept for consistency
}

const QuestionShape: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative w-full h-[70px] md:h-[80px] my-4">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 400 60" // Adjusted viewBox for better aspect ratio
        preserveAspectRatio="none"
        fill="hsl(var(--card))" 
        stroke="hsl(274 100% 35%)" // KBC Purple Border
        strokeWidth="2"
      >
        <path d="M 20 0 L 380 0 L 400 30 L 380 60 L 20 60 L 0 30 Z" />
      </svg>
      {/* Left Diamond */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Diamond className="w-4 h-4 text-white fill-white" />
      </div>
      {/* Right Diamond */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Diamond className="w-4 h-4 text-white fill-white" />
      </div>
      <div className="relative z-10 flex items-center justify-center w-full h-full px-10">
        <p className="text-lg md:text-xl text-center text-foreground font-semibold">
          {text}
        </p>
      </div>
    </div>
  );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Removed Question for $... title as per new design */}
      <QuestionShape text={question.text} />
      {/* Answer buttons will be rendered by the parent through a different component or mapping directly */}
    </div>
  );
};

export default QuestionDisplay;
