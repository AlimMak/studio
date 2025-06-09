
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  moneyValue: number;
  timeLimit: number; // in seconds
  originalText?: string; 
}

export interface Team {
  id: string;
  name: string;
  score: number;
  lifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askYourTeam: boolean; // Renamed from audiencePoll
  };
}

export type GamePhase = 'SETUP' | 'PLAYING' | 'GAME_OVER';

export interface TeamPollData { // Renamed from AudiencePollData
  optionIndex: number;
  percentage: number;
}
