// Stack/CitasStack.js
import { createStackNavigator } from "@react-navigation/stack"
import { useTheme } from "../../../context/ThemeContext";
import ListarCitas from "../../../screens/Citas/listarCitas"
import DetalleCita from "../../../screens/Citas/detalleCita"
import EditarCita from "../../../screens/Citas/editarCita"
import CrearCita from "../../../screens/Citas/crearCita"

const Stack = createStackNavigator()

export default function CitasStack() {
  const { darkMode } = useTheme();

  const headerStyles = {
    headerStyle: {
      backgroundColor: darkMode ? '#1e1e1e' : '#007AFF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <Stack.Navigator screenOptions={headerStyles}>
      <Stack.Screen 
        name="ListarCitas" 
        component={ListarCitas} 
        options={{ 
          title: "Gestión de Citas",
        }} 
      />
      <Stack.Screen 
        name="DetalleCita" 
        component={DetalleCita} 
        options={{ 
          title: "Detalle de Cita",
        }} 
      />
      <Stack.Screen 
        name="EditarCita" 
        component={EditarCita} 
        options={{ 
          title: "Editar Cita",
        }} 
      />
      <Stack.Screen 
        name="CrearCita" 
        component={CrearCita} 
        options={{ 
          title: "Nueva Cita",
        }} 
      />
    </Stack.Navigator>
  )
}