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
  btnBg: string;
  btnHover: string;
  rowHover: string;
}

const themeStyles: Record<KeyboardTheme, { dark: ModalTheme; light: ModalTheme }> = {
  Classic: {
    dark: {
      bg: 'bg-zinc-950/95 backdrop-blur-lg',
      border: 'border-zinc-800/80',
      text: 'text-zinc-100',
      subtext: 'text-zinc-500',
      accentText: 'text-[#EAB308]',
      btnBg: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300',
      btnHover: 'hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50',
      rowHover: 'hover:bg-zinc-900/30'
    },
    light: {
      bg: 'bg-white/95 backdrop-blur-lg',
      border: 'border-zinc-200/80',
      text: 'text-zinc-800',
      subtext: 'text-zinc-400',
      accentText: 'text-amber-600',
      btnBg: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700',
      btnHover: 'hover:bg-red-50 hover:text-red-650 hover:border-red-200',
      rowHover: 'hover:bg-zinc-50/50'
    }
  },
  Mint: {
    dark: {
      bg: 'bg-[#0a1412]/95 backdrop-blur-lg',
      border: 'border-emerald-950/80',
      text: 'text-zinc-100',
      subtext: 'text-emerald-900/60',
      accentText: 'text-emerald-400',
      btnBg: 'bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-300',
      btnHover: 'hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50',
      rowHover: 'hover:bg-emerald-950/10'
    },
    light: {
      bg: 'bg-white/95 backdrop-blur-lg',
      border: 'border-emerald-200/80',
      text: 'text-emerald-900',
      subtext: 'text-emerald-600/60',
      accentText: 'text-emerald-600',
      btnBg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
      btnHover: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
      rowHover: 'hover:bg-emerald-50/30'
    }
  },
  Royal: {
    dark: {
      bg: 'bg-[#060a14]/95 backdrop-blur-lg',
      border: 'border-blue-950/80',
      text: 'text-zinc-100',
      subtext: 'text-blue-900/60',
      accentText: 'text-blue-400',
      btnBg: 'bg-blue-950/30 hover:bg-blue-950/60 text-blue-300',
      btnHover: 'hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50',
      rowHover: 'hover:bg-blue-950/10'
    },
    light: {
      bg: 'bg-white/95 backdrop-blur-lg',
      border: 'border-blue-200/80',
      text: 'text-blue-900',
      subtext: 'text-blue-600/60',
      accentText: 'text-blue-600',
      btnBg: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      btnHover: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
      rowHover: 'hover:bg-blue-50/30'
    }
  },
  Dolch: {
    dark: {
      bg: 'bg-[#121212]/95 backdrop-blur-lg',
      border: 'border-zinc-800/80',
      text: 'text-zinc-100',
      subtext: 'text-zinc-500',
      accentText: 'text-cyan-400',
      btnBg: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300',
      btnHover: 'hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50',
      rowHover: 'hover:bg-zinc-900/30'
    },
    light: {
      bg: 'bg-white/95 backdrop-blur-lg',
      border: 'border-zinc-200/80',
      text: 'text-zinc-800',
      subtext: 'text-zinc-400',
      accentText: 'text-cyan-600',
      btnBg: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700',
      btnHover: 'hover:bg-red-50 hover:text-red-655 hover:border-red-200',
      rowHover: 'hover:bg-zinc-50/50'
    }
  },
  Sand: {
    dark: {
      bg: 'bg-[#14100c]/95 backdrop-blur-lg',
      border: 'border-[#3e3427]/80',
      text: 'text-zinc-100',
      subtext: 'text-[#8c7853]/60',
      accentText: 'text-amber-500',
      btnBg: 'bg-[#1f1a14]/60 hover:bg-[#1f1a14] text-amber-500/70',
      btnHover: 'hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50',
      rowHover: 'hover:bg-[#1f1a14]/20'
    },
    light: {
      bg: 'bg-[#fdfbf7]/95 backdrop-blur-lg',
      border: 'border-[#ebdcc3]/80',
      text: 'text-[#451a03]',
      subtext: 'text-[#8c7853]/60',
      accentText: 'text-amber-700',
      btnBg: 'bg-[#ebdcc3]/50 hover:bg-[#ebdcc3] text-[#451a03]/80',
      btnHover: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
      rowHover: 'hover:bg-[#ebdcc3]/20'
    }
  },
  Scarlet: {
    dark: {
      bg: 'bg-[#140606]/95 backdrop-blur-lg',
      border: 'border-red-950/80',
      text: 'text-zinc-100',
      subtext: 'text-red-950/60',
      accentText: 'text-red-400',
      btnBg: 'bg-red-950/20 hover:bg-red-950/50 text-red-300',
      btnHover: 'hover:bg-red-950/80 hover:text-red-200 hover:border-red-900',
      rowHover: 'hover:bg-red-950/10'
    },
    light: {
      bg: 'bg-white/95 backdrop-blur-lg',
      border: 'border-red-200/80',
      text: 'text-red-900',
      subtext: 'text-red-600/60',
      accentText: 'text-red-600',
      btnBg: 'bg-red-50 hover:bg-red-100 text-red-700',
      btnHover: 'hover:bg-red-100/85 hover:text-red-900 hover:border-red-300',
      rowHover: 'hover:bg-red-50/30'
    }
  }
};

export default function HistoryModal({ isOpen, onClose, isDark = true }: HistoryModalProps) {
  const { settings } = useKeyboardSettings();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('owntype_results_history');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeTheme = themeStyles[settings.theme] || themeStyles.Classic;
  const style = isDark ? activeTheme.dark : activeTheme.light;

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your typing history?')) {
      localStorage.removeItem('owntype_results_history');
      setHistory([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content box */}
      <div className={`
        relative w-full max-w-xl rounded-3xl border p-6 shadow-2xl flex flex-col max-h-[80vh]
        transition-all duration-300 transform scale-100 animate-in zoom-in-95 duration-200
        ${style.bg} ${style.border} ${style.text} font-['JetBrains_Mono',_monospace]
      `}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-805/10">
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className={style.accentText}
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
            </svg>
            <h2 className="text-xl font-bold uppercase tracking-wider">Result History</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-zinc-850/10 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pr-1 mb-6">
          {history.length === 0 ? (
            <div className={`text-center py-12 ${style.subtext} text-sm italic`}>
              No typing tests completed yet. Start typing to record history!
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className={`border-b border-zinc-850/10 text-xs font-bold uppercase tracking-wider ${style.subtext}`}>
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3 text-center">Mode</th>
                    <th className="pb-3 text-center">WPM</th>
                    <th className="pb-3 text-center">Acc</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {history.map((entry) => (
                    <tr 
                      key={entry.id}
                      className={`border-b border-zinc-850/5 transition-colors ${style.rowHover}`}
                    >
                      <td className="py-3 pl-2 font-bold whitespace-nowrap">{entry.date}</td>
                      <td className="py-3 text-center font-bold">{entry.mode}s</td>
                      <td className={`py-3 text-center font-black ${style.accentText}`}>{entry.wpm}</td>
                      <td className="py-3 text-center font-bold">{entry.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-805/10 gap-3">
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border border-transparent
                ${style.btnBg} ${style.btnHover}
              `}
            >
              CLEAR HISTORY
            </button>
          )}
          <button
            onClick={onClose}
            className={`
              ml-auto px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border
              ${style.btnBg} border-transparent hover:border-zinc-500/30
            `}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
