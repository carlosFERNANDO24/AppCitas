import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { useTheme } from "../../context/ThemeContext"

export default function Configuraciones() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [notificaciones, setNotificaciones] = useState(true)

  useEffect(() => {
    cargarConfiguraciones()
    configurarNotificaciones()
  }, [])

  const cargarConfiguraciones = async () => {
    try {
      const config = await AsyncStorage.getItem("appConfig")
      if (config) {
        const parsedConfig = JSON.parse(config)
        setNotificaciones(parsedConfig.notificaciones ?? true)
      }
    } catch (error) {
      console.error("Error cargando configuraciones:", error)
    }
  }

  const guardarConfiguracion = async (key, value) => {
    try {
      const config = await AsyncStorage.getItem("appConfig")
      const nuevaConfig = config ? JSON.parse(config) : {}
      nuevaConfig[key] = value
      await AsyncStorage.setItem("appConfig", JSON.stringify(nuevaConfig))
    } catch (error) {
      console.error("Error guardando configuración:", error)
    }
  }

  // Configuración de notificaciones locales (funciona en Expo Go)
  const configurarNotificaciones = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        Alert.alert("Permiso denegado", "No podrás recibir notificaciones.")
        return
      }
    }
  }

  const toggleNotificaciones = (value) => {
    setNotificaciones(value)
    guardarConfiguracion("notificaciones", value)

    if (value) {
      // Ejemplo de notificación local
      Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Notificaciones activadas",
          body: "Ahora recibirás alertas importantes",
        },
        trigger: { seconds: 2 },
      })
    }
  }

  const limpiarCache = () => {
    Alert.alert("Limpiar Cache", "¿Estás seguro de que quieres limpiar la cache?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpiar",
        style: "destructive",
        onPress: () => {
          AsyncStorage.clear()
          Alert.alert("Éxito", "Cache limpiada correctamente")
        },
      },
    ])
  }

  const opciones = [
    {
      icon: "moon-outline",
      title: "Modo Oscuro",
      description: "Activar interfaz oscura",
      component: (
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          thumbColor={darkMode ? "#3498db" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      ),
    },
    {
      icon: "notifications-outline",
      title: "Notificaciones",
      description: "Recibir notificaciones push",
      component: (
        <Switch
          value={notificaciones}
          onValueChange={toggleNotificaciones}
          thumbColor={notificaciones ? "#3498db" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      ),
    },
    {
      icon: "trash-outline",
      title: "Limpiar Cache",
      description: "Eliminar datos temporales",
      action: limpiarCache,
    },
    {
      icon: "information-circle-outline",
      title: "Acerca de",
      description: "Información de la aplicación",
      action: () => Alert.alert("Acerca de", "EPS App v1.0.0\nSistema de gestión médica"),
    },
  ]

  const themeStyles = darkMode
    ? { backgroundColor: "#121212", color: "#ecf0f1" }
    : { backgroundColor: "#f5f5f5", color: "#2C3E50" }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles.color }]}>Configuración</Text>
      <Text style={[styles.subtitle, { color: darkMode ? "#bdc3c7" : "#7F8C8D" }]}>
        Personaliza tu experiencia
      </Text>

      <View
        style={[
          styles.opcionesLista,
          { backgroundColor: darkMode ? "#1e1e1e" : "#fff" },
        ]}
      >
        {opciones.map((opcion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.opcionItem}
            onPress={opcion.action}
            disabled={!opcion.action}
          >
            <View style={styles.opcionLeft}>
              <Ionicons
                name={opcion.icon}
                size={24}
                color={darkMode ? "#81b0ff" : "#3498db"}
              />
              <View style={styles.opcionTextos}>
                <Text
                  style={[
                    styles.opcionTitulo,
                    { color: darkMode ? "#ecf0f1" : "#2C3E50" },
                  ]}
                >
                  {opcion.title}
                </Text>
                <Text
                  style={[
                    styles.opcionDescripcion,
                    { color: darkMode ? "#bdc3c7" : "#7F8C8D" },
                  ]}
                >
                  {opcion.description}
                </Text>
              </View>
            </View>

            {opcion.component && opcion.component}
            {opcion.action && !opcion.component && (
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={darkMode ? "#ccc" : "#999"}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: darkMode ? "#95a5a6" : "#7F8C8D" }]}>
          Versión 1.0.0
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30 },
  opcionesLista: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
  },
  opcionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  opcionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  opcionTextos: { marginLeft: 15, flex: 1 },
  opcionTitulo: { fontSize: 16, fontWeight: "600" },
  opcionDescripcion: { fontSize: 12 },
  versionContainer: { marginTop: 30, alignItems: "center" },
  versionText: { fontSize: 12 },
})
