import { CharState, TypingStats } from '@/types';

export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

export function computeStats(charStates: CharState[][], elapsed: number): TypingStats {
  let correctChars = 0;
  let totalTyped = 0;

  for (const line of charStates) {
    for (const charState of line) {
      if (charState.status === 'correct') {
        correctChars++;
        totalTyped++;
      } else if (charState.status === 'incorrect') {
        totalTyped++;
      }
    }
  }

  return {
    wpm: calculateWpm(correctChars, elapsed),
    accuracy: calculateAccuracy(correctChars, totalTyped),
    elapsed,
    correctChars,
    totalTyped,
  };
}