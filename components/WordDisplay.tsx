'use client';

import React from 'react';
import { CharState } from '@/types';

interface WordRowProps {
  charStates: CharState[];
  isDark?: boolean;
}

const WordRow = React.memo(function WordRow({ charStates, isDark = true }: WordRowProps) {
  return (
    <span className="inline-block mr-4 mb-2">
      {charStates.map((charState, index) => (
        <span
          key={index}
          className={`
            inline transition-colors duration-75
            ${charState.status === 'idle' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
            ${charState.status === 'correct' ? 'text-green-500' : ''}
            ${charState.status === 'incorrect' ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : ''}
            ${charState.status === 'current' ? 'text-zinc-900 dark:text-white bg-amber-200/50 dark:bg-amber-500/20 border-l-2 border-amber-500' : ''}
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
  isDark?: boolean;
}

const WordDisplay = React.memo(function WordDisplay({ charStates, words, isDark = true }: WordDisplayProps) {
  return (
    <div className="flex flex-wrap leading-relaxed text-lg sm:text-xl md:text-2xl font-['JetBrains_Mono',_monospace]">
      {words.map((word, index) => (
        <WordRow
          key={index}
          charStates={charStates[index] || []}
          isDark={isDark}
        />
      ))}
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;