// Stack/HistorialStack.js
import { createStackNavigator } from "@react-navigation/stack"
import ListarHistorial from "../../../screens/Historial/listarHistorial"
import DetalleHistorial from "../../../screens/Historial/detalleHistorial"
import EditarHistorial from "../../../screens/Historial/editarHistorial"
import CrearHistorial from "../../../screens/Historial/crearHistorial"

const Stack = createStackNavigator()

export default function HistorialStack() {
  return (
    <Stack.Navigator>
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