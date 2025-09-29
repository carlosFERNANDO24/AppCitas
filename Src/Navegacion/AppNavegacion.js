"use client"

import { useState, useEffect, useRef } from "react"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator, View, StyleSheet, AppState, StatusBar } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../../screens/Auth/LoginScreen"
import RegistroScreen from "../../screens/Auth/RegistroScreen"
import { useTheme } from "../../context/ThemeContext"

const Stack = createStackNavigator()

function AuthStack() {
  const { darkMode } = useTheme();

  const headerStyles = {
    headerStyle: {
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: darkMode ? '#fff' : '#000',
  };

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ ...headerStyles, title: "Iniciar Sesión" }} 
      />
      <Stack.Screen 
        name="Registro" 
        component={RegistroScreen} 
        options={{ ...headerStyles, title: "Registro" }} 
      />
    </Stack.Navigator>
  )
}

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const appState = useRef(AppState.currentState)
  const { darkMode } = useTheme();

  const AppTheme = darkMode ? DarkTheme : DefaultTheme;

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      setUserToken(token)
    } catch (error) {
      console.error("Error al cargar el token:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadToken()
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        loadToken()
      }
      appState.current = nextAppState
    });

    const interval = setInterval(async () => {
      const currentToken = await AsyncStorage.getItem("userToken");
      if (currentToken !== userToken) {
        setUserToken(currentToken);
      }
    }, 1500);

    return () => {
      subscription?.remove();
      clearInterval(interval);
    };
  }, [userToken])


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      {userToken ? <NavegacionPrincipal /> : <AuthStack />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
  },
})