'use client';

import React from 'react';
import { TypingStats, TestMode } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface ResultsDashboardProps {
  stats: TypingStats;
  mode: TestMode;
  history: { second: number; wpm: number; rawWpm: number }[];
  words: string[];
  isDark?: boolean;
  onRestart: () => void;
}

interface DashboardTheme {
  bg: string;
  border: string;
  accentText: string;
  accentBg: string;
  shadow: string;
  watermark: string;
  chartLine: string;
  chartFill: string;
}

const themeStyles: Record<KeyboardTheme, { dark: DashboardTheme; light: DashboardTheme }> = {
  Classic: {
    dark: {
      bg: 'bg-zinc-900/40 backdrop-blur-md',
      border: 'border-zinc-800/50',
      accentText: 'text-[#EAB308]',
      accentBg: 'bg-[#EAB308]/10',
      shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.1)]',
      watermark: 'text-zinc-800/10',
      chartLine: '#EAB308',
      chartFill: 'url(#gradient-Classic-dark)',
    },
    light: {
      bg: 'bg-white border-zinc-200',
      border: 'border-zinc-200',
      accentText: 'text-amber-600',
      accentBg: 'bg-amber-500/10',
      shadow: 'shadow-[0_4px_20px_rgba(217,119,6,0.05)]',
      watermark: 'text-zinc-100',
      chartLine: '#d97706',
      chartFill: 'url(#gradient-Classic-light)',
    }
  },
  Mint: {
    dark: {
      bg: 'bg-[#0e211e]/40 backdrop-blur-md',
      border: 'border-emerald-950/40',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      shadow: 'shadow-[0_0_30px_rgba(52,211,153,0.1)]',
      watermark: 'text-emerald-950/10',
      chartLine: '#34d399',
      chartFill: 'url(#gradient-Mint-dark)',
    },
    light: {
      bg: 'bg-white border-emerald-250/60',
      border: 'border-emerald-200/60',
      accentText: 'text-emerald-600',
      accentBg: 'bg-emerald-500/10',
      shadow: 'shadow-[0_4px_20px_rgba(5,150,105,0.05)]',
      watermark: 'text-emerald-50',
      chartLine: '#059669',
      chartFill: 'url(#gradient-Mint-light)',
    }
  },
  Royal: {
    dark: {
      bg: 'bg-[#0a0f1d]/40 backdrop-blur-md',
      border: 'border-blue-950/40',
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-500/10',
      shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.1)]',
      watermark: 'text-blue-950/10',
      chartLine: '#3b82f6',
      chartFill: 'url(#gradient-Royal-dark)',
    },
    light: {
      bg: 'bg-white border-blue-200/60',
      border: 'border-blue-200/60',
      accentText: 'text-blue-600',
      accentBg: 'bg-blue-600/10',
      shadow: 'shadow-[0_4px_20px_rgba(37,99,235,0.05)]',
      watermark: 'text-blue-50',
      chartLine: '#2563eb',
      chartFill: 'url(#gradient-Royal-light)',
    }
  },
  Dolch: {
    dark: {
      bg: 'bg-[#1c1c1c]/40 backdrop-blur-md',
      border: 'border-zinc-800/50',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10',
      shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.1)]',
      watermark: 'text-zinc-800/10',
      chartLine: '#06b6d4',
      chartFill: 'url(#gradient-Dolch-dark)',
    },
    light: {
      bg: 'bg-white border-zinc-200',
      border: 'border-zinc-200',
      accentText: 'text-cyan-600',
      accentBg: 'bg-cyan-600/10',
      shadow: 'shadow-[0_4px_20px_rgba(8,145,178,0.05)]',
      watermark: 'text-zinc-100',
      chartLine: '#0891b2',
      chartFill: 'url(#gradient-Dolch-light)',
    }
  },
  Sand: {
    dark: {
      bg: 'bg-[#1f1a14]/40 backdrop-blur-md',
      border: 'border-[#3e3427]/40',
      accentText: 'text-amber-500',
      accentBg: 'bg-amber-500/10',
      shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]',
      watermark: 'text-[#3e3427]/10',
      chartLine: '#f59e0b',
      chartFill: 'url(#gradient-Sand-dark)',
    },
    light: {
      bg: 'bg-white border-[#ebdcc3]/60',
      border: 'border-[#ebdcc3]/60',
      accentText: 'text-amber-700',
      accentBg: 'bg-[#ebdcc3]/50',
      shadow: 'shadow-[0_4px_20px_rgba(180,83,9,0.05)]',
      watermark: 'text-amber-50',
      chartLine: '#b45309',
      chartFill: 'url(#gradient-Sand-light)',
    }
  },
  Scarlet: {
    dark: {
      bg: 'bg-[#1e0a0a]/40 backdrop-blur-md',
      border: 'border-red-950/40',
      accentText: 'text-red-400',
      accentBg: 'bg-red-500/10',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.1)]',
      watermark: 'text-red-950/10',
      chartLine: '#ef4444',
      chartFill: 'url(#gradient-Scarlet-dark)',
    },
    light: {
      bg: 'bg-white border-red-200/60',
      border: 'border-red-200/60',
      accentText: 'text-red-600',
      accentBg: 'bg-red-600/10',
      shadow: 'shadow-[0_4px_20px_rgba(220,38,38,0.05)]',
      watermark: 'text-red-50',
      chartLine: '#dc2626',
      chartFill: 'url(#gradient-Scarlet-light)',
    }
  }
};

