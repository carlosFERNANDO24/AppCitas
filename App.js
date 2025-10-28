import React, { useEffect } from "react"
import NavegacionPrincipal from "./Src/Navegacion/AppNavegacion"
import { ThemeProvider } from "./context/ThemeContext"
import * as Notifications from 'expo-notifications';




export default function App() {

  useEffect(() => {
    Notifications.setNotificationHandler({

      handleNotification: async () => ({
        shouldShowAlert: true, //muestra notificacion como alerta 
        shouldShowBanner: true, //muestra notificacion como banner en la parte superior 

        shoulPlaySound: true,  //reproduce sonido
        shouldSetBadge: false, //No cambia el icono de la notificacion
    }),
  });


  const getPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if  (status !== 'granted') {
      alert('Permisos de notificaciones no concedidos');
    }
  }
  getPermisos();
}, []);
  return (
    <ThemeProvider>
      <NavegacionPrincipal />
    </ThemeProvider>
  )
}
