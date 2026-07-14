import { TypingCounters, TypingStats } from '@/types';

const MIN_WPM_SAMPLE_SECONDS = 1;

export function calculateWpm(chars: number, elapsedSeconds: number): number {
  if (chars <= 0 || elapsedSeconds < MIN_WPM_SAMPLE_SECONDS) return 0;
  return Math.round((chars / 5) / (elapsedSeconds / 60));
}

export function calculateAccuracy(correctKeystrokes: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  const boundedCorrectKeystrokes = Math.min(
    Math.max(correctKeystrokes, 0),
    totalTyped,
  );
  return Math.round((boundedCorrectKeystrokes / totalTyped) * 100);
}

export function computeStats(
  counters: TypingCounters,
  elapsedSeconds: number,
): TypingStats {
  const elapsed = Math.max(0, elapsedSeconds);
  const totalKeystrokes = Math.max(0, counters.totalKeystrokes);
  const correctKeystrokes = Math.min(
    Math.max(0, counters.correctKeystrokes),
    totalKeystrokes,
  );
  const correctChars = Math.max(0, counters.correctChars);

  return {
    wpm: calculateWpm(correctChars, elapsed),
    rawWpm: calculateWpm(totalKeystrokes, elapsed),
    accuracy: calculateAccuracy(correctKeystrokes, totalKeystrokes),
    elapsed,
    correctChars,
    totalTyped: totalKeystrokes,
    correctKeystrokes,
    errors: totalKeystrokes - correctKeystrokes,
  };
}
