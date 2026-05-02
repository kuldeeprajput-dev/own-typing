import { useState, useRef, useCallback, useEffect } from 'react';
import { CharState, TestMode, TestStatus, TypingStats } from '@/types';
import { generateWords } from '@/utils/words';
import { computeStats } from '@/utils/typing';

const WORDS_COUNT = 100;

function initializeCharStates(words: string[]): CharState[][] {
  return words.map((word, wordIndex) => {
    const chars: CharState[] = word.split('').map((char, charIndex) => ({
      char,
      status: wordIndex === 0 && charIndex === 0 ? 'current' : 'idle',
    }));
    return chars;
  });
}

export function useTypingEngine(initialMode: TestMode = 30) {
  const [words, setWords] = useState<string[]>(() => generateWords(WORDS_COUNT));
  const [charStates, setCharStates] = useState<CharState[][]>(() =>
    initializeCharStates(generateWords(WORDS_COUNT))
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [status, setStatus] = useState<TestStatus>('idle');
  const [mode, setModeState] = useState<TestMode>(initialMode);
  const [elapsed, setElapsed] = useState(0);
  
  // Stats tracking
  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const [stats, setStats] = useState<TypingStats>(() => ({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    elapsed: 0,
    correctChars: 0,
    totalTyped: 0,
  }));

  const statusRef = useRef<TestStatus>('idle');
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const updateStats = useCallback((currentElapsed: number, currentChars: CharState[][]) => {
    const newStats = computeStats(
      currentChars,
      currentElapsed,
      totalKeystrokesRef.current,
      correctKeystrokesRef.current
    );
    setStats(newStats);
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    statusRef.current = 'running';
    setStatus('running');
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const newElapsed = (performance.now() - startTimeRef.current) / 1000;
        setElapsed(newElapsed);

        if (newElapsed >= mode) {
          clearTimer();
          statusRef.current = 'finished';
          setStatus('finished');
        }
      }
    }, 100);
  }, [mode, clearTimer]);

  const restart = useCallback(() => {
    clearTimer();
    statusRef.current = 'idle';
    const newWords = generateWords(WORDS_COUNT);
    const newCharStates = initializeCharStates(newWords);
    
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    
    setWords(newWords);
    setCharStates(newCharStates);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStatus('idle');
    setElapsed(0);
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      elapsed: 0,
      correctChars: 0,
      totalTyped: 0,
    });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [clearTimer]);

  const setMode = useCallback((newMode: TestMode) => {
    setModeState(newMode);
    restart();
  }, [restart]);

  const getElapsed = useCallback(() => {
    if (startTimeRef.current === null) return 0;
    return (performance.now() - startTimeRef.current) / 1000;
  }, []);

  const handleInput = useCallback((value: string) => {
    if (statusRef.current === 'finished') return;

    if (statusRef.current === 'idle' && value.length > 0) {
      startTimer();
    }

    const currentElapsed = getElapsed();
    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    // ... rest of the logic remains same but uses currentElapsed ...
    // Note: I will provide the full content here to ensure it's correct
    
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      if (typedWord.length === 0) {
        if (inputRef.current) inputRef.current.value = '';
        return;
      }

      totalKeystrokesRef.current += 1;
      correctKeystrokesRef.current += 1;

      const nextWordIdx = currentWordIndex + 1;
      
      if (nextWordIdx >= words.length) {
        clearTimer();
        statusRef.current = 'finished';
        setStatus('finished');
        return;
      }

      setCurrentWordIndex(nextWordIdx);
      setCurrentCharIndex(0);
      
      setCharStates(prev => {
        const next = [...prev];
        next[currentWordIndex] = next[currentWordIndex].map(c => 
          c.status === 'current' ? { ...c, status: 'idle' } : c
        );
        if (next[nextWordIdx]) {
          next[nextWordIdx] = next[nextWordIdx].map((c, i) => 
            i === 0 ? { ...c, status: 'current' } : c
          );
        }
        updateStats(currentElapsed, next);
        return next;
      });

      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    if (value.length < currentCharIndex) {
      setCurrentCharIndex(value.length);
      setCharStates(prev => {
        const next = [...prev];
        const wordChars = [...next[currentWordIndex]];
        if (wordChars[value.length]) {
          wordChars[value.length] = { ...wordChars[value.length], status: 'current' };
        }
        for (let i = value.length + 1; i < wordChars.length; i++) {
          wordChars[i] = { ...wordChars[i], status: 'idle' };
        }
        next[currentWordIndex] = wordChars.slice(0, Math.max(words[currentWordIndex].length, value.length));
        updateStats(currentElapsed, next);
        return next;
      });
      return;
    }

    const charTyped = value[value.length - 1];
    const expectedChar = currentWord[currentCharIndex];
    
    if (charTyped) {
      totalKeystrokesRef.current += 1;
      if (charTyped === expectedChar) {
        correctKeystrokesRef.current += 1;
      }

      setCharStates(prev => {
        const next = [...prev];
        const wordChars = [...next[currentWordIndex]];
        
        if (currentCharIndex < currentWord.length) {
          wordChars[currentCharIndex] = {
            char: expectedChar,
            status: charTyped === expectedChar ? 'correct' : 'incorrect'
          };
          if (currentCharIndex + 1 < currentWord.length) {
            wordChars[currentCharIndex + 1] = {
              ...wordChars[currentCharIndex + 1],
              status: 'current'
            };
          }
        } else {
          wordChars.push({ char: charTyped, status: 'incorrect' });
        }
        
        next[currentWordIndex] = wordChars;
        updateStats(currentElapsed, next);
        return next;
      });
      
      setCurrentCharIndex(value.length);
    }
  }, [words, currentWordIndex, currentCharIndex, startTimer, getElapsed, updateStats]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Sync stats when elapsed changes
  useEffect(() => {
    if (status === 'running') {
      updateStats(elapsed, charStates);
    }
  }, [elapsed, status, updateStats]); // Removed charStates from dependency to avoid infinite loop, using current charStates in updateStats

  return {
    charStates,
    words,
    status,
    mode,
    stats,
    elapsed,
    handleInput,
    restart,
    setMode,
    inputRef,
  };
}