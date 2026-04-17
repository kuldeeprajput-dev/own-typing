'use client';

import React from 'react';
import { TypingStats, TestMode } from '@/types';

interface StatsProps {
  stats: TypingStats;
  mode: TestMode;
  elapsed: number;
  bestWpm: number | null;
  isDark?: boolean;
}

const Stats = React.memo(function Stats({ stats, mode, elapsed, bestWpm, isDark = true }: StatsProps) {
  const timeRemaining = Math.max(0, Math.floor(mode - elapsed));

  return (
    <div className="flex flex-col items-center mb-6 font-['JetBrains_Mono',_monospace]">
      <div className="flex gap-12 text-3xl font-bold">
        <div className={isDark ? 'text-zinc-100' : 'text-gray-900'}>
          <span className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-lg mr-1`}>WPM</span>
          {stats.wpm}
        </div>
        <div className={isDark ? 'text-zinc-100' : 'text-gray-900'}>
          <span className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-lg mr-1`}>ACC</span>
          {stats.accuracy}%
        </div>
        <div className={isDark ? 'text-zinc-100' : 'text-gray-900'}>
          <span className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-lg mr-1`}>TIME</span>
          {timeRemaining}s
        </div>
      </div>
      {bestWpm !== null && (
        <div className="text-amber-500 text-sm mt-2">Best: {bestWpm} WPM</div>
      )}
    </div>
  );
});

export default Stats;