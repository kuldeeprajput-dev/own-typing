'use client';

import React from 'react';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface KeyboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export default function KeyboardSettingsModal({ isOpen, onClose, isDark = true }: KeyboardSettingsModalProps) {
  const { settings, updateSettings } = useKeyboardSettings();

  if (!isOpen) return null;

  const themes: KeyboardTheme[] = ['Classic', 'Mint', 'Royal', 'Dolch', 'Sand', 'Scarlet'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-sm p-6 rounded-2xl shadow-2xl border transition-all duration-300 ${
        isDark 
          ? 'bg-[#151515] border-zinc-800 text-zinc-100' 
          : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <h2 className="text-xl font-bold mb-1">Keyboard Settings</h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Configure your keyboard preferences here.
        </p>

        <div className="space-y-6">
          {/* Theme Dropdown */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'} font-semibold`}>
              Theme:
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as KeyboardTheme })}
              className={`w-full px-3 py-2.5 rounded-lg border outline-none font-medium transition-all ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500'
              }`}
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
            <span className={`text-sm font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Display Keyboard</span>
            <button
              onClick={() => updateSettings({ displayKeyboard: !settings.displayKeyboard })}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                settings.displayKeyboard ? 'bg-amber-500' : 'bg-zinc-700'
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
            <span className={`text-sm font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Enable Haptics</span>
            <button
              onClick={() => updateSettings({ enableHaptics: !settings.enableHaptics })}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                settings.enableHaptics ? 'bg-amber-500' : 'bg-zinc-700'
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
            <span className={`text-sm font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Enable Sound</span>
            <button
              onClick={() => updateSettings({ enableSound: !settings.enableSound })}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                settings.enableSound ? 'bg-amber-500' : 'bg-zinc-700'
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
          className="w-full mt-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
