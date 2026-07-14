"use client";

import React, { useState } from "react";
import { TestMode, TestOptions } from "@/types";
import { useKeyboardSettings, KeyboardTheme } from "@/context/KeyboardSettingsContext";
import HistoryModal from "./HistoryModal";

interface ModeSelectorProps {
  mode: TestMode;
  options: TestOptions;
  onModeChange: (mode: TestMode) => void;
  onOptionsChange: (options: Partial<TestOptions>) => void;
  onKeyboardSettingsClick: () => void;
  isDark?: boolean;
}

interface ElementThemeStyles {
  activeButton: string;
  inactiveButton: string;
  card: string;
  dot: string;
  divider: string;
  borderClass: string;
}

const themeSelectorStyles: Record<KeyboardTheme, { dark: ElementThemeStyles; light: ElementThemeStyles }> = {
  Classic: {
    dark: {
      activeButton: 'text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      inactiveButton: 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50',
      card: 'bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md shadow-black/20',
      dot: 'bg-amber-500',
      divider: 'bg-zinc-800/80',
      borderClass: 'border-zinc-800/50',
    },
    light: {
      activeButton: 'text-amber-600 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
      inactiveButton: 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100',
      card: 'bg-white border-zinc-200 shadow-zinc-200/50',
      dot: 'bg-amber-600',
      divider: 'bg-zinc-200',
      borderClass: 'border-zinc-200',
    },
  },
  Mint: {
    dark: {
      activeButton: 'text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.15)]',
      inactiveButton: 'text-emerald-600/70 hover:text-emerald-300 hover:bg-emerald-950/50',
      card: 'bg-[#0e211e]/40 border-emerald-950/40 backdrop-blur-md shadow-black/20',
      dot: 'bg-emerald-400',
      divider: 'bg-emerald-950/60',
      borderClass: 'border-emerald-950/40',
    },
    light: {
      activeButton: 'text-emerald-600 bg-emerald-500/10 shadow-[0_0_20px_rgba(5,150,105,0.08)]',
      inactiveButton: 'text-emerald-600/50 hover:text-emerald-800 hover:bg-emerald-50',
      card: 'bg-white border-emerald-200/60 shadow-emerald-100/50',
      dot: 'bg-emerald-600',
      divider: 'bg-emerald-200',
      borderClass: 'border-emerald-200/60',
    },
  },
  Royal: {
    dark: {
      activeButton: 'text-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      inactiveButton: 'text-blue-500/70 hover:text-blue-300 hover:bg-blue-950/50',
      card: 'bg-[#0a0f1d]/40 border-blue-950/40 backdrop-blur-md shadow-black/20',
      dot: 'bg-blue-400',
      divider: 'bg-blue-950/60',
      borderClass: 'border-blue-950/40',
    },
    light: {
      activeButton: 'text-blue-600 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.08)]',
      inactiveButton: 'text-blue-500/50 hover:text-blue-800 hover:bg-blue-50',
      card: 'bg-white border-blue-200/60 shadow-blue-100/50',
      dot: 'bg-blue-600',
      divider: 'bg-blue-200',
      borderClass: 'border-blue-200/60',
    },
  },
  Dolch: {
    dark: {
      activeButton: 'text-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      inactiveButton: 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50',
      card: 'bg-[#1c1c1c]/40 border-zinc-800/50 backdrop-blur-md shadow-black/20',
      dot: 'bg-cyan-400',
      divider: 'bg-zinc-800/80',
      borderClass: 'border-zinc-800/50',
    },
    light: {
      activeButton: 'text-cyan-600 bg-cyan-500/10 shadow-[0_0_20px_rgba(8,145,178,0.08)]',
      inactiveButton: 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100',
      card: 'bg-white border-zinc-200 shadow-zinc-200/50',
      dot: 'bg-cyan-600',
      divider: 'bg-zinc-200',
      borderClass: 'border-zinc-200',
    },
  },
  Sand: {
    dark: {
      activeButton: 'text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      inactiveButton: 'text-[#8c7853]/70 hover:text-[#f5f5dc] hover:bg-[#1f1a14]/50',
      card: 'bg-[#1f1a14]/40 border-[#3e3427]/40 backdrop-blur-md shadow-black/20',
      dot: 'bg-amber-500',
      divider: 'bg-[#3e3427]/60',
      borderClass: 'border-[#3e3427]/40',
    },
    light: {
      activeButton: 'text-amber-700 bg-[#ebdcc3]/50 shadow-[0_0_20px_rgba(180,83,9,0.08)]',
      inactiveButton: 'text-[#8c7853]/60 hover:text-[#451a03] hover:bg-[#fdfbf7]',
      card: 'bg-white border-[#ebdcc3]/60 shadow-amber-50/50',
      dot: 'bg-amber-700',
      divider: 'bg-[#ebdcc3]',
      borderClass: 'border-[#ebdcc3]/60',
    },
  },
  Scarlet: {
    dark: {
      activeButton: 'text-red-400 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      inactiveButton: 'text-red-750/70 hover:text-[#ffe4e6] hover:bg-[#1e0a0a]/50',
      card: 'bg-[#1e0a0a]/40 border-red-950/40 backdrop-blur-md shadow-black/20',
      dot: 'bg-red-400',
      divider: 'bg-red-950/60',
      borderClass: 'border-red-950/40',
    },
    light: {
      activeButton: 'text-red-600 bg-red-500/10 shadow-[0_0_20px_rgba(220,38,38,0.08)]',
      inactiveButton: 'text-red-500/50 hover:text-red-800 hover:bg-red-50',
      card: 'bg-white border-red-200/60 shadow-red-100/50',
      dot: 'bg-red-600',
      divider: 'bg-red-200',
      borderClass: 'border-red-200/60',
    },
  },
};

const KeyboardIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path d="M6 10h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M18 10h.01" />
    <path d="M6 14h.01" />
    <path d="M18 14h.01" />
    <path d="M10 14h4" />
  </svg>
);

const PaletteIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c.895 0 1.62-.77 1.62-1.7 0-.437-.152-.843-.41-1.163-.263-.326-.412-.734-.412-1.18 0-.895.772-1.62 1.62-1.62h1.8c5.4 0 9.778-4.378 9.778-9.778C21.778 6.378 17.4 2 12 2zm-4.5 9c-.828 0-1.5-.672-1.5-1.5S6.672 8 7.5 8s1.5 .672 1.5 1.5S8.328 11 7.5 11zm3-3c-.828 0-1.5-.672-1.5-1.5S9.672 5 10.5 5s1.5 .672 1.5 1.5S11.328 8 10.5 8zm4 0c-.828 0-1.5-.672-1.5-1.5S13.672 5 14.5 5s1.5 .672 1.5 1.5S15.328 8 14.5 8zm3 3c-.828 0-1.5-.672-1.5-1.5S16.672 8 17.5 8s1.5 .672 1.5 1.5S18.328 11 17.5 11z" />
  </svg>
);

const HistoryIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const SunIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const VolumeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeXIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" x2="17" y1="9" y2="15" />
    <line x1="17" x2="23" y1="9" y2="15" />
  </svg>
);

const modes: TestMode[] = [15, 30, 60];
const themesList: KeyboardTheme[] = ['Classic', 'Mint', 'Royal', 'Dolch', 'Sand', 'Scarlet'];

const ModeSelector = React.memo(function ModeSelector({
  mode,
  options,
  onModeChange,
  onOptionsChange,
  onKeyboardSettingsClick,
  isDark = true,
}: ModeSelectorProps) {
  const { settings, updateSettings } = useKeyboardSettings();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const themeStyles = themeSelectorStyles[settings.theme] || themeSelectorStyles.Classic;
  const current = isDark ? themeStyles.dark : themeStyles.light;

  const cycleTheme = () => {
    const currentIndex = themesList.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themesList.length;
    updateSettings({ theme: themesList[nextIndex] });
  };

  const themeName = settings.theme === 'Classic' ? 'default' : settings.theme.toLowerCase();

  return (
    <div className="flex flex-col items-center gap-4 mb-10 group">
      <div className={`
        flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-3 rounded-2xl shadow-xl transition-all duration-500 ease-in-out border
        ${current.card}
      `}>
        <div className={`flex flex-wrap justify-center items-center gap-1 border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 pr-0 sm:pr-6 transition-all duration-500 ease-in-out ${current.borderClass}`}>
          <div className="flex gap-1">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`
                  relative px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-500 ease-in-out
                  ${
                    mode === m
                      ? current.activeButton
                      : current.inactiveButton
                  }
                `}
              >
                {m}s
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1 w-full justify-center">
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
            {[
              { id: 'punctuation', label: '@', full: 'punctuation' },
              { id: 'capitals', label: 'Aa', full: 'capitals' },
              { id: 'numbers', label: '123', full: 'numbers' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onOptionsChange({ [opt.id]: !options[opt.id as keyof TestOptions] })}
                className={`
                  group/btn relative px-2 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                  ${options[opt.id as keyof TestOptions] 
                    ? current.activeButton 
                    : current.inactiveButton}
                `}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs opacity-50">{opt.label}</span>
                  {opt.full}
                </span>
              </button>
            ))}
            
            <div className={`w-px h-5 my-auto mx-1 transition-all duration-500 ease-in-out ${current.divider}`} />
            
            {/* Keyboard settings button */}
            <button
              onClick={onKeyboardSettingsClick}
              className={`
                group/btn relative px-2.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                ${current.inactiveButton}
              `}
              title="Keyboard Settings"
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <KeyboardIcon />
                <span className="uppercase text-[10px] sm:text-xs tracking-wider">KEYBOARD SETTINGS</span>
              </span>
            </button>

            {/* Theme switcher / palette button */}
            <button
              onClick={cycleTheme}
              className={`
                group/btn relative px-2.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                ${current.inactiveButton}
              `}
              title="Cycle Theme"
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <PaletteIcon />
                <span className="uppercase text-[10px] sm:text-xs tracking-wider">{themeName}</span>
              </span>
            </button>

            <div className={`w-px h-5 my-auto mx-1 transition-all duration-500 ease-in-out ${current.divider}`} />

            {/* History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className={`
                group/btn relative p-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                ${current.inactiveButton}
              `}
              title="View History"
            >
              <HistoryIcon />
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => updateSettings({ isDark: !settings.isDark })}
              className={`
                group/btn relative p-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                ${current.inactiveButton}
              `}
              title="Toggle Light/Dark"
            >
              {settings.isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Volume Button */}
            <button
              onClick={() => updateSettings({ enableSound: !settings.enableSound })}
              className={`
                group/btn relative p-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ease-in-out
                ${current.inactiveButton}
              `}
              title="Toggle Sound"
            >
              {settings.enableSound ? <VolumeIcon /> : <VolumeXIcon />}
            </button>
          </div>
        </div>
      </div>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        isDark={settings.isDark} 
      />
    </div>
  );
});

export default ModeSelector;
