// screens/Configuracion/configuraciones.js
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { useTheme } from "../../context/ThemeContext"

// Manejador para mostrar notificaciones con la app abierta
Notifications.setNotificationHandler({
 handleNotification: async () => ({
   shouldShowAlert: true,
   shouldPlaySound: false, // Puedes ponerlo en true si quieres sonido también
   shouldSetBadge: false,
 }),
});

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
       // Asegúrate de que el valor por defecto sea true si no existe la clave
       setNotificaciones(parsedConfig.notificaciones === undefined ? true : parsedConfig.notificaciones)
     } else {
        // Si no hay configuración guardada, asume que están activadas
        setNotificaciones(true);
     }
   } catch (error) {
     console.error("Error cargando configuraciones:", error)
     setNotificaciones(true); // En caso de error, asume activadas
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

 // Configuración del canal de notificaciones (principalmente para Android)
 const configurarNotificaciones = async () => {
   if (Platform.OS === 'android') {
     // Intenta obtener el canal existente primero
     const existingChannel = await Notifications.getNotificationChannelAsync('default');
     // Si no existe o queremos asegurarnos de que tenga la configuración correcta, lo creamos/actualizamos
     if (!existingChannel || existingChannel.vibrationPattern == null) { // Puedes añadir más condiciones si cambiaste otras propiedades
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250], // Patrón de vibración
            lightColor: '#FF231F7C',
            // bypassDnd: true, // Opcional: intentar saltar "No Molestar" (puede no funcionar en todos los dispositivos/versiones)
            // lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // Opcional: visibilidad en pantalla bloqueada
        });
        console.log("Canal de notificación 'default' configurado/actualizado.");
     } else {
        console.log("Canal de notificación 'default' ya existe con vibración.");
     }
   }

   // Lógica para solicitar permisos (sin cambios)
   if (Device.isDevice) {
     const { status: existingStatus } = await Notifications.getPermissionsAsync()
     let finalStatus = existingStatus
     if (existingStatus !== "granted") {
       const { status } = await Notifications.requestPermissionsAsync()
       finalStatus = status
     }
     if (finalStatus !== "granted") {
       Alert.alert("Permiso denegado", "No podrás recibir notificaciones.")
       setNotificaciones(false) // Desactiva el switch si no hay permiso
       guardarConfiguracion("notificaciones", false)
       return
     }
   }
 }

 const toggleNotificaciones = (value) => {
   setNotificaciones(value)
   guardarConfiguracion("notificaciones", value)

   if (value) {
     // Envía notificación de prueba AL ACTIVAR
     Notifications.scheduleNotificationAsync({
       content: {
         title: "🔔 Notificaciones Activadas",
         body: "Ahora recibirás alertas importantes.",
         // --- Añadido para forzar vibración ---
         vibrationPattern: [0, 250, 250, 250],
         // ------------------------------------
         // sound: 'default', // Opcional: si quieres sonido también
       },
       trigger: { seconds: 1 }, // Lanza rápido para prueba
       channelId: 'default', // --- Asegúrate de especificar el ID del canal ---
     });
     console.log("Notificación de prueba (activadas) programada.");
   } else {
     // Cancela todas las notificaciones programadas AL DESACTIVAR
     Notifications.cancelAllScheduledNotificationsAsync();
     console.log("Todas las notificaciones programadas canceladas.");
     // Opcional: Enviar una notificación silenciosa para confirmar la desactivación (sin vibración)
      Notifications.scheduleNotificationAsync({
       content: {
         title: "🔕 Notificaciones Desactivadas",
         body: "Ya no recibirás alertas.",
         // Sin vibrationPattern aquí
       },
       trigger: { seconds: 1 },
       channelId: 'default',
     });
   }
 }

 const limpiarCache = () => {
    // ... (sin cambios)
   Alert.alert("Limpiar Cache", "¿Estás seguro de que quieres limpiar la cache?", [
     { text: "Cancelar", style: "cancel" },
     {
       text: "Limpiar",
       style: "destructive",
       onPress: async () => {
         try {
             await AsyncStorage.clear();
             // Importante: Recargar configuraciones después de limpiar,
             // o al menos resetear el estado local a valores por defecto.
             setNotificaciones(true); // Asume valor por defecto
             toggleDarkMode(false); // Asume valor por defecto (o lee preferencia del sistema)
             Alert.alert("Éxito", "Cache limpiada correctamente. Configuraciones reseteadas a valores por defecto.");
             // Podrías necesitar reiniciar la app o recargar más datos si limpiaste tokens, etc.
         } catch(e) {
             Alert.alert("Error", "No se pudo limpiar la cache.");
         }
       },
     },
   ])
 }

 // --- Array de opciones (sin cambios) ---
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
      description: "Recibir notificaciones locales",
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

 // --- Estilos según tema (sin cambios) ---
 const themeStyles = darkMode
    ? { backgroundColor: "#121212", color: "#ecf0f1" }
    : { backgroundColor: "#f5f5f5", color: "#2C3E50" }

 // --- Renderizado del componente (sin cambios) ---
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
            style={[
              styles.opcionItem,
              { borderBottomColor: darkMode ? '#333' : '#f0f0f0' },
              index === opciones.length - 1 && { borderBottomWidth: 0 } // Quita borde al último item
             ]}
            onPress={opcion.action}
            disabled={!opcion.action && !opcion.component} // Deshabilita si no hay acción ni componente (Switch)
            activeOpacity={opcion.action ? 0.7 : 1} // Reduce opacidad al tocar si hay acción
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

            {/* Renderiza el componente (Switch) si existe */}
            {opcion.component && opcion.component}
            {/* Renderiza el icono de flecha si hay acción y NO hay componente */}
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

// --- Estilos (sin cambios) ---
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
   overflow: "hidden", // Importante para que el borde redondeado afecte a los hijos
   elevation: 3,
   // Sombra para iOS
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.1,
   shadowRadius: 3,
 },
 opcionItem: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   paddingVertical: 18, // Ligeramente más espaciado
   paddingHorizontal: 20,
   borderBottomWidth: 1,
 },
 opcionLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 }, // Margen para separar del switch/icono
 opcionTextos: { marginLeft: 15, flex: 1 }, // Asegura que el texto use el espacio disponible
 opcionTitulo: { fontSize: 16, fontWeight: "600", marginBottom: 2 }, // Ligero ajuste de margen
 opcionDescripcion: { fontSize: 12 },
 versionContainer: { marginTop: 30, alignItems: "center" },
 versionText: { fontSize: 12 },
})