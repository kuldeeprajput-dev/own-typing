const STORAGE_KEY = 'owntype_best_wpm';

export function getBestWpm(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : null;
}

export function setBestWpm(wpm: number): void {
  if (typeof window === 'undefined') return;
  const current = getBestWpm();
  if (current === null || wpm > current) {
    localStorage.setItem(STORAGE_KEY, wpm.toString());
  }
}