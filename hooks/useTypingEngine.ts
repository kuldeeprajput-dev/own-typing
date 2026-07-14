import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CharState,
  TestMode,
  TestOptions,
  TestStatus,
  TypingCounters,
  TypingHistoryPoint,
  TypingStats,
} from '@/types';
import { generateWords } from '@/utils/words';
import { computeStats } from '@/utils/typing';
import { playErrorSound, playSound } from '@/components/VirtualKeyboard';

const WORDS_COUNT = 100;
const MAX_EXTRA_CHARS = 10;
const TIMER_RETRY_DELAY_MS = 4;

const DEFAULT_OPTIONS: TestOptions = {
  punctuation: false,
  numbers: false,
  capitals: false,
};

// The first render must match on the server and client. Random words are used
// only after an explicit restart or settings change.
const INITIAL_WORD_SEQUENCE = [
  'the',
  'quick',
  'brown',
  'fox',
  'jumps',
  'over',
  'the',
  'calm',
  'river',
  'while',
  'people',
  'learn',
  'to',
  'type',
  'with',
  'steady',
  'hands',
  'and',
  'clear',
  'focus',
  'every',
  'small',
  'step',
  'builds',
  'speed',
] as const;

interface EngineCounters {
  completedCorrectChars: number;
  activeCorrectChars: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
}

interface EngineState {
  words: string[];
  charStates: CharState[][];
  currentWordIndex: number;
  currentCharIndex: number;
  inputValue: string;
  status: TestStatus;
  mode: TestMode;
  options: TestOptions;
  stats: TypingStats;
  elapsed: number;
  history: TypingHistoryPoint[];
  startedAtMs: number | null;
  lastHistorySecond: number;
  counters: EngineCounters;
}

type InputFeedback =
  | { type: 'key'; code: string }
  | { type: 'error' }
  | null;

interface InputTransition {
  state: EngineState;
  feedback: InputFeedback;
}

interface BuiltWord {
  chars: CharState[];
  correctChars: number;
}

interface EditRange {
  insertedStart: number;
  insertedEnd: number;
  deletedCount: number;
}

function createHydrationSafeWords(): string[] {
  return Array.from(
    { length: WORDS_COUNT },
    (_, index) => INITIAL_WORD_SEQUENCE[index % INITIAL_WORD_SEQUENCE.length],
  );
}

function getSoundCodeForChar(char: string): string {
  if (char === ' ') return 'Space';
  if (/^[a-zA-Z]$/.test(char)) return `Key${char.toUpperCase()}`;
  if (/^[0-9]$/.test(char)) return `Digit${char}`;

  const punctuationMap: Record<string, string> = {
    '!': 'Digit1',
    '@': 'Digit2',
    '#': 'Digit3',
    '$': 'Digit4',
    '%': 'Digit5',
    '^': 'Digit6',
    '&': 'Digit7',
    '*': 'Digit8',
    '(': 'Digit9',
    ')': 'Digit0',
    ';': 'Semicolon',
    ':': 'Semicolon',
    "'": 'Quote',
    '"': 'Quote',
    ',': 'Comma',
    '<': 'Comma',
    '.': 'Period',
    '>': 'Period',
    '/': 'Slash',
    '?': 'Slash',
    '-': 'Minus',
    '_': 'Minus',
    '=': 'Equal',
    '+': 'Equal',
    '[': 'BracketLeft',
    '{': 'BracketLeft',
    ']': 'BracketRight',
    '}': 'BracketRight',
    '\\': 'Backslash',
    '|': 'Backslash',
    '`': 'Backquote',
    '~': 'Backquote',
  };

  return punctuationMap[char] ?? 'Space';
}

function buildWordChars(target: string, typed: string, isActive: boolean): BuiltWord {
  let correctChars = 0;
  const chars = target.split('').map<CharState>((char, index) => {
    if (index < typed.length) {
      const isCorrect = typed[index] === char;
      if (isCorrect) correctChars += 1;
      return { char, status: isCorrect ? 'correct' : 'incorrect' };
    }

    return {
      char,
      status: isActive && index === typed.length ? 'current' : 'idle',
    };
  });

  for (const char of typed.slice(target.length)) {
    chars.push({ char, status: 'incorrect' });
  }

  return { chars, correctChars };
}

