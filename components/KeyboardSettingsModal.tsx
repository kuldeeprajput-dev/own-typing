'use client';

import React from 'react';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface KeyboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

interface ModalThemeStyles {
  bg: string;
  border: string;
  text: string;
  accentBg: string;
  accentBgHover: string;
  accentText: string;
  focusBorder: string;
  shadow: string;
}

const themeModalStyles: Record<KeyboardTheme, { dark: ModalThemeStyles; light: ModalThemeStyles }> = {
  Classic: {
    dark: {
      bg: 'bg-[#151515]',
      border: 'border-zinc-850',
      text: 'text-zinc-100',
      accentBg: 'bg-amber-500',
      accentBgHover: 'hover:bg-amber-400',
      accentText: 'text-black',
      focusBorder: 'focus:border-amber-500',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-zinc-200',
      text: 'text-zinc-900',
      accentBg: 'bg-amber-600',
      accentBgHover: 'hover:bg-amber-500',
      accentText: 'text-white',
      focusBorder: 'focus:border-amber-600',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
  },
  Mint: {
    dark: {
      bg: 'bg-[#0f1d1a]',
      border: 'border-emerald-950/80',
      text: 'text-[#d1fae5]',
      accentBg: 'bg-emerald-400',
      accentBgHover: 'hover:bg-emerald-300',
      accentText: 'text-black',
      focusBorder: 'focus:border-emerald-400',
      shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      text: 'text-[#064e3b]',
      accentBg: 'bg-emerald-600',
      accentBgHover: 'hover:bg-emerald-500',
      accentText: 'text-white',
      focusBorder: 'focus:border-emerald-600',
      shadow: 'shadow-[0_0_20px_rgba(5,150,105,0.15)]',
    },
  },
  Royal: {
    dark: {
      bg: 'bg-[#0b101d]',
      border: 'border-blue-950/80',
      text: 'text-[#dbeafe]',
      accentBg: 'bg-blue-500',
      accentBgHover: 'hover:bg-blue-450',
      accentText: 'text-white',
      focusBorder: 'focus:border-blue-400',
      shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-blue-200',
      text: 'text-[#1e3a8a]',
      accentBg: 'bg-blue-600',
      accentBgHover: 'hover:bg-blue-500',
      accentText: 'text-white',
      focusBorder: 'focus:border-blue-600',
      shadow: 'shadow-[0_0_20px_rgba(37,99,235,0.15)]',
    },
  },
  Dolch: {
    dark: {
      bg: 'bg-[#1c1c1c]',
      border: 'border-zinc-800',
      text: 'text-[#e5e7eb]',
      accentBg: 'bg-cyan-400',
      accentBgHover: 'hover:bg-cyan-300',
      accentText: 'text-black',
      focusBorder: 'focus:border-cyan-400',
      shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-zinc-200',
      text: 'text-[#111827]',
      accentBg: 'bg-cyan-600',
      accentBgHover: 'hover:bg-cyan-500',
      accentText: 'text-white',
      focusBorder: 'focus:border-cyan-600',
      shadow: 'shadow-[0_0_20px_rgba(8,145,178,0.15)]',
    },
  },
  Sand: {
    dark: {
      bg: 'bg-[#1f1a14]',
      border: 'border-[#3e3427]',
      text: 'text-[#f5f5dc]',
      accentBg: 'bg-amber-500',
      accentBgHover: 'hover:bg-amber-400',
      accentText: 'text-black',
      focusBorder: 'focus:border-amber-500',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-[#ebdcc3]',
      text: 'text-[#451a03]',
      accentBg: 'bg-amber-700',
      accentBgHover: 'hover:bg-amber-600',
      accentText: 'text-white',
      focusBorder: 'focus:border-amber-750',
      shadow: 'shadow-[0_0_20px_rgba(180,83,9,0.15)]',
    },
  },
  Scarlet: {
    dark: {
      bg: 'bg-[#1e0a0a]',
      border: 'border-red-950/80',
      text: 'text-[#ffe4e6]',
      accentBg: 'bg-red-500',
      accentBgHover: 'hover:bg-red-450',
      accentText: 'text-white',
      focusBorder: 'focus:border-red-400',
      shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    },
    light: {
      bg: 'bg-white',
      border: 'border-red-200',
      text: 'text-[#7f1d1d]',
      accentBg: 'bg-red-600',
      accentBgHover: 'hover:bg-red-500',
      accentText: 'text-white',
      focusBorder: 'focus:border-red-650',
      shadow: 'shadow-[0_0_20px_rgba(220,38,38,0.15)]',
    },
  },
};

export default function KeyboardSettingsModal({ isOpen, onClose, isDark = true }: KeyboardSettingsModalProps) {
  const { settings, updateSettings } = useKeyboardSettings();

  if (!isOpen) return null;

  const themes: KeyboardTheme[] = ['Classic', 'Mint', 'Royal', 'Dolch', 'Sand', 'Scarlet'];
  const themeStyles = themeModalStyles[settings.theme] || themeModalStyles.Classic;
  const current = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-[420px] p-6 rounded-2xl shadow-2xl border transition-all duration-500 ease-in-out ${
        current.bg} ${current.border} ${current.text}
      `}>
        <h2 className="text-xl font-bold mb-1">Keyboard Settings</h2>
        <p className={`text-[13px] whitespace-nowrap mb-6 transition-colors duration-500 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Configure your keyboard preferences here.
        </p>

        <div className="space-y-6">
          {/* Theme Dropdown */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs uppercase tracking-wider transition-colors duration-500 ${isDark ? 'text-zinc-400' : 'text-zinc-550'} font-semibold`}>
              Theme:
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as KeyboardTheme })}
              className={`w-full px-3 py-2.5 rounded-lg border outline-none font-medium transition-all duration-500 ease-in-out ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              } ${current.focusBorder}`}
            >
              {themes.map((t) => (
                <option key={t} value={t} className={isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Display Keyboard Toggle */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold transition-colors duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Display Keyboard</span>
            <button
              onClick={() => updateSettings({ displayKeyboard: !settings.displayKeyboard })}
              className={`relative w-12 h-6 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none ${
                settings.displayKeyboard ? current.accentBg : (isDark ? 'bg-zinc-800' : 'bg-zinc-300')
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                  settings.displayKeyboard ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Enable Haptics Toggle */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold transition-colors duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Enable Haptics</span>
            <button
              onClick={() => updateSettings({ enableHaptics: !settings.enableHaptics })}
              className={`relative w-12 h-6 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none ${
                settings.enableHaptics ? current.accentBg : (isDark ? 'bg-zinc-800' : 'bg-zinc-300')
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                  settings.enableHaptics ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Enable Sound Toggle */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold transition-colors duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Enable Sound</span>
            <button
              onClick={() => updateSettings({ enableSound: !settings.enableSound })}
              className={`relative w-12 h-6 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none ${
                settings.enableSound ? current.accentBg : (isDark ? 'bg-zinc-800' : 'bg-zinc-300')
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                  settings.enableSound ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full mt-8 py-3 font-bold rounded-lg transition-all duration-500 ease-in-out transform active:scale-95 ${current.accentBg} ${current.accentBgHover} ${current.accentText} ${current.shadow}`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
