'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

export type KeyboardTheme = 'Classic' | 'Mint' | 'Royal' | 'Dolch' | 'Sand' | 'Scarlet';

export interface KeyboardSettings {
  theme: KeyboardTheme;
  displayKeyboard: boolean;
  enableHaptics: boolean;
  enableSound: boolean;
  isDark: boolean;
}

interface KeyboardSettingsContextType {
  settings: KeyboardSettings;
  updateSettings: (newSettings: Partial<KeyboardSettings>) => void;
}

const defaultSettings: KeyboardSettings = {
  theme: 'Classic',
  displayKeyboard: true,
  enableHaptics: true,
  enableSound: true,
  isDark: true,
};

const KeyboardSettingsContext = createContext<KeyboardSettingsContextType | undefined>(undefined);

export function KeyboardSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<KeyboardSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const activeTransitionRef = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('keyboard-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setSettings(parsed);
        }, 0);
      } catch (e) {
        console.error('Failed to parse keyboard settings', e);
      }
    }
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const updateSettings = (newSettings: Partial<KeyboardSettings>) => {
    const isThemeChanging = newSettings.theme !== undefined && newSettings.theme !== settings.theme;
    const isDarkChanging = newSettings.isDark !== undefined && newSettings.isDark !== settings.isDark;

    const applySettings = () => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        localStorage.setItem('keyboard-settings', JSON.stringify(updated));
        return updated;
      });
    };

    const startViewTransition = document.startViewTransition?.bind(document);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      (!isThemeChanging && !isDarkChanging) ||
      !startViewTransition ||
      prefersReducedMotion
    ) {
      applySettings();
      return;
    }

    activeTransitionRef.current?.skipTransition();
    document.documentElement.classList.add('theme-transitioning');

    const transition = startViewTransition(() => {
      flushSync(applySettings);
    });

    activeTransitionRef.current = transition;
    transition.finished.finally(() => {
      if (activeTransitionRef.current === transition) {
        activeTransitionRef.current = null;
        document.documentElement.classList.remove('theme-transitioning');
      }
    });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <KeyboardSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </KeyboardSettingsContext.Provider>
  );
}

export function useKeyboardSettings() {
  const context = useContext(KeyboardSettingsContext);
  if (!context) {
    throw new Error('useKeyboardSettings must be used within a KeyboardSettingsProvider');
  }
  return context;
}
