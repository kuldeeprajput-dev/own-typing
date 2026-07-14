'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

const themeBgColors: Record<KeyboardTheme, { dark: string; light: string }> = {
  Classic: { dark: '#0f0f0f', light: '#fafafa' },
  Mint: { dark: '#0c1815', light: '#f0fdf4' },
  Royal: { dark: '#070b13', light: '#f0f7ff' },
  Dolch: { dark: '#181818', light: '#f3f4f6' },
  Sand: { dark: '#14120e', light: '#fdfbf7' },
  Scarlet: { dark: '#140606', light: '#fff5f5' },
};

const KeyboardSettingsContext = createContext<KeyboardSettingsContextType | undefined>(undefined);

export function KeyboardSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<KeyboardSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Ripple state
  const [rippleTheme, setRippleTheme] = useState<KeyboardTheme | null>(null);
  const [rippleIsDark, setRippleIsDark] = useState<boolean | null>(null);

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

    if (isThemeChanging || isDarkChanging) {
      const nextTheme = newSettings.theme ?? settings.theme;
      const nextIsDark = newSettings.isDark ?? settings.isDark;

      // Trigger ripple
      setRippleTheme(nextTheme);
      setRippleIsDark(nextIsDark);

      // Update settings state behind the overlay at the animation midpoint
      const settingsTimeout = setTimeout(() => {
        setSettings((prev) => {
          const updated = { ...prev, ...newSettings };
          if (typeof window !== 'undefined') {
            localStorage.setItem('keyboard-settings', JSON.stringify(updated));
          }
          return updated;
        });
      }, 350);

      // Clean up ripple overlay when animation ends
      const cleanupTimeout = setTimeout(() => {
        setRippleTheme(null);
        setRippleIsDark(null);
      }, 750);

      return () => {
        clearTimeout(settingsTimeout);
        clearTimeout(cleanupTimeout);
      };
    } else {
      // Normal direct settings update
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        if (typeof window !== 'undefined') {
          localStorage.setItem('keyboard-settings', JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <KeyboardSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
      {rippleTheme && rippleIsDark !== null && (
        <div
          className="theme-ripple animate"
          style={{
            backgroundColor: themeBgColors[rippleTheme][rippleIsDark ? 'dark' : 'light'],
          }}
        />
      )}
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
