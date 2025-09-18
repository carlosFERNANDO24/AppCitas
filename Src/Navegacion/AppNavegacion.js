"use client"

import { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { AuthNavegacion } from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useRef } from "react"
import { ActivityIndicator, View, StyleSheet, AppState } from "react-native"

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const appState = useRef(AppState.currentState)

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      setUserToken(token)
      console.log("Token cargado:", token)
    } catch (error) {
      console.error("Error al cargar el token desde AsyncStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    loadToken()
  }, [])

  // Listener para cambios en el estado de la app
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("La aplicación ha vuelto a primer plano, verificando token...")
        loadToken()
      }
      appState.current = nextAppState
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)

    return () => subscription?.remove()
  }, [])

  // Verificación periódica del token (reducido el intervalo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (AppState.currentState === "active") {
        loadToken()
      }
    }, 5000) // Aumentado a 5 segundos para reducir la carga

    return () => clearInterval(interval)
  }, [])

  // Listener para cambios en AsyncStorage
  useEffect(() => {
    const checkTokenPeriodically = async () => {
      const currentToken = await AsyncStorage.getItem("userToken")
      if (currentToken !== userToken) {
        setUserToken(currentToken)
        console.log("Token actualizado:", currentToken)
      }
    }

    const interval = setInterval(checkTokenPeriodically, 1000) // Verificar cada segundo
    return () => clearInterval(interval)
  }, [userToken])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  console.log("Estado actual - userToken:", userToken, "isLoading:", isLoading)

  return (
    <NavigationContainer>
      {userToken ? <NavegacionPrincipal /> : <AuthNavegacion />}
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