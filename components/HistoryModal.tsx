'use client';

import React, { useEffect, useState } from 'react';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface HistoryEntry {
  id: number;
  date: string;
  wpm: number;
  accuracy: number;
  mode: number;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

interface ModalTheme {
  bg: string;
  border: string;
  text: string;
  subtext: string;
  accentText: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconColor: string;
  graphLine: string;
}

const themeStyles: Record<KeyboardTheme, { dark: ModalTheme; light: ModalTheme }> = {
  Classic: {
    dark: {
      bg: 'bg-zinc-950/98 backdrop-blur-xl',
      border: 'border-zinc-800/80',
      text: 'text-zinc-100',
      subtext: 'text-zinc-500',
      accentText: 'text-[#EAB308]',
      cardBg: 'bg-zinc-900/40',
      cardBorder: 'border-zinc-800/50',
      iconBg: 'bg-[#EAB308]/10',
      iconColor: 'text-[#EAB308]',
      graphLine: '#EAB308'
    },
    light: {
      bg: 'bg-white/98 backdrop-blur-xl',
      border: 'border-zinc-200/80',
      text: 'text-zinc-800',
      subtext: 'text-zinc-400',
      accentText: 'text-amber-600',
      cardBg: 'bg-zinc-100/50',
      cardBorder: 'border-zinc-200/50',
      iconBg: 'bg-amber-600/10',
      iconColor: 'text-amber-600',
      graphLine: '#d97706'
    }
  },
  Mint: {
    dark: {
      bg: 'bg-[#0a1412]/98 backdrop-blur-xl',
      border: 'border-emerald-950/80',
      text: 'text-zinc-100',
      subtext: 'text-emerald-900/60',
      accentText: 'text-emerald-400',
      cardBg: 'bg-emerald-950/10',
      cardBorder: 'border-emerald-950/30',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      graphLine: '#34d399'
    },
    light: {
      bg: 'bg-white/98 backdrop-blur-xl',
      border: 'border-emerald-200/80',
      text: 'text-emerald-900',
      subtext: 'text-emerald-600/60',
      accentText: 'text-emerald-650',
      cardBg: 'bg-emerald-50/30',
      cardBorder: 'border-emerald-100/40',
      iconBg: 'bg-emerald-600/10',
      iconColor: 'text-emerald-600',
      graphLine: '#059669'
    }
  },
  Royal: {
    dark: {
      bg: 'bg-[#060a14]/98 backdrop-blur-xl',
      border: 'border-blue-950/80',
      text: 'text-zinc-100',
      subtext: 'text-blue-900/60',
      accentText: 'text-blue-400',
      cardBg: 'bg-blue-950/10',
      cardBorder: 'border-blue-950/30',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      graphLine: '#3b82f6'
    },
    light: {
      bg: 'bg-white/98 backdrop-blur-xl',
      border: 'border-blue-200/80',
      text: 'text-blue-900',
      subtext: 'text-blue-600/60',
      accentText: 'text-blue-600',
      cardBg: 'bg-blue-50/30',
      cardBorder: 'border-blue-100/40',
      iconBg: 'bg-blue-600/10',
      iconColor: 'text-blue-600',
      graphLine: '#2563eb'
    }
  },
  Dolch: {
    dark: {
      bg: 'bg-[#121212]/98 backdrop-blur-xl',
      border: 'border-zinc-800/80',
      text: 'text-zinc-100',
      subtext: 'text-zinc-500',
      accentText: 'text-cyan-400',
      cardBg: 'bg-zinc-900/40',
      cardBorder: 'border-zinc-800/50',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      graphLine: '#06b6d4'
    },
    light: {
      bg: 'bg-white/98 backdrop-blur-xl',
      border: 'border-zinc-200/80',
      text: 'text-zinc-850',
      subtext: 'text-zinc-450',
      accentText: 'text-cyan-600',
      cardBg: 'bg-zinc-100/50',
      cardBorder: 'border-zinc-200/50',
      iconBg: 'bg-cyan-600/10',
      iconColor: 'text-cyan-600',
      graphLine: '#0891b2'
    }
  },
  Sand: {
    dark: {
      bg: 'bg-[#14100c]/98 backdrop-blur-xl',
      border: 'border-[#3e3427]/80',
      text: 'text-zinc-100',
      subtext: 'text-[#8c7853]/60',
      accentText: 'text-amber-500',
      cardBg: 'bg-[#1f1a14]/30',
      cardBorder: 'border-[#3e3427]/40',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      graphLine: '#f59e0b'
    },
    light: {
      bg: 'bg-[#fdfbf7]/98 backdrop-blur-xl',
      border: 'border-[#ebdcc3]/80',
      text: 'text-[#451a03]',
      subtext: 'text-[#8c7853]/60',
      accentText: 'text-amber-700',
      cardBg: 'bg-[#ebdcc3]/20',
      cardBorder: 'border-[#ebdcc3]/40',
      iconBg: 'bg-amber-755/10',
      iconColor: 'text-amber-700',
      graphLine: '#b45309'
    }
  },
  Scarlet: {
    dark: {
      bg: 'bg-[#140606]/98 backdrop-blur-xl',
      border: 'border-red-950/80',
      text: 'text-zinc-100',
      subtext: 'text-red-950/60',
      accentText: 'text-red-400',
      cardBg: 'bg-red-950/10',
      cardBorder: 'border-red-950/30',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      graphLine: '#ef4444'
    },
    light: {
      bg: 'bg-white/98 backdrop-blur-xl',
      border: 'border-red-200/80',
      text: 'text-red-900',
      subtext: 'text-red-600/60',
      accentText: 'text-red-600',
      cardBg: 'bg-red-50/30',
      cardBorder: 'border-red-100/40',
      iconBg: 'bg-red-655/10',
      iconColor: 'text-red-600',
      graphLine: '#dc2626'
    }
  }
};

export default function HistoryModal({ isOpen, onClose, isDark = true }: HistoryModalProps) {
  const { settings } = useKeyboardSettings();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem('owntype_results_history');
        const parsed = stored ? JSON.parse(stored) : [];
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setHistory([]);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  const activeTheme = themeStyles[settings.theme] || themeStyles.Classic;
  const style = isDark ? activeTheme.dark : activeTheme.light;

  // Compute stats metrics
  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgWpm = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length) : 0;
  const avgAccuracy = history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length) : 0;

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your typing history?')) {
      localStorage.removeItem('owntype_results_history');
      setHistory([]);
    }
  };

  // Graph Data Processing: Plot last 10 runs in chronological order (oldest to newest)
  const lastRuns = history.slice(0, 10).reverse();

  // SVG Chart Parameters
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(60, ...lastRuns.map(h => h.wpm)) + 5;
  const gridSteps = [0, 15, 30, 45, 60];

  const wpmPoints = lastRuns.map((h, i) => {
    const x = paddingLeft + (i / (lastRuns.length - 1 || 1)) * plotWidth;
    const y = paddingTop + plotHeight - (h.wpm / maxVal) * plotHeight;
    return { x, y };
  });

  // Bezier curve calculations for smooth line
  const getBezierCommand = (point: { x: number; y: number }, i: number, a: { x: number; y: number }[]) => {
    const line = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => {
      const lengthX = pointB.x - pointA.x;
      const lengthY = pointB.y - pointA.y;
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      };
    };

    const controlPoint = (current: { x: number; y: number }, previous: { x: number; y: number }, next: { x: number; y: number }, reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const o = line(p, n);
      const smoothing = 0.2;
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      const x = current.x + Math.cos(angle) * length;
      const y = current.y + Math.sin(angle) * length;
      return [x, y];
    };

    const p = a[i - 1];
    const n = a[i + 1];
    const [cpsX, cpsY] = controlPoint(p, a[i - 2], point);
    const [cpeX, cpeY] = controlPoint(point, p, n, true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
  };

  const wpmPath = wpmPoints.length > 0
    ? wpmPoints.reduce((acc, point, i, a) => i === 0
        ? `M ${point.x},${point.y}`
        : `${acc} ${getBezierCommand(point, i, a)}`
      , '')
    : '';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal content box */}
      <div className={`
        relative w-full max-w-4xl rounded-3xl border p-8 shadow-2xl flex flex-col max-h-[90vh]
        transition-all duration-300 transform scale-100 animate-in zoom-in-95 duration-200
        ${style.bg} ${style.border} ${style.text} font-['JetBrains_Mono',_monospace]
      `}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2.5">
            <span className={`text-2xl font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              performance
            </span>
            <span className={`text-2xl font-bold uppercase tracking-wider ${style.accentText}`}>
              history
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className={`p-2 rounded-xl transition-all duration-300 ${style.iconColor} bg-red-500/10 hover:bg-red-500/20`}
                title="Clear History"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
                </svg>
              </button>
            )}
            <button 
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors hover:bg-zinc-800/10 focus:outline-none`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className={`text-center py-20 ${style.subtext} text-base italic`}>
              No typing tests completed yet. Complete a test to view progress history!
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Top Three Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Best WPM */}
                <div className={`flex items-center gap-4 p-5 rounded-2xl border ${style.cardBg} ${style.cardBorder} transition-all duration-300 hover:border-zinc-700/30`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m22 7-8.5 8.5-5-5L2 17" />
                      <path d="M16 7h6v6" />
                    </svg>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${style.subtext}`}>Best WPM</span>
                    <h3 className="text-3xl font-black mt-0.5 leading-none">{bestWpm}</h3>
                  </div>
                </div>

                {/* Card 2: Average WPM */}
                <div className={`flex items-center gap-4 p-5 rounded-2xl border ${style.cardBg} ${style.cardBorder} transition-all duration-300 hover:border-zinc-700/30`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${style.subtext}`}>Average WPM</span>
                    <h3 className="text-3xl font-black mt-0.5 leading-none">{avgWpm}</h3>
                  </div>
                </div>

                {/* Card 3: Average Accuracy */}
                <div className={`flex items-center gap-4 p-5 rounded-2xl border ${style.cardBg} ${style.cardBorder} transition-all duration-300 hover:border-zinc-700/30`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-450`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${style.subtext}`}>Average Accuracy</span>
                    <h3 className="text-3xl font-black mt-0.5 leading-none">{avgAccuracy}%</h3>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="mb-4">
                <span className={`inline-block text-[11px] font-bold uppercase tracking-widest mb-4 ${style.subtext}`}>
                  wpm progress
                </span>
                
                {/* SVG Graph Container */}
                <div className="w-full relative h-[240px]">
                  <svg width="100%" height="100%" viewBox="0 0 700 220" preserveAspectRatio="none">
                    {/* Horizontal grid lines */}
                    {gridSteps.map((val, idx) => {
                      const y = paddingTop + plotHeight - (val / maxVal) * plotHeight;
                      return (
                        <g key={idx} className="opacity-30">
                          <line 
                            x1={paddingLeft} 
                            y1={y} 
                            x2={chartWidth - paddingRight} 
                            y2={y} 
                            stroke={isDark ? '#27272a' : '#e4e4e7'} 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                          />
                          <text 
                            x={paddingLeft - 10} 
                            y={y + 4} 
                            textAnchor="end" 
                            fill={isDark ? '#52525b' : '#a1a1aa'} 
                            className="text-[9px] font-bold"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Curve line */}
                    {wpmPath && (
                      <path 
                        d={wpmPath} 
                        fill="none" 
                        stroke={style.graphLine} 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                      />
                    )}

                    {/* Data dots & labels */}
                    {wpmPoints.map((p, i) => (
                      <g key={i}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4.5"
                          fill={isDark ? '#09090b' : '#ffffff'}
                          stroke={style.graphLine}
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}

                    {/* X Axis sequence tags (#1, #2, etc.) */}
                    {lastRuns.map((h, i) => {
                      const x = paddingLeft + (i / (lastRuns.length - 1 || 1)) * plotWidth;
                      return (
                        <text
                          key={i}
                          x={x}
                          y={chartHeight - 10}
                          textAnchor="middle"
                          fill={isDark ? '#52525b' : '#a1a1aa'}
                          className="text-[9px] font-bold"
                        >
                          #{i + 1}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
