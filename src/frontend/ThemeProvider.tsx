import React, { createContext, useState, useEffect } from 'react';
import "./ThemeProvider.css";
export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const theme_mode = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(theme_mode);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }, [theme]);

      const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
      </ThemeContext.Provider>
    )
}
