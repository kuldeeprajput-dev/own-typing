'use client';

import React, { useRef, useLayoutEffect } from 'react';
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
    dark: { accent: '#f59e0b', label: '#52525b', text: '#f4f4f5' },
    light: { accent: '#d97706', label: '#9ca3af', text: '#151515' },
  },
  Mint: {
    dark: { accent: '#34d399', label: '#059669', text: '#d1fae5' },
    light: { accent: '#059669', label: 'rgba(16,185,129,0.8)', text: '#064e3b' },
  },
  Royal: {
    dark: { accent: '#60a5fa', label: '#3b82f6', text: '#dbeafe' },
    light: { accent: '#2563eb', label: 'rgba(59,130,246,0.8)', text: '#1e3a8a' },
  },
  Dolch: {
    dark: { accent: '#22d3ee', label: '#6b7280', text: '#e5e7eb' },
    light: { accent: '#0891b2', label: '#9ca3af', text: '#111827' },
  },
  Sand: {
    dark: { accent: '#f59e0b', label: '#8c7853', text: '#f5f5dc' },
    light: { accent: '#b45309', label: '#c2ab80', text: '#451a03' },
  },
  Scarlet: {
    dark: { accent: '#f87171', label: '#dc2626', text: '#ffe4e6' },
    light: { accent: '#dc2626', label: 'rgba(239,68,68,0.8)', text: '#7f1d1d' },
  },
};

// Direct DOM updates for stats — only touches the 3 text nodes that actually changed.
// React never re-renders this component during typing.
const Stats = React.memo(function Stats({ stats, mode, elapsed, bestWpm, isDark = true }: StatsProps) {
  const wpmRef = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef({ wpm: -1, acc: -1, time: -1 });
  const { settings } = useKeyboardSettings();

  const themeStyles = themeStatsStyles[settings.theme] || themeStatsStyles.Classic;
  const current = isDark ? themeStyles.dark : themeStyles.light;

  const timeRemaining = Math.max(0, Math.ceil(mode - elapsed));

  // Update text content directly — bypasses React reconciliation entirely
  useLayoutEffect(() => {
    const prev = prevRef.current;
    if (wpmRef.current && prev.wpm !== stats.wpm) {
      wpmRef.current.textContent = String(stats.wpm);
      prev.wpm = stats.wpm;
    }
    if (accRef.current && prev.acc !== stats.accuracy) {
      accRef.current.textContent = String(stats.accuracy);
      prev.acc = stats.accuracy;
    }
    if (timeRef.current && prev.time !== timeRemaining) {
      timeRef.current.textContent = String(timeRemaining);
      if (timeRemaining <= 5) {
        timeRef.current.parentElement!.style.color = '#ef4444';
      } else {
        timeRef.current.parentElement!.style.color = current.text;
      }
      prev.time = timeRemaining;
    }
  });

  return (
    <div className="flex flex-col items-center mb-10 font-['JetBrains_Mono',_monospace] w-full">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center">
          <span
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: current.label }}
          >WPM</span>
          <div
            className="text-4xl sm:text-5xl font-black"
            style={{ color: current.accent }}
          >
            <span ref={wpmRef}>{stats.wpm}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: current.label }}
          >Accuracy</span>
          <div
            className="text-4xl sm:text-5xl font-black"
            style={{ color: current.text }}
          >
            <span ref={accRef}>{stats.accuracy}</span><span className="text-xl sm:text-2xl ml-0.5 opacity-50">%</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: current.label }}
          >Time Left</span>
          <div
            className="text-4xl sm:text-5xl font-black"
            style={{ color: timeRemaining <= 5 ? '#ef4444' : current.text }}
          >
            <span ref={timeRef}>{timeRemaining}</span><span className="text-xl sm:text-2xl ml-0.5 opacity-50">s</span>
          </div>
        </div>
      </div>
      {bestWpm !== null && (
        <div className="text-sm mt-2" style={{ color: current.accent }}>Best: {bestWpm} WPM</div>
      )}
    </div>
  );
});

export default Stats;