import React from "react"
import NavegacionPrincipal from "./Src/Navegacion/AppNavegacion"
import { ThemeProvider } from "./context/ThemeContext"
import * as Notifications from "expo-notifications"

// ⚡ Configuración global de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function App() {
  return (
    <ThemeProvider>
      <NavegacionPrincipal />
    </ThemeProvider>
  )
}
