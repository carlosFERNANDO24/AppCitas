import { createStackNavigator } from "@react-navigation/stack"
import ListarCitas from "../../../screens/Citas/listarCitas"
import DetalleCita from "../../../screens/Citas/detalleCitas"
import EditarCita from "../../../screens/Citas/editarCitas"
import CrearCita from "../../../screens/Citas/crearCita"

const Stack = createStackNavigator()

export default function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarCitas" 
        component={ListarCitas} 
        options={{ title: "Mis Citas" }} 
      />
      <Stack.Screen 
        name="DetalleCita" 
        component={DetalleCita} 
        options={{ title: "Detalle de Cita" }} 
      />
      <Stack.Screen 
        name="EditarCita" 
        component={EditarCita} 
        options={{ title: "Editar Cita" }} 
      />
      <Stack.Screen 
        name="CrearCita" 
        component={CrearCita} 
        options={{ title: "Nueva Cita" }} 
      />
    </Stack.Navigator>
  )
}