export type CharStatus = 'idle' | 'correct' | 'incorrect' | 'current';

export interface CharState {
  char: string;
  status: CharStatus;
}

export type TestMode = 15 | 30 | 60;

export interface TestOptions {
  punctuation: boolean;
  numbers: boolean;
  capitals: boolean;
}

export type TestStatus = 'idle' | 'running' | 'finished';

export interface TypingCounters {
  correctChars: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
}

export interface TypingHistoryPoint {
  second: number;
  wpm: number;
  rawWpm: number;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsed: number;
  correctChars: number;
  totalTyped: number;
  correctKeystrokes: number;
  errors: number;
}
