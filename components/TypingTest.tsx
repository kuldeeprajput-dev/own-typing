'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { TestMode, TestOptions } from '@/types';
import ModeSelector from './ModeSelector';
import Stats from './Stats';
import WordDisplay from './WordDisplay';
import ThemeToggle from './ThemeToggle';

export default function TypingTest() {
  const [isFocused, setIsFocused] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    charStates,
    words,
    status,
    mode,
    options,
    stats,
    elapsed,
    handleInput,
    restart,
    setMode,
    setOptions,
    inputRef,
  } = useTypingEngine(30);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

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

  const handleOptionsChange = useCallback(
    (newOptions: Partial<TestOptions>) => {
      setOptions(newOptions);
    },
    [setOptions]
  );

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  const handleTryAgain = useCallback(() => {
    restart();
    inputRef.current?.focus();
  }, [restart, inputRef]);

  if (!mounted) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300 ${isDark ? 'bg-[#0f0f0f] text-zinc-100' : 'bg-gray-100 text-gray-900'}`}>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300 ${isDark ? 'bg-[#0f0f0f] text-zinc-100' : 'bg-gray-100 text-gray-900'}`}
      onClick={() => inputRef.current?.focus()}
    >
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      <div className={`transition-all duration-300 ${status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <ModeSelector 
          mode={mode} 
          options={options}
          onModeChange={handleModeChange} 
          onOptionsChange={handleOptionsChange}
          isDark={isDark} 
        />
      </div>

      <Stats stats={stats} mode={mode} elapsed={elapsed} bestWpm={null} isDark={isDark} />

      {status !== 'finished' && (
        <div
          ref={containerRef}
          className="relative w-full max-w-7xl cursor-text text-center mt-8 px-4"
          style={{ 
            height: '6.6rem', 
            overflow: 'hidden',
          }}
        >
          <WordDisplay charStates={charStates} words={words} isDark={isDark} />
          {!isFocused && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-zinc-800/80 text-zinc-400' : 'bg-gray-200/80 text-gray-600'}`}>
                Click to focus
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'finished' && (
        <div className="flex flex-col items-center mt-8">
          <div className="flex gap-12 mb-8">
            <div className="text-center">
              <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'} uppercase mb-1`}>WPM</div>
              <div className="text-6xl font-bold text-amber-500">{stats.wpm}</div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'} uppercase mb-1`}>Accuracy</div>
              <div className="text-6xl font-bold">{stats.accuracy}%</div>
            </div>
          </div>
          <button
            onClick={handleTryAgain}
            className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-all transform hover:scale-105"
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
          className={`mt-8 px-4 py-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Restart
        </button>
      )}
    </div>
  );
}