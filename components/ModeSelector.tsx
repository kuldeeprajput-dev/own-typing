'use client';

import React from 'react';
import { TestMode } from '@/types';

interface ModeSelectorProps {
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
}

const modes: TestMode[] = [15, 30, 60];

const ModeSelector = React.memo(function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${mode === m 
              ? 'border-2 border-amber-500 text-amber-500 bg-amber-500/10' 
              : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500'}
          `}
        >
          {m}s
        </button>
      ))}
    </div>
  );
});

export default ModeSelector;