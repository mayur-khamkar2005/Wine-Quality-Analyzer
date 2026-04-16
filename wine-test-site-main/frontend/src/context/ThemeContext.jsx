import { createContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'app-theme';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return THEMES.LIGHT;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === THEMES.DARK || storedTheme === 'mono'
    ? THEMES.DARK
    : THEMES.LIGHT;
};

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === THEMES.DARK ? 'dark' : 'light';
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT,
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === THEMES.DARK,
        isMonochrome: theme === THEMES.DARK,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
