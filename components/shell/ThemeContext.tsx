'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'day' | 'emerald' | 'sky' | 'charcoal';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'charcoal',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('charcoal');

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aqi_sentinel_theme', mode);
      document.documentElement.classList.remove('theme-day', 'theme-emerald', 'theme-sky', 'theme-charcoal');
      document.documentElement.classList.add(`theme-${mode}`);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('aqi_sentinel_theme') as ThemeMode | null;
    if (saved && ['day', 'emerald', 'sky', 'charcoal'].includes(saved)) {
      setTheme(saved);
    } else {
      document.documentElement.classList.add('theme-charcoal');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
