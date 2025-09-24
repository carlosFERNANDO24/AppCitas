// Stack/CitasStack.js
import { createStackNavigator } from "@react-navigation/stack"
import ListarCitas from "../../../screens/Citas/listarCitas"
import DetalleCita from "../../../screens/Citas/detalleCita"
import EditarCita from "../../../screens/Citas/editarCita"
import CrearCita from "../../../screens/Citas/crearCita"

const Stack = createStackNavigator()

export default function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarCitas" 
        component={ListarCitas} 
        options={{ 
          title: "Gestión de Citas",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          }
        }} 
      />
      <Stack.Screen 
        name="DetalleCita" 
        component={DetalleCita} 
        options={{ 
          title: "Detalle de Cita",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
        }} 
      />
      <Stack.Screen 
        name="EditarCita" 
        component={EditarCita} 
        options={{ 
          title: "Editar Cita",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
        }} 
      />
      <Stack.Screen 
        name="CrearCita" 
        component={CrearCita} 
        options={{ 
          title: "Nueva Cita",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
        }} 
      />
    </Stack.Navigator>
  )
}