function initializeCharStates(words: string[]): CharState[][] {
  return words.map((word, index) => buildWordChars(word, '', index === 0).chars);
}

function getTypingCounters(counters: EngineCounters): TypingCounters {
  return {
    correctChars: counters.completedCorrectChars + counters.activeCorrectChars,
    totalKeystrokes: counters.totalKeystrokes,
    correctKeystrokes: counters.correctKeystrokes,
  };
}

function createEngineState(
  mode: TestMode,
  options: TestOptions,
  words: string[],
): EngineState {
  const counters: EngineCounters = {
    completedCorrectChars: 0,
    activeCorrectChars: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
  };

  return {
    words,
    charStates: initializeCharStates(words),
    currentWordIndex: 0,
    currentCharIndex: 0,
    inputValue: '',
    status: 'idle',
    mode,
    options: { ...options },
    stats: computeStats(getTypingCounters(counters), 0),
    elapsed: 0,
    history: [],
    startedAtMs: null,
    lastHistorySecond: 0,
    counters,
  };
}

function createRandomEngineState(mode: TestMode, options: TestOptions): EngineState {
  return createEngineState(mode, options, generateWords(WORDS_COUNT, options));
}

function getElapsedSeconds(state: EngineState, nowMs: number): number {
  if (state.startedAtMs === null) return 0;
  return Math.max(0, (nowMs - state.startedAtMs) / 1000);
}

function appendHistoryThrough(
  state: EngineState,
  throughSecond: number,
): {
  history: TypingHistoryPoint[];
  lastHistorySecond: number;
} {
  if (throughSecond <= state.lastHistorySecond) {
    return {
      history: state.history,
      lastHistorySecond: state.lastHistorySecond,
    };
  }

  const history = [...state.history];
  const counters = getTypingCounters(state.counters);

  for (
    let second = state.lastHistorySecond + 1;
    second <= throughSecond;
    second += 1
  ) {
    const snapshot = computeStats(counters, second);
    history.push({
      second,
      wpm: snapshot.wpm,
      rawWpm: snapshot.rawWpm,
    });
  }

  return { history, lastHistorySecond: throughSecond };
}

function advanceClock(state: EngineState, nowMs: number): EngineState {
  if (state.status !== 'running' || state.startedAtMs === null) return state;

  const actualElapsed = getElapsedSeconds(state, nowMs);
  const cappedElapsed = Math.min(actualElapsed, state.mode);
  const completedSeconds = Math.min(Math.floor(cappedElapsed), state.mode);
  const historyUpdate = appendHistoryThrough(state, completedSeconds);
  const isFinished = actualElapsed >= state.mode;
  const visibleElapsed = isFinished ? state.mode : completedSeconds;

  if (
    !isFinished &&
    visibleElapsed === state.elapsed &&
    historyUpdate.history === state.history
  ) {
    return state;
  }

  return {
    ...state,
    status: isFinished ? 'finished' : state.status,
    elapsed: visibleElapsed,
    history: historyUpdate.history,
    lastHistorySecond: historyUpdate.lastHistorySecond,
    stats: computeStats(getTypingCounters(state.counters), visibleElapsed),
  };
}

function getEditRange(previousValue: string, nextValue: string): EditRange {
  let start = 0;
  const sharedLength = Math.min(previousValue.length, nextValue.length);

  while (
    start < sharedLength &&
    previousValue[start] === nextValue[start]
  ) {
    start += 1;
  }

  let previousEnd = previousValue.length;
  let nextEnd = nextValue.length;

  while (
    previousEnd > start &&
    nextEnd > start &&
    previousValue[previousEnd - 1] === nextValue[nextEnd - 1]
  ) {
    previousEnd -= 1;
    nextEnd -= 1;
  }

  return {
    insertedStart: start,
    insertedEnd: nextEnd,
    deletedCount: previousEnd - start,
  };
}

