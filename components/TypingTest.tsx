'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { TestMode } from '@/types';
import ModeSelector from './ModeSelector';
import Stats from './Stats';
import WordDisplay from './WordDisplay';

export default function TypingTest() {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useTypingEngine(30);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (status !== 'finished') {
        handleInput(e.target.value);
      }
    },
    [handleInput, status]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleModeChange = useCallback(
    (newMode: TestMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  const handleTryAgain = useCallback(() => {
    restart();
    inputRef.current?.focus();
  }, [restart, inputRef]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-zinc-100 p-4"
      onClick={() => inputRef.current?.focus()}
    >
      {(status === 'idle' || status === 'finished') && (
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
      )}

      <Stats stats={stats} mode={mode} elapsed={elapsed} bestWpm={null} />

      {status !== 'finished' && (
        <div
          ref={containerRef}
          className="relative w-full max-w-7xl cursor-text text-center mt-8"
          style={{ height: '6.5rem', overflow: 'hidden' }}
        >
          <WordDisplay charStates={charStates} words={words} />
          {!isFocused && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-zinc-800/80 rounded-lg text-zinc-400 text-sm">
                Click to focus
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'finished' && (
        <div className="flex flex-col items-center mt-8">
          <div className="text-4xl font-bold mb-2">{stats.wpm} WPM</div>
          <div className="text-zinc-400 mb-4">Accuracy: {stats.accuracy}%</div>
          <button
            onClick={handleTryAgain}
            className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        className="opacity-0 w-0 h-0"
        onChange={onInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        spellCheck={false}
      />

      {(status === 'idle' || status === 'running') && (
        <button
          onClick={handleRestart}
          className="mt-8 px-4 py-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Restart
        </button>
      )}
    </div>
  );
}