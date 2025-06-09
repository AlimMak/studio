import type { Question } from './types';

export const sampleQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswerIndex: 2,
    moneyValue: 100,
    timeLimit: 30, // Updated
  },
  {
    id: 'q2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    moneyValue: 200,
    timeLimit: 30, // Updated
  },
  {
    id: 'q3',
    text: 'Who wrote "Hamlet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'],
    correctAnswerIndex: 1,
    moneyValue: 300,
    timeLimit: 30, // Updated
  },
  {
    id: 'q4',
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswerIndex: 3,
    moneyValue: 500,
    timeLimit: 30, // Updated
  },
  {
    id: 'q5',
    text: 'In what year did World War II end?',
    options: ['1942', '1945', '1950', '1939'],
    correctAnswerIndex: 1,
    moneyValue: 1000,
    timeLimit: 30, // Updated
  },
   {
    id: 'q6',
    text: 'What is the chemical symbol for water?',
    options: ['O2', 'H2O', 'CO2', 'NaCl'],
    correctAnswerIndex: 1,
    moneyValue: 2000,
    timeLimit: 30, // Updated
  },
  {
    id: 'q7',
    text: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
    correctAnswerIndex: 2,
    moneyValue: 5000,
    timeLimit: 30, // Updated
  },
  {
    id: 'q8',
    text: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
    correctAnswerIndex: 2,
    moneyValue: 10000,
    timeLimit: 30, // Updated
  },
  {
    id: 'q9',
    text: 'Which country is known as the Land of the Rising Sun?',
    options: ['China', 'Japan', 'Thailand', 'South Korea'],
    correctAnswerIndex: 1,
    moneyValue: 25000,
    timeLimit: 30, // Updated
  },
  {
    id: 'q10',
    text: 'What is the square root of 144?',
    options: ['10', '12', '14', '16'],
    correctAnswerIndex: 1,
    moneyValue: 50000,
    timeLimit: 30, // Updated
  },
];

// Function to simulate admin pre-loading custom questions
// In a real app, this would involve file uploads, database interactions, etc.
export const getQuestions = (): Question[] => {
  // For now, just return the sample questions
  // Sort by moneyValue to ensure progression
  return [...sampleQuestions].sort((a, b) => a.moneyValue - b.moneyValue);
};