function addFinalHistoryPoint(
  history: TypingHistoryPoint[],
  elapsed: number,
  stats: TypingStats,
): TypingHistoryPoint[] {
  const second = Math.round(elapsed * 1000) / 1000;
  const point = { second, wpm: stats.wpm, rawWpm: stats.rawWpm };
  const lastPoint = history.at(-1);

  if (lastPoint?.second === second) {
    return [...history.slice(0, -1), point];
  }

  return [...history, point];
}

function applyInput(
  originalState: EngineState,
  value: string,
  nowMs: number,
): InputTransition {
  if (originalState.status === 'finished') {
    return { state: originalState, feedback: null };
  }

  let state = originalState;

  if (state.status === 'idle') {
    if (value.trim().length === 0) return { state, feedback: null };
    state = {
      ...state,
      status: 'running',
      startedAtMs: nowMs,
    };
  } else {
    state = advanceClock(state, nowMs);
    if (state.status === 'finished') {
      return { state, feedback: null };
    }
  }

  const edit = getEditRange(state.inputValue, value);
  const nextCharStates = [...state.charStates];
  let wordIndex = state.currentWordIndex;
  let typed = '';
  let segmentOverflowed = false;
  let completedCorrectChars = state.counters.completedCorrectChars;
  let totalKeystrokes = state.counters.totalKeystrokes;
  let correctKeystrokes = state.counters.correctKeystrokes;
  let feedback: InputFeedback = null;
  let finished = false;
  let finalWordCharIndex = 0;

  for (let inputIndex = 0; inputIndex < value.length; inputIndex += 1) {
    const char = value[inputIndex];
    const target = state.words[wordIndex];
    if (!target) {
      finished = true;
      break;
    }

    const isInserted =
      inputIndex >= edit.insertedStart && inputIndex < edit.insertedEnd;

    if (char !== ' ') {
      const charIndex = typed.length;
      const isCorrect = charIndex < target.length && char === target[charIndex];

      if (isInserted) {
        totalKeystrokes += 1;
        if (isCorrect) correctKeystrokes += 1;
        feedback = isCorrect
          ? { type: 'key', code: getSoundCodeForChar(char) }
          : { type: 'error' };
      }

      if (typed.length < target.length + MAX_EXTRA_CHARS) {
        typed += char;
      } else {
        segmentOverflowed = true;
      }
      continue;
    }

    // Repeated or leading spaces do not advance the test.
    if (typed.length === 0) continue;

    const wordIsCorrect = !segmentOverflowed && typed === target;
    if (isInserted) {
      totalKeystrokes += 1;
      if (wordIsCorrect) correctKeystrokes += 1;
      feedback = wordIsCorrect
        ? { type: 'key', code: 'Space' }
        : { type: 'error' };
    }

    const completedWord = buildWordChars(target, typed, false);
    nextCharStates[wordIndex] = completedWord.chars;
    completedCorrectChars += completedWord.correctChars;

    // There is no target space after the final word.
    if (wordIsCorrect && wordIndex < state.words.length - 1) {
      completedCorrectChars += 1;
    }

    finalWordCharIndex = typed.length;
    wordIndex += 1;

    if (wordIndex >= state.words.length) {
      finished = true;
      break;
    }

    typed = '';
    segmentOverflowed = false;
  }

  let activeCorrectChars = 0;
  if (!finished) {
    const activeWord = buildWordChars(state.words[wordIndex], typed, true);
    nextCharStates[wordIndex] = activeWord.chars;
    activeCorrectChars = activeWord.correctChars;
  }

  if (
    feedback === null &&
    edit.deletedCount > 0 &&
    edit.insertedStart === edit.insertedEnd
  ) {
    feedback = { type: 'key', code: 'Backspace' };
  }

  const counters: EngineCounters = {
    completedCorrectChars,
    activeCorrectChars,
    totalKeystrokes,
    correctKeystrokes,
  };
  const exactElapsed = getElapsedSeconds(state, nowMs);
  const stats = computeStats(getTypingCounters(counters), exactElapsed);

  if (finished) {
    return {
      state: {
        ...state,
        charStates: nextCharStates,
        currentWordIndex: state.words.length - 1,
        currentCharIndex: finalWordCharIndex,
        inputValue: '',
        status: 'finished',
        elapsed: exactElapsed,
        stats,
        history: addFinalHistoryPoint(state.history, exactElapsed, stats),
        counters,
      },
      feedback,
    };
  }

  return {
    state: {
      ...state,
      charStates: nextCharStates,
      currentWordIndex: wordIndex,
      currentCharIndex: typed.length,
      inputValue: typed,
      stats,
      counters,
    },
    feedback,
  };
}

