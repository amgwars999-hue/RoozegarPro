import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AppTheme, ThemeMode } from '@/types';
import { generateTheme } from './colors';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  accentColor: string;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [accentColor, setAccentColor] = useState('#C8E636');
  const [systemDark, setSystemDark] = useState(false);

  const effectiveMode: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') return systemDark ? 'dark' : 'light';
    return mode;
  }, [mode, systemDark]);

  const theme = useMemo(() => generateTheme(effectiveMode, accentColor), [effectiveMode, accentColor]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode, accentColor, setMode, setAccentColor, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