const ResultsDashboard = React.memo(function ResultsDashboard({
  stats,
  mode,
  history,
  words,
  isDark = true,
  onRestart,
}: ResultsDashboardProps) {
  const { settings } = useKeyboardSettings();
  const themeSetting = themeStyles[settings.theme] || themeStyles.Classic;
  const style = isDark ? themeSetting.dark : themeSetting.light;

  // Chart measurements
  const chartWidth = 550;
  const chartHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Ensure history has data, if not fallback to placeholder
  const activeHistory = history.length > 0 
    ? history 
    : [{ second: 1, wpm: stats.wpm, rawWpm: stats.rawWpm }];

  const maxVal = Math.max(60, ...activeHistory.map(h => Math.max(h.wpm, h.rawWpm))) + 10;
  const gridSteps = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), Math.round(maxVal)];

  // Compute coordinates for plotting lines
  const wpmPoints = activeHistory.map((h, i) => {
    const x = paddingLeft + (i / (activeHistory.length - 1 || 1)) * plotWidth;
    const y = paddingTop + plotHeight - (h.wpm / maxVal) * plotHeight;
    return { x, y };
  });

  const rawPoints = activeHistory.map((h, i) => {
    const x = paddingLeft + (i / (activeHistory.length - 1 || 1)) * plotWidth;
    const y = paddingTop + plotHeight - (h.rawWpm / maxVal) * plotHeight;
    return { x, y };
  });

  const wpmPath = wpmPoints.length > 0
    ? `M ${wpmPoints[0].x} ${wpmPoints[0].y} ` + wpmPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const wpmAreaPath = wpmPoints.length > 0
    ? `${wpmPath} L ${wpmPoints[wpmPoints.length - 1].x} ${paddingTop + plotHeight} L ${wpmPoints[0].x} ${paddingTop + plotHeight} Z`
    : '';

  const rawPath = rawPoints.length > 0
    ? `M ${rawPoints[0].x} ${rawPoints[0].y} ` + rawPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const errorCount = stats.totalTyped - stats.correctChars;

  return (
    <div className="w-full max-w-[1000px] mt-2 p-2 sm:p-4 font-['JetBrains_Mono',_monospace]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Column: WPM and Accuracy Cards */}
        <div className="flex flex-col gap-6 md:col-span-1">
          {/* WPM Card */}
          <div className={`relative overflow-hidden p-6 rounded-2xl border ${style.bg} ${style.border} ${style.shadow} flex flex-col justify-between h-[130px] group transition-all duration-300 hover:border-zinc-700/50`}>
            <div className="z-10">
              <span className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>wpm</span>
              <h2 className={`text-6xl font-black ${style.accentText} leading-none mt-1`}>
                {stats.wpm}
              </h2>
            </div>
            {/* Trophy watermark SVG */}
            <div className={`absolute right-4 bottom-2 w-24 h-24 ${style.watermark} pointer-events-none transition-transform duration-500 group-hover:scale-110`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25c0-1.657-1.343-3-3-3H16.5m-3.75 13.5h3.75m-3.75-13.5v13.5m0-13.5H9m0 0H7.5c-1.657 0-3 1.343-3 3v2.25c0 1.657 1.343 3 3 3H9m1.5 6h3" />
              </svg>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className={`relative overflow-hidden p-6 rounded-2xl border ${style.bg} ${style.border} ${style.shadow} flex flex-col justify-between h-[130px] group transition-all duration-300 hover:border-zinc-700/50`}>
            <div className="z-10">
              <span className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>accuracy</span>
              <h2 className={`text-6xl font-black ${isDark ? 'text-white' : 'text-zinc-900'} leading-none mt-1`}>
                {stats.accuracy}<span className="text-3xl font-bold opacity-50">%</span>
              </h2>
            </div>
            {/* Target watermark SVG */}
            <div className={`absolute right-4 bottom-2 w-22 h-22 ${style.watermark} pointer-events-none transition-transform duration-500 group-hover:scale-110`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Chart Card */}
        <div className={`md:col-span-2 p-6 rounded-2xl border ${style.bg} ${style.border} ${style.shadow} flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={`w-4 h-4 ${style.accentText}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
              <span className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                performance over time
              </span>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500/50" />
                <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>raw</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: style.chartLine }} />
                <span className={isDark ? 'text-zinc-355' : 'text-zinc-700'}>wpm</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-[180px] relative">
            <svg width="100%" height="100%" viewBox="0 0 550 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-Classic-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EAB308" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#EAB308" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Classic-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Mint-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Mint-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Royal-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Royal-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Dolch-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Dolch-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Sand-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Sand-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b45309" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Scarlet-dark`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id={`gradient-Scarlet-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid lines */}
              {gridSteps.map((val, idx) => {
                const y = paddingTop + plotHeight - (val / maxVal) * plotHeight;
                return (
                  <g key={idx} className="opacity-40">
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
                      x={paddingLeft - 8} 
                      y={y + 4} 
                      textAnchor="end" 
                      fill={isDark ? '#71717a' : '#a1a1aa'} 
                      className="text-[9px] font-bold"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {activeHistory.length > 0 && Array.from({ length: Math.min(10, activeHistory.length) }).map((_, idx, arr) => {
                const historyIdx = Math.round((idx / (arr.length - 1)) * (activeHistory.length - 1));
                const item = activeHistory[historyIdx];
                if (!item) return null;
                const x = paddingLeft + (historyIdx / (activeHistory.length - 1 || 1)) * plotWidth;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fill={isDark ? '#71717a' : '#a1a1aa'}
                    className="text-[9px] font-bold"
                  >
                    {item.second}
                  </text>
                );
              })}

              {/* Gradient Area Fill under WPM */}
              {wpmAreaPath && (
                <path 
                  d={wpmAreaPath} 
                  fill={style.chartFill} 
                />
              )}

              {/* Raw WPM Path (Dashed gray line) */}
              {rawPath && (
                <path 
                  d={rawPath} 
                  fill="none" 
                  stroke={isDark ? '#71717a' : '#a1a1aa'} 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                  className="opacity-70" 
                />
              )}

              {/* WPM Path (Solid themed line) */}
              {wpmPath && (
                <path 
                  d={wpmPath} 
                  fill="none" 
                  stroke={style.chartLine} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              )}

              {/* Interactive circular points */}
              {wpmPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={isDark ? '#18181b' : '#ffffff'}
                  stroke={style.chartLine}
                  strokeWidth="1.5"
                  className="transition-all duration-150 hover:r-5 cursor-pointer"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Minor Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'test type', value: `time ${mode}` },
          { label: 'raw wpm', value: stats.rawWpm },
          { label: 'characters', value: `${stats.correctChars}/${stats.totalTyped}` },
          { label: 'errors', value: errorCount, isAlert: errorCount > 0 }
        ].map((chip, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${style.bg} ${style.border} ${style.shadow} flex flex-col justify-center items-center text-center`}>
            <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {chip.label}
            </span>
            <span className={`text-xl font-bold ${chip.isAlert ? 'text-red-500' : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>
              {chip.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom bar & Restart button */}
      <div className={`p-4 rounded-2xl border ${style.bg} ${style.border} ${style.shadow} flex flex-col sm:flex-row gap-4 items-center justify-between`}>
        <div className="flex items-center gap-3 w-full sm:w-auto text-left">
          <div className={`p-2 rounded-lg ${style.accentBg} ${style.accentText}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5 text-xs">
            <span className={`font-bold ${isDark ? 'text-zinc-450' : 'text-zinc-650'}`}>english easy</span>
            <span className={`italic ${isDark ? 'text-zinc-550' : 'text-zinc-400'} max-w-[280px] sm:max-w-[450px] truncate`}>
              "{words.slice(0, 8).join(' ')}..."
            </span>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className={`
            w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 
            transition-all duration-300 transform active:scale-95 shadow-md hover:-translate-y-0.5
          `}
          style={{
            backgroundColor: style.chartLine,
            color: isDark ? '#18181b' : '#ffffff',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          RESTART TEST
        </button>
      </div>
    </div>
  );
});

ResultsDashboard.displayName = 'ResultsDashboard';

export default ResultsDashboard;