function playInputFeedback(feedback: InputFeedback): void {
  if (!feedback) return;
  if (feedback.type === 'error') {
    playErrorSound();
    return;
  }
  playSound(feedback.code, 'down');
}

export function useTypingEngine(initialMode: TestMode = 30) {
  const [engine, setEngine] = useState<EngineState>(() =>
    createEngineState(initialMode, DEFAULT_OPTIONS, createHydrationSafeWords()),
  );
  const engineRef = useRef(engine);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEngine = useCallback((nextState: EngineState) => {
    if (nextState === engineRef.current) return;
    engineRef.current = nextState;
    setEngine(nextState);
  }, []);

  const handleInput = useCallback((value: string) => {
    const transition = applyInput(engineRef.current, value, performance.now());
    commitEngine(transition.state);
    playInputFeedback(transition.feedback);
  }, [commitEngine]);

  const restart = useCallback((nextOptions?: TestOptions) => {
    const current = engineRef.current;
    const options = nextOptions ?? current.options;
    commitEngine(createRandomEngineState(current.mode, options));
  }, [commitEngine]);

  const setMode = useCallback((mode: TestMode) => {
    const current = engineRef.current;
    commitEngine(createRandomEngineState(mode, current.options));
  }, [commitEngine]);

  const setOptions = useCallback((updates: Partial<TestOptions>) => {
    const current = engineRef.current;
    const options = { ...current.options, ...updates };
    commitEngine(createRandomEngineState(current.mode, options));
  }, [commitEngine]);

  useEffect(() => {
    if (engine.status !== 'running' || engine.startedAtMs === null) return;

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextTick = () => {
      const current = engineRef.current;
      if (
        cancelled ||
        current.status !== 'running' ||
        current.startedAtMs === null
      ) {
        return;
      }

      const nowMs = performance.now();
      const elapsed = getElapsedSeconds(current, nowMs);

      if (elapsed >= current.mode) {
        commitEngine(advanceClock(current, nowMs));
        return;
      }

      const nextSecond = Math.min(Math.floor(elapsed) + 1, current.mode);
      const targetMs = current.startedAtMs + nextSecond * 1000;
      const delayMs = Math.max(TIMER_RETRY_DELAY_MS, targetMs - nowMs);

      timerId = setTimeout(() => {
        if (cancelled) return;
        const nextState = advanceClock(engineRef.current, performance.now());
        commitEngine(nextState);
        if (nextState.status === 'running') scheduleNextTick();
      }, delayMs);
    };

    scheduleNextTick();

    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [commitEngine, engine.mode, engine.startedAtMs, engine.status]);

  return {
    charStates: engine.charStates,
    words: engine.words,
    status: engine.status,
    mode: engine.mode,
    options: engine.options,
    stats: engine.stats,
    elapsed: engine.elapsed,
    currentWordIndex: engine.currentWordIndex,
    currentCharIndex: engine.currentCharIndex,
    inputValue: engine.inputValue,
    handleInput,
    restart,
    setMode,
    setOptions,
    inputRef,
    history: engine.history,
  };
}
