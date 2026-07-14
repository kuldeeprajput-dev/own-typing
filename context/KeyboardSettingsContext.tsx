'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

const keyboardThemes: KeyboardTheme[] = [
  'Classic',
  'Mint',
  'Royal',
  'Dolch',
  'Sand',
  'Scarlet',
];

const KeyboardSettingsContext = createContext<KeyboardSettingsContextType | undefined>(undefined);

function readSavedSettings(): KeyboardSettings | null {
  try {
    const saved = localStorage.getItem('keyboard-settings');
    if (!saved) return null;

    const parsed = JSON.parse(saved) as Partial<KeyboardSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      theme: parsed.theme && keyboardThemes.includes(parsed.theme)
        ? parsed.theme
        : defaultSettings.theme,
    };
  } catch {
    return null;
  }
}

export function KeyboardSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<KeyboardSettings>(defaultSettings);
  const settingsRef = useRef(settings);
  const activeTransitionRef = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedSettings = readSavedSettings();
      if (!savedSettings) return;

      settingsRef.current = savedSettings;
      setSettings(savedSettings);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<KeyboardSettings>) => {
    const current = settingsRef.current;
    const next = { ...current, ...newSettings };
    const isThemeChanging = next.theme !== current.theme;
    const isDarkChanging = next.isDark !== current.isDark;

    const applySettings = () => {
      settingsRef.current = next;
      setSettings(next);

      try {
        localStorage.setItem('keyboard-settings', JSON.stringify(next));
      } catch {
        // Private browsing and strict storage policies can reject writes.
      }
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
  }, []);

  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  );

  return (
    <KeyboardSettingsContext.Provider value={value}>
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
