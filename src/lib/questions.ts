
import type { Question } from './types';

export const sampleQuestions: Question[] = [
  // Difficulty 1 (Very Easy) - $100, 30 seconds
  {
    id: 'q1',
    text: 'What is the highest mountain in the world?',
    options: ['K2', 'Mount Everest', 'Kilimanjaro', 'Denali'],
    correctAnswerIndex: 1,
    moneyValue: 100,
    timeLimit: 30,
  },
  {
    id: 'q2',
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Arctic', 'Indian', 'Pacific'],
    correctAnswerIndex: 3,
    moneyValue: 100,
    timeLimit: 30,
  },
  {
    id: 'q3',
    text: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Leonardo da Vinci', 'Picasso', 'Michelangelo'],
    correctAnswerIndex: 1,
    moneyValue: 100,
    timeLimit: 30,
  },
  {
    id: 'q4',
    text: 'What is the longest river in the world?',
    options: ['Amazon', 'Mississippi', 'Yangtze', 'Nile'],
    correctAnswerIndex: 3,
    moneyValue: 100,
    timeLimit: 30,
  },

  // Difficulty 2 - $1,000, 30 seconds
  {
    id: 'q5',
    text: 'Where is the 2nd highest mountain, K2, located?',
    options: ['India', 'Pakistan', 'China', 'Nepal'],
    correctAnswerIndex: 1,
    moneyValue: 1000,
    timeLimit: 30,
  },
  {
    id: 'q6',
    text: 'Who was the first woman to fly solo across the Atlantic?',
    options: ['Bessie Coleman', 'Amelia Earhart', 'Harriet Quimby', 'Sally Ride'],
    correctAnswerIndex: 1,
    moneyValue: 1000,
    timeLimit: 30,
  },
  {
    id: 'q7',
    text: 'What is the name of the first North American pope elected in May 2025?',
    options: ['John Paul III', 'Thomas O’Malley', 'Robert Francis Prevost', 'William Benedict'],
    correctAnswerIndex: 2,
    moneyValue: 1000,
    timeLimit: 30,
  },
  {
    id: 'q8',
    text: 'Who has won the most Olympic medals?',
    options: ['Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Mark Spitz'],
    correctAnswerIndex: 1,
    moneyValue: 1000,
    timeLimit: 30,
  },

  // Difficulty 3 - $10,000, 30 seconds
  {
    id: 'q9',
    text: 'What is Donald Trump’s middle name?',
    options: ['James', 'Joseph', 'John', 'Jason'],
    correctAnswerIndex: 2,
    moneyValue: 10000,
    timeLimit: 30,
  },
  {
    id: 'q10',
    text: 'Which NFL team has the most Super Bowl wins?',
    options: ['Dallas Cowboys', 'New York Giants', 'New England Patriots', 'Denver Broncos'],
    correctAnswerIndex: 2,
    moneyValue: 10000,
    timeLimit: 30,
  },
  {
    id: 'q11',
    text: 'Who scored the most points in a single NBA game?',
    options: ['Kobe Bryant', 'Michael Jordan', 'Wilt Chamberlain', 'LeBron James'],
    correctAnswerIndex: 2,
    moneyValue: 10000,
    timeLimit: 30,
  },
  {
    id: 'q12',
    text: 'What is the capital of the United States?',
    options: ['Los Angeles', 'New York', 'Washington, D.C.', 'Chicago'],
    correctAnswerIndex: 2,
    moneyValue: 10000,
    timeLimit: 30,
  },

  // Difficulty 4 - $75,000, 25 seconds
  {
    id: 'q13',
    text: 'What is the heaviest overall human organ?',
    options: ['Liver', 'Skin', 'Brain', 'Lungs'],
    correctAnswerIndex: 1,
    moneyValue: 75000,
    timeLimit: 25,
  },
  {
    id: 'q14',
    text: 'Where was hummus first made?',
    options: ['Israel', 'Syria', 'Greece', 'Lebanon'],
    correctAnswerIndex: 3,
    moneyValue: 75000,
    timeLimit: 25,
  },
  {
    id: 'q15',
    text: 'What is the heaviest internal organ?',
    options: ['Liver', 'Kidney', 'Intestines', 'Heart'],
    correctAnswerIndex: 0,
    moneyValue: 75000,
    timeLimit: 25,
  },
  {
    id: 'q16',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    correctAnswerIndex: 2,
    moneyValue: 75000,
    timeLimit: 25,
  },

  // Difficulty 5 - $200,000, 25 seconds
  {
    id: 'q17',
    text: 'Where were the first Olympic games held?',
    options: ['Italy', 'Greece', 'Egypt', 'Turkey'],
    correctAnswerIndex: 1,
    moneyValue: 200000,
    timeLimit: 25,
  },
  {
    id: 'q18',
    text: 'What country first made Manchurian chicken/vegetables?',
    options: ['China', 'Thailand', 'India', 'Malaysia'],
    correctAnswerIndex: 2,
    moneyValue: 200000,
    timeLimit: 25,
  },
  {
    id: 'q19',
    text: 'Who is the only athlete to play in both a Super Bowl and a World Series?',
    options: ['Bo Jackson', 'Deion Sanders', 'Tim Tebow', 'Michael Jordan'],
    correctAnswerIndex: 1,
    moneyValue: 200000,
    timeLimit: 25,
  },
  {
    id: 'q20',
    text: 'What gas do plants use for photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'],
    correctAnswerIndex: 3,
    moneyValue: 200000,
    timeLimit: 25,
  },

  // Difficulty 6 - $500,000, 25 seconds
  {
    id: 'q21',
    text: 'What fruit is the Cutie brand known for?',
    options: ['Apricot', 'Clementine', 'Plum', 'Kumquat'],
    correctAnswerIndex: 1,
    moneyValue: 500000,
    timeLimit: 25,
  },
  {
    id: 'q22',
    text: 'Where was the croissant invented?',
    options: ['France', 'Austria', 'Germany', 'Italy'],
    correctAnswerIndex: 1,
    moneyValue: 500000,
    timeLimit: 25,
  },
  {
    id: 'q23',
    text: 'Who won the FIFA World Cup in 2022?',
    options: ['France', 'Brazil', 'Argentina', 'Germany'],
    correctAnswerIndex: 2,
    moneyValue: 500000,
    timeLimit: 25,
  },
  {
    id: 'q24',
    text: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Gd', 'Go'],
    correctAnswerIndex: 0,
    moneyValue: 500000,
    timeLimit: 25,
  },

  // Difficulty 7 - $1,250,000, 20 seconds
  {
    id: 'q25',
    text: 'What country is Kadhi Khawsa from?',
    options: ['Bangladesh', 'Burma', 'India', 'Pakistan'],
    correctAnswerIndex: 1,
    moneyValue: 1250000,
    timeLimit: 20,
  },
  {
    id: 'q26',
    text: 'Where was the first hamburger made?',
    options: ['Germany', 'USA', 'Belgium', 'Canada'],
    correctAnswerIndex: 2,
    moneyValue: 1250000,
    timeLimit: 20,
  },
  {
    id: 'q27',
    text: 'What country did falooda come from?',
    options: ['Pakistan', 'Turkey', 'Iran', 'Egypt'],
    correctAnswerIndex: 2,
    moneyValue: 1250000,
    timeLimit: 20,
  },
  {
    id: 'q28',
    text: 'Where were diamonds first cultivated?',
    options: ['South Africa', 'India', 'Russia', 'Brazil'],
    correctAnswerIndex: 1,
    moneyValue: 1250000,
    timeLimit: 20,
  },

  // Difficulty 8 - $3,000,000, 20 seconds
  {
    id: 'q29',
    text: 'What year did cricket begin in India?',
    options: ['1857', '1801', '1721', '1790'],
    correctAnswerIndex: 2,
    moneyValue: 3000000,
    timeLimit: 20,
  },
  {
    id: 'q30',
    text: 'When were the first jeans made?',
    options: ['1900s', '1870s', '1800s', '1860s'],
    correctAnswerIndex: 1,
    moneyValue: 3000000,
    timeLimit: 20,
  },
  {
    id: 'q31',
    text: 'Who discovered penicillin?',
    options: ['Albert Einstein', 'Marie Curie', 'Alexander Fleming', 'Jonas Salk'],
    correctAnswerIndex: 2,
    moneyValue: 3000000,
    timeLimit: 20,
  },
  {
    id: 'q32',
    text: 'What is the currency of Japan?',
    options: ['Yen', 'Won', 'Yuan', 'Ringgit'],
    correctAnswerIndex: 0,
    moneyValue: 3000000,
    timeLimit: 20,
  },

  // Difficulty 9 - $7,500,000, 15 seconds
  {
    id: 'q33',
    text: 'What is the only U.S. state to grow coffee commercially?',
    options: ['California', 'Texas', 'Florida', 'Hawaii'],
    correctAnswerIndex: 3,
    moneyValue: 7500000,
    timeLimit: 15,
  },
  {
    id: 'q34',
    text: 'What is the smallest country in the world?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
    correctAnswerIndex: 2,
    moneyValue: 7500000,
    timeLimit: 15,
  },
  {
    id: 'q35',
    text: 'Which African country has the most pyramids?',
    options: ['Egypt', 'Sudan', 'Ethiopia', 'Libya'],
    correctAnswerIndex: 1,
    moneyValue: 7500000,
    timeLimit: 15,
  },
  {
    id: 'q36',
    text: 'What is the deepest part of the ocean?',
    options: ['Mariana Trench', 'Challenger Deep', 'Tonga Trench', 'Java Trench'],
    correctAnswerIndex: 0,
    moneyValue: 7500000,
    timeLimit: 15,
  },

  // Difficulty 10 (Very Hard) - $20,000,000, 15 seconds
  {
    id: 'q37',
    text: 'Who developed the first programmable computer?',
    options: ['Alan Turing', 'Charles Babbage', 'Konrad Zuse', 'Bill Gates'],
    correctAnswerIndex: 2,
    moneyValue: 20000000,
    timeLimit: 15,
  },
  {
    id: 'q38',
    text: 'What is the rarest blood type?',
    options: ['AB+', 'B-', 'AB-', 'O-'],
    correctAnswerIndex: 2,
    moneyValue: 20000000,
    timeLimit: 15,
  },
  {
    id: 'q39',
    text: 'Which element has the highest melting point?',
    options: ['Iron', 'Tungsten', 'Titanium', 'Uranium'],
    correctAnswerIndex: 1,
    moneyValue: 20000000,
    timeLimit: 15,
  },
  {
    id: 'q40',
    text: 'Which galaxy is closest to the Milky Way?',
    options: ['Triangulum', 'Messier 87', 'Andromeda', 'Large Magellanic Cloud'],
    correctAnswerIndex: 2,
    moneyValue: 20000000,
    timeLimit: 15,
  },
];

export const getQuestions = (): Question[] => {
  // Sort by moneyValue to ensure progression, which respects the difficulty order
  return [...sampleQuestions].sort((a, b) => a.moneyValue - b.moneyValue);
};

