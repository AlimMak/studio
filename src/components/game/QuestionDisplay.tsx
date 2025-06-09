import React from 'react';
import type { Question } from '@/lib/types';
import AnswerButton from './AnswerButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  onAnswerSelect: (optionIndex: number) => void;
  selectedAnswer: number | null;
  revealAnswer: boolean;
  disabledOptions?: number[]; // Indices of options disabled by 50:50
  isAnswerDisabled: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  revealAnswer,
  disabledOptions = [],
  isAnswerDisabled,
}) => {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl md:text-3xl font-headline text-primary flex items-center justify-center gap-2">
           <HelpCircle className="w-8 h-8 text-accent" /> Question for ${question.moneyValue.toLocaleString()}
        </CardTitle>
        <CardDescription className="text-lg md:text-xl mt-2 px-4 py-6 bg-primary/5 rounded-lg shadow-inner text-foreground">
          {question.text}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            index={index}
            optionText={option}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswerDisabled || disabledOptions.includes(index)}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.correctAnswerIndex}
            reveal={revealAnswer}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
