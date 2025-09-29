// Stack/HistorialStack.js
import { createStackNavigator } from "@react-navigation/stack"
import { useTheme } from "../../../context/ThemeContext";
import ListarHistorial from "../../../screens/Historial/listarHistorial"
import DetalleHistorial from "../../../screens/Historial/detalleHistorial"
import EditarHistorial from "../../../screens/Historial/editarHistorial"
import CrearHistorial from "../../../screens/Historial/crearHistorial"

const Stack = createStackNavigator()

export default function HistorialStack() {
  const { darkMode } = useTheme();

  const headerStyles = {
    headerStyle: {
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
    },
    headerTintColor: darkMode ? '#fff' : '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <Stack.Navigator screenOptions={headerStyles}>
      <Stack.Screen 
        name="ListarHistorial" 
        component={ListarHistorial} 
        options={{ title: "Historial Médico" }} 
      />
      <Stack.Screen 
        name="DetalleHistorial" 
        component={DetalleHistorial} 
        options={{ title: "Detalle del Historial" }} 
      />
      <Stack.Screen 
        name="EditarHistorial" 
        component={EditarHistorial} 
        options={{ title: "Editar Historial" }} 
      />
      <Stack.Screen 
        name="CrearHistorial" 
        component={CrearHistorial} 
        options={{ title: "Nuevo Historial" }} 
      />
    </Stack.Navigator>
  )
}