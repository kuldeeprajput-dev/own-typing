'use client';

import React from 'react';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

const themeColorsPreview: Record<KeyboardTheme, { dark: string; light: string; accent: string; label: string }> = {
  Classic: { dark: '#0f0f0f', light: '#fafafa', accent: '#f59e0b', label: 'Classic' },
  Mint: { dark: '#0c1815', light: '#f0fdf4', accent: '#10b981', label: 'Mint' },
  Royal: { dark: '#070b13', light: '#f0f7ff', accent: '#3b82f6', label: 'Royal' },
  Dolch: { dark: '#181818', light: '#f3f4f6', accent: '#06b6d4', label: 'Dolch' },
  Sand: { dark: '#14120e', light: '#fdfbf7', accent: '#a85518', label: 'Sand' },
  Scarlet: { dark: '#140606', light: '#fff5f5', accent: '#ef4444', label: 'Scarlet' },
};

const themesList: KeyboardTheme[] = ['Classic', 'Mint', 'Royal', 'Dolch', 'Sand', 'Scarlet'];

export default function ThemeToggle() {
  const { settings, updateSettings } = useKeyboardSettings();
  const isDark = settings.isDark;

  return (
    <div className="fixed z-50 top-4 right-4 sm:top-6 sm:right-8 animate-in fade-in slide-in-from-top-3 duration-500">
      <div className={`
        flex items-center gap-3 px-4 py-2 sm:py-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all duration-500 ease-in-out
        ${isDark 
          ? 'bg-zinc-950/70 border-zinc-800/80 shadow-black/30' 
          : 'bg-white/70 border-zinc-200/80 shadow-zinc-200/40'}
      `}>
        {/* Theme dots */}
        <div className="flex items-center gap-2">
          {themesList.map((themeName) => {
            const preview = themeColorsPreview[themeName];
            const isActive = settings.theme === themeName;
            
            return (
              <button
                key={themeName}
                onClick={() => updateSettings({ theme: themeName })}
                className={`
                  relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none group/dot
                  ${isActive ? 'scale-110' : 'opacity-65 hover:opacity-100'}
                `}
                style={{
                  backgroundColor: preview.accent,
                  border: isActive 
                    ? `2px solid ${isDark ? '#ffffff' : '#000000'}` 
                    : '2px solid transparent',
                  boxShadow: isActive 
                    ? `0 0 10px ${preview.accent}` 
                    : 'none',
                }}
              >
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-black rounded-lg bg-zinc-950/90 text-zinc-100 border border-zinc-800 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-[10000]">
                  {preview.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className={`w-px h-5 transition-colors duration-500 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        {/* Light/Dark toggle */}
        <button
          onClick={() => updateSettings({ isDark: !isDark })}
          className={`
            relative p-1.5 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none group/mode
            ${isDark 
              ? 'hover:bg-zinc-800 text-amber-400' 
              : 'hover:bg-zinc-100 text-indigo-605'}
          `}
        >
          {isDark ? (
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-650 fill-current" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.0 0010.586 10.586z" />
            </svg>
          )}
          
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-2.5 py-1 text-[10px] font-black rounded-lg bg-zinc-950/90 text-zinc-100 border border-zinc-800 opacity-0 group-hover/mode:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-[10000]">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
}