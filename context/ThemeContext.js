import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("darkMode")
      if (storedTheme !== null) {
        setDarkMode(JSON.parse(storedTheme))
      }
    }
    loadTheme()
  }, [])

  const toggleDarkMode = async () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
