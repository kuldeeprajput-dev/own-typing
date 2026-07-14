'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { TestMode, TestOptions } from '@/types';
import ModeSelector from './ModeSelector';
import Stats from './Stats';
import WordDisplay from './WordDisplay';
import ThemeToggle from './ThemeToggle';
import VirtualKeyboard from './VirtualKeyboard';
import KeyboardSettingsModal from './KeyboardSettingsModal';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface ThemeStyles {
  bg: string;
  text: string;
  accentText: string;
  tryAgainBtn: string;
  tryAgainHover: string;
  restartBtn: string;
  focusCard: string;
}

const themeStylesMap: Record<KeyboardTheme, { dark: ThemeStyles; light: ThemeStyles }> = {
  Classic: {
    dark: {
      bg: 'bg-[#0f0f0f]',
      text: 'text-zinc-100',
      accentText: 'text-amber-500',
      tryAgainBtn: 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-zinc-500 hover:text-zinc-300',
      focusCard: 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/50',
    },
    light: {
      bg: 'bg-[#fafafa]',
      text: 'text-zinc-900',
      accentText: 'text-amber-600',
      tryAgainBtn: 'bg-amber-600 text-white hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-zinc-400 hover:text-zinc-650',
      focusCard: 'bg-zinc-200/85 text-zinc-600 border border-zinc-300/50',
    },
  },
  Mint: {
    dark: {
      bg: 'bg-[#0c1815]',
      text: 'text-[#d1fae5]',
      accentText: 'text-emerald-400',
      tryAgainBtn: 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-emerald-600/70 hover:text-emerald-300',
      focusCard: 'bg-[#0e211e]/90 text-emerald-300/80 border border-emerald-950/50',
    },
    light: {
      bg: 'bg-[#f0fdf4]',
      text: 'text-[#064e3b]',
      accentText: 'text-emerald-600',
      tryAgainBtn: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(5,150,105,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-emerald-600/50 hover:text-emerald-800',
      focusCard: 'bg-emerald-100/90 text-emerald-850 border border-emerald-250',
    },
  },
  Royal: {
    dark: {
      bg: 'bg-[#070b13]',
      text: 'text-[#dbeafe]',
      accentText: 'text-blue-400',
      tryAgainBtn: 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-blue-500/70 hover:text-blue-300',
      focusCard: 'bg-[#0a0f1d]/90 text-blue-300/80 border border-blue-950/50',
    },
    light: {
      bg: 'bg-[#f0f7ff]',
      text: 'text-[#1e3a8a]',
      accentText: 'text-blue-600',
      tryAgainBtn: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-blue-500/50 hover:text-blue-800',
      focusCard: 'bg-blue-100/90 text-blue-850 border border-blue-250',
    },
  },
  Dolch: {
    dark: {
      bg: 'bg-[#181818]',
      text: 'text-[#e5e7eb]',
      accentText: 'text-cyan-400',
      tryAgainBtn: 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-zinc-500 hover:text-zinc-300',
      focusCard: 'bg-[#1c1c1c]/90 text-zinc-400 border border-zinc-800/80',
    },
    light: {
      bg: 'bg-[#f3f4f6]',
      text: 'text-[#111827]',
      accentText: 'text-cyan-600',
      tryAgainBtn: 'bg-cyan-600 text-white hover:bg-cyan-550 shadow-[0_0_20px_rgba(8,145,178,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-zinc-400 hover:text-zinc-700',
      focusCard: 'bg-zinc-200/90 text-zinc-650 border border-zinc-300',
    },
  },
  Sand: {
    dark: {
      bg: 'bg-[#14120e]',
      text: 'text-[#f5f5dc]',
      accentText: 'text-amber-500',
      tryAgainBtn: 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-[#8c7853]/70 hover:text-[#f5f5dc]',
      focusCard: 'bg-[#1f1a14]/90 text-[#8c7853] border border-[#3e3427]/80',
    },
    light: {
      bg: 'bg-[#fdfbf7]',
      text: 'text-[#451a03]',
      accentText: 'text-amber-700',
      tryAgainBtn: 'bg-amber-755 text-white hover:bg-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-[#8c7853]/60 hover:text-[#451a03]',
      focusCard: 'bg-[#ebdcc3]/90 text-[#8c7853] border border-[#ebdcc3]/85',
    },
  },
  Scarlet: {
    dark: {
      bg: 'bg-[#140606]',
      text: 'text-[#ffe4e6]',
      accentText: 'text-red-400',
      tryAgainBtn: 'bg-red-500 text-white hover:bg-red-450 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-red-700/70 hover:text-[#ffe4e6]',
      focusCard: 'bg-[#1e0a0a]/90 text-red-400/80 border border-red-950/80',
    },
    light: {
      bg: 'bg-[#fff5f5]',
      text: 'text-[#7f1d1d]',
      accentText: 'text-red-600',
      tryAgainBtn: 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.15)]',
      tryAgainHover: 'hover:scale-105 active:scale-95',
      restartBtn: 'text-red-500/50 hover:text-red-800',
      focusCard: 'bg-red-100/90 text-red-850 border border-red-250',
    },
  },
};

export default function TypingTest() {
  const [isFocused, setIsFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  
  const { settings } = useKeyboardSettings();
  const isDark = settings.isDark;
  const themeStyles = themeStylesMap[settings.theme] || themeStylesMap.Classic;
  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const {
    charStates,
    words,
    status,
    mode,
    options,
    stats,
    elapsed,
    currentWordIndex,
    inputValue,
    handleInput,
    restart,
    setMode,
    setOptions,
    inputRef,
  } = useTypingEngine(30);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeWordEl = activeWordRef.current;
      const containerEl = containerRef.current;
      
      const wordTop = activeWordEl.offsetTop;
      const wordHeight = activeWordEl.offsetHeight;
      const containerHeight = containerEl.clientHeight;
      
      const targetScrollTop = wordTop - (containerHeight / 2) + (wordHeight / 2);
      
      containerEl.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }
  }, [currentWordIndex]);

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

  return (
    <div 
      className={`flex flex-col items-center justify-center h-screen overflow-hidden p-4 transition-all duration-500 ease-in-out ${styles.bg} ${styles.text}`}
      onClick={() => inputRef.current?.focus()}
    >
      <ThemeToggle />
      
      <KeyboardSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDark={isDark} 
      />

      <div className={`transition-all duration-300 ${status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <ModeSelector 
          mode={mode} 
          options={options}
          onModeChange={handleModeChange} 
          onOptionsChange={handleOptionsChange}
          onKeyboardSettingsClick={() => setIsSettingsOpen(true)}
          isDark={isDark} 
        />
      </div>

      <Stats stats={stats} mode={mode} elapsed={elapsed} bestWpm={null} isDark={isDark} />

      {status !== 'finished' && (
        <div
          ref={containerRef}
          className="relative w-full max-w-[1400px] cursor-text text-center mt-6 px-4 overflow-hidden h-[6.5rem] sm:h-[7.5rem] md:h-[9.5rem]"
        >
          <WordDisplay 
            charStates={charStates} 
            words={words} 
            currentWordIndex={currentWordIndex} 
            isDark={isDark} 
            activeWordRef={activeWordRef}
          />
          {!isFocused && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`px-4 py-2 rounded-lg text-sm transition-all duration-500 ease-in-out ${styles.focusCard}`}>
                Click to focus
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'finished' && (
        <div className="flex flex-col items-center mt-6">
          <div className="flex gap-8 sm:gap-12 mb-8">
            <div className="text-center">
              <div className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'} uppercase mb-1`}>WPM</div>
              <div className={`text-5xl sm:text-6xl font-bold transition-all duration-500 ease-in-out ${styles.accentText}`}>{stats.wpm}</div>
            </div>
            <div className="text-center">
              <div className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'} uppercase mb-1`}>Accuracy</div>
              <div className="text-5xl sm:text-6xl font-bold transition-all duration-500 ease-in-out">{stats.accuracy}%</div>
            </div>
          </div>
          <button
            onClick={handleTryAgain}
            className={`px-8 py-3 font-bold rounded-lg transition-all duration-500 ease-in-out transform ${styles.tryAgainBtn} ${styles.tryAgainHover}`}
          >
            Try Again
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 w-1 h-1 pointer-events-none"
        onChange={onInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />

      {(status === 'idle' || status === 'running') && (
        <button
          onClick={handleRestart}
          className={`mt-6 px-4 py-2 transition-all duration-500 ease-in-out ${styles.restartBtn}`}
        >
          Restart
        </button>
      )}

      <div className="mt-6 w-full flex justify-center">
        <VirtualKeyboard />
      </div>
    </div>
  );
}