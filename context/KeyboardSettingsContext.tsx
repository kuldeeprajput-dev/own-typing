'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type KeyboardTheme = 'Classic' | 'Mint' | 'Royal' | 'Dolch' | 'Sand' | 'Scarlet';

export interface KeyboardSettings {
  theme: KeyboardTheme;
  displayKeyboard: boolean;
  enableHaptics: boolean;
  enableSound: boolean;
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
};

const KeyboardSettingsContext = createContext<KeyboardSettingsContextType | undefined>(undefined);

export function KeyboardSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<KeyboardSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

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
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('keyboard-settings', JSON.stringify(updated));
      }
      return updated;
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
