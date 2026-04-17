'use client';

import React from 'react';
import { CharState } from '@/types';

interface WordRowProps {
  charStates: CharState[];
}

const WordRow = React.memo(function WordRow({ charStates }: WordRowProps) {
  return (
    <span className="inline-block mr-4 mb-2">
      {charStates.map((charState, index) => (
        <span
          key={index}
          className={`
            inline transition-colors duration-75
            ${charState.status === 'idle' ? 'text-zinc-500' : ''}
            ${charState.status === 'correct' ? 'text-green-400' : ''}
            ${charState.status === 'incorrect' ? 'text-red-400 bg-red-900/20' : ''}
            ${charState.status === 'current' ? 'text-white border-l-2 border-amber-500' : ''}
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
}

const WordDisplay = React.memo(function WordDisplay({ charStates, words }: WordDisplayProps) {
  return (
    <div className="flex flex-wrap leading-relaxed text-xl font-['JetBrains_Mono',_monospace]">
      {words.map((word, index) => (
        <WordRow
          key={index}
          charStates={charStates[index] || []}
        />
      ))}
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;