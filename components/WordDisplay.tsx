'use client';

import React from 'react';
import { CharState } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface WordRowProps {
  charStates: CharState[];
  isDark?: boolean;
}

const themeCursorMap: Record<KeyboardTheme, { dark: { bg: string; border: string }; light: { bg: string; border: string } }> = {
  Classic: {
    dark: { bg: 'bg-amber-500/20 text-white', border: 'border-amber-500' },
    light: { bg: 'bg-amber-500/15 text-zinc-900', border: 'border-amber-600' },
  },
  Mint: {
    dark: { bg: 'bg-emerald-500/20 text-emerald-100', border: 'border-emerald-400' },
    light: { bg: 'bg-emerald-500/15 text-emerald-950', border: 'border-emerald-600' },
  },
  Royal: {
    dark: { bg: 'bg-blue-500/20 text-blue-100', border: 'border-blue-400' },
    light: { bg: 'bg-blue-500/15 text-blue-950', border: 'border-blue-600' },
  },
  Dolch: {
    dark: { bg: 'bg-cyan-500/20 text-cyan-100', border: 'border-cyan-400' },
    light: { bg: 'bg-cyan-500/15 text-cyan-950', border: 'border-cyan-600' },
  },
  Sand: {
    dark: { bg: 'bg-amber-600/20 text-amber-100', border: 'border-amber-500' },
    light: { bg: 'bg-amber-750/15 text-[#451a03]', border: 'border-amber-700' },
  },
  Scarlet: {
    dark: { bg: 'bg-red-500/20 text-red-100', border: 'border-red-400' },
    light: { bg: 'bg-red-500/15 text-red-950', border: 'border-red-600' },
  },
};

const WordRow = React.memo(function WordRow({ charStates, isDark = true }: WordRowProps) {
  const { settings } = useKeyboardSettings();
  const themeStyles = themeCursorMap[settings.theme] || themeCursorMap.Classic;
  const cursorStyle = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <span className="inline-block select-none">
      {charStates.map((charState, index) => (
        <span
          key={index}
          className={`
            inline transition-all duration-350 ease-in-out
            ${charState.status === 'idle' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
            ${charState.status === 'correct' ? 'text-green-500' : ''}
            ${charState.status === 'incorrect' ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : ''}
            ${charState.status === 'current' ? `${cursorStyle.bg} ${cursorStyle.border} border-l-2` : ''}
          `}
        >
          {charState.char}
        </span>
      ))}
    </span>
  );
});

WordRow.displayName = 'WordRow';

interface WordDisplayProps {
  charStates: CharState[][];
  words: string[];
  currentWordIndex: number;
  isDark?: boolean;
  activeWordRef: React.RefObject<HTMLSpanElement | null>;
}

const WordDisplay = React.memo(function WordDisplay({ 
  charStates, 
  words, 
  currentWordIndex, 
  isDark = true,
  activeWordRef
}: WordDisplayProps) {
  
  return (
    <div 
      className="text-justify leading-relaxed text-lg sm:text-xl md:text-2xl font-['JetBrains_Mono',_monospace] w-full"
      style={{ textAlignLast: 'left', textJustify: 'inter-word' }}
    >
      {words.map((word, index) => {
        const isActive = index === currentWordIndex;
        return (
          <span 
            key={index} 
            ref={isActive ? activeWordRef : undefined}
            className="inline-block mx-[0.35em] my-1"
          >
            <WordRow
              charStates={charStates[index] || []}
              isDark={isDark}
            />
          </span>
        );
      })}
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;