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
  const statusRef = useRef<TestStatus>('idle');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [mode, setModeState] = useState<TestMode>(initialMode);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState<TypingStats>(() =>
    computeStats(initializeCharStates(generateWords(WORDS_COUNT)), 0)
  );

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
    setWords(newWords);
    setCharStates(initializeCharStates(newWords));
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStatus('idle');
    setElapsed(0);
    setStats(computeStats(initializeCharStates(newWords), 0));
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [clearTimer]);

  const setMode = useCallback((newMode: TestMode) => {
    setModeState(newMode);
    restart();
  }, [restart]);

  const handleInput = useCallback((value: string) => {
    if (statusRef.current === 'finished') return;

    if (statusRef.current === 'idle' && value.length > 0) {
      startTimer();
    }

    const prevValueLength = currentCharIndex + (value.endsWith(' ') ? 1 : 0);
    const newValueLength = value.length;

    if (newValueLength < prevValueLength) {
      if (value.endsWith(' ')) {
        if (currentWordIndex > 0) {
          setCurrentWordIndex((prev) => prev - 1);
          setCurrentCharIndex(words[currentWordIndex - 1]?.length || 0);
          
          setCharStates((prev) => {
            const newCharStates = [...prev];
            const currentWord = newCharStates[currentWordIndex];
            if (currentWord) {
              newCharStates[currentWordIndex] = currentWord.map((char) => ({
                ...char,
                status: 'idle',
              }));
            }
            return newCharStates;
          });
        }
      } else {
        setCurrentCharIndex((prev) => Math.max(0, prev - 1));
        
        setCharStates((prev) => {
          const newCharStates = [...prev];
          if (newCharStates[currentWordIndex]) {
            newCharStates[currentWordIndex] = [...prev[currentWordIndex]];
            const charIdx = currentCharIndex - 1;
            if (charIdx >= 0 && newCharStates[currentWordIndex][charIdx]) {
              newCharStates[currentWordIndex][charIdx] = {
                ...prev[currentWordIndex][charIdx],
                status: 'current',
              };
            }
            const nextCharIdx = currentCharIndex;
            if (nextCharIdx < newCharStates[currentWordIndex].length) {
              newCharStates[currentWordIndex][nextCharIdx] = {
                ...prev[currentWordIndex][nextCharIdx],
                status: 'idle',
              };
            }
          }
          return newCharStates;
        });
      }
      
      if (inputRef.current) {
        inputRef.current.value = value;
      }
      
      setCharStates((prev) => {
        setStats(computeStats(prev, elapsed));
        return prev;
      });
      return;
    }

    if (value.endsWith(' ')) {
      if (value.trim().length === 0 || currentCharIndex === 0) {
        setCharStates((prev) => {
          const newCharStates = [...prev];
          if (newCharStates[currentWordIndex] && newCharStates[currentWordIndex].length > 0) {
            newCharStates[currentWordIndex] = [...prev[currentWordIndex]];
            const expectedChar = words[currentWordIndex]?.[0];
            newCharStates[currentWordIndex][0] = {
              char: expectedChar || ' ',
              status: 'incorrect',
            };
          }
          return newCharStates;
        });
        
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        
        setCharStates((prev) => {
          setStats(computeStats(prev, elapsed));
          return prev;
        });
        return;
      }

      setCurrentWordIndex((prev) => {
        const nextWordIndex = prev + 1;
        setCurrentCharIndex(0);

        setCharStates((prevCharStates) => {
          const newCharStates = [...prevCharStates];
          if (nextWordIndex < newCharStates.length) {
            newCharStates[nextWordIndex] = newCharStates[nextWordIndex].map((char, idx) => ({
              ...char,
              status: idx === 0 ? 'current' : 'idle',
            }));
          }
          return newCharStates;
        });

        return nextWordIndex;
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else {
      setCurrentCharIndex((prevCharIndex) => {
        const typedChar = value[prevCharIndex];
        const expectedChar = words[currentWordIndex]?.[prevCharIndex];

        if (typedChar !== undefined && expectedChar !== undefined) {
          const isCorrect = typedChar === expectedChar;

          setCharStates((prev) => {
            const newCharStates = [...prev];
            newCharStates[currentWordIndex] = [...prev[currentWordIndex]];
            newCharStates[currentWordIndex][prevCharIndex] = {
              char: expectedChar,
              status: isCorrect ? 'correct' : 'incorrect',
            };
            return newCharStates;
          });

          const nextCharIndex = prevCharIndex + 1;

          if (words[currentWordIndex] && nextCharIndex < words[currentWordIndex].length) {
            setCharStates((prev) => {
              const newCharStates = [...prev];
              newCharStates[currentWordIndex] = [...prev[currentWordIndex]];
              newCharStates[currentWordIndex][nextCharIndex] = {
                char: words[currentWordIndex][nextCharIndex],
                status: 'current',
              };
              return newCharStates;
            });
          }

          return nextCharIndex;
        }
        return prevCharIndex;
      });
    }

    setCharStates((prev) => {
      setStats(computeStats(prev, elapsed));
      return prev;
    });
  }, [startTimer, words, currentWordIndex, elapsed]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

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