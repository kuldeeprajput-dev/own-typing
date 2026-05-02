export type CharStatus = 'idle' | 'correct' | 'incorrect' | 'current';

export interface CharState {
  char: string;
  status: CharStatus;
}

export type TestMode = 15 | 30 | 60;

export type TestStatus = 'idle' | 'running' | 'finished';

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsed: number;
  correctChars: number;
  totalTyped: number;
}