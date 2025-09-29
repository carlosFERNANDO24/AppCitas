// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Paletas de Colores Centralizadas ---
export const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#2C3E50',
  subtext: '#6c757d',
  border: '#ddd',
  primary: '#007AFF',
  placeholder: '#999',
};

export const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  subtext: '#a0a0a0',
  border: '#333',
  primary: '#3498db',
  placeholder: '#888',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("darkMode");
        if (storedTheme !== null) {
          setIsDarkMode(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  // El proveedor ahora expone el estado, los colores, y la función para cambiarlo
  const theme = {
    darkMode: isDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al tema en cualquier componente
export const useTheme = () => useContext(ThemeContext);