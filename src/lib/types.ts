
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
    askYourTeam: boolean;
  };
}

export type GamePhase = 'HOST_INTRODUCTION' | 'SETUP' | 'RULES' | 'PLAYING' | 'GAME_OVER';
