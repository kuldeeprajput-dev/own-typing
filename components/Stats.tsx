'use client';

import React from 'react';
import { TypingStats, TestMode } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface StatsProps {
  stats: TypingStats;
  mode: TestMode;
  elapsed: number;
  bestWpm: number | null;
  isDark?: boolean;
}

const themeStatsStyles: Record<KeyboardTheme, { dark: { accent: string; label: string; text: string }; light: { accent: string; label: string; text: string } }> = {
  Classic: {
    dark: { accent: 'text-amber-500', label: 'text-zinc-600', text: 'text-zinc-100' },
    light: { accent: 'text-amber-600', label: 'text-zinc-400', text: 'text-[#151515]' },
  },
  Mint: {
    dark: { accent: 'text-emerald-400', label: 'text-emerald-600', text: 'text-[#d1fae5]' },
    light: { accent: 'text-emerald-600', label: 'text-emerald-500/80', text: 'text-[#064e3b]' },
  },
  Royal: {
    dark: { accent: 'text-blue-400', label: 'text-blue-550', text: 'text-[#dbeafe]' },
    light: { accent: 'text-blue-600', label: 'text-blue-500/80', text: 'text-[#1e3a8a]' },
  },
  Dolch: {
    dark: { accent: 'text-cyan-400', label: 'text-zinc-550', text: 'text-[#e5e7eb]' },
    light: { accent: 'text-cyan-600', label: 'text-zinc-400', text: 'text-[#111827]' },
  },
  Sand: {
    dark: { accent: 'text-amber-500', label: 'text-[#8c7853]', text: 'text-[#f5f5dc]' },
    light: { accent: 'text-amber-700', label: 'text-[#c2ab80]', text: 'text-[#451a03]' },
  },
  Scarlet: {
    dark: { accent: 'text-red-400', label: 'text-red-600', text: 'text-[#ffe4e6]' },
    light: { accent: 'text-red-600', label: 'text-red-500/80', text: 'text-[#7f1d1d]' },
  },
};

const Stats = React.memo(function Stats({ stats, mode, elapsed, bestWpm, isDark = true }: StatsProps) {
  const timeRemaining = Math.max(0, Math.floor(mode - elapsed));
  const { settings } = useKeyboardSettings();
  const themeStyles = themeStatsStyles[settings.theme] || themeStatsStyles.Classic;
  const current = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <div className="flex flex-col items-center mb-10 font-['JetBrains_Mono',_monospace] animate-in fade-in slide-in-from-top-4 duration-700 w-full transition-all duration-500 ease-in-out">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center">
          <span className={`text-xs uppercase tracking-widest font-bold mb-1 transition-all duration-500 ease-in-out ${current.label}`}>WPM</span>
          <div className={`text-4xl sm:text-5xl font-black transition-all duration-500 ease-in-out ${current.accent}`}>
            {stats.wpm}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-xs uppercase tracking-widest font-bold mb-1 transition-all duration-500 ease-in-out ${current.label}`}>Accuracy</span>
          <div className={`text-4xl sm:text-5xl font-black transition-all duration-500 ease-in-out ${current.text}`}>
            {stats.accuracy}<span className="text-xl sm:text-2xl ml-0.5 opacity-50">%</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-xs uppercase tracking-widest font-bold mb-1 transition-all duration-500 ease-in-out ${current.label}`}>Time Left</span>
          <div className={`text-4xl sm:text-5xl font-black transition-all duration-500 ease-in-out ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : current.text}`}>
            {timeRemaining}<span className="text-xl sm:text-2xl ml-0.5 opacity-50">s</span>
          </div>
        </div>
      </div>
      {bestWpm !== null && (
        <div className={`text-sm mt-2 transition-all duration-500 ease-in-out ${current.accent}`}>Best: {bestWpm} WPM</div>
      )}
    </div>
  );
});

export default Stats;