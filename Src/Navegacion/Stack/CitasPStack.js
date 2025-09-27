// Src/Navegacion/Stack/CitasPStack.js
import { createStackNavigator } from "@react-navigation/stack"
import MisCitas from "../../../screens/Citas/misCitas"
import MiDetalleCita from "../../../screens/Citas/miDetalleCita"
import EditarMiCita from "../../../screens/Citas/editarMiCita"
import CrearMiCita from "../../../screens/Citas/CrearMiCita"

const Stack = createStackNavigator()

export default function CitasPStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MisCitas"
        component={MisCitas}
        options={{ title: "Mis Citas" }}
      />
      <Stack.Screen
        name="MiDetalleCita"
        component={MiDetalleCita}
        options={{ title: "Detalle de la Cita" }}
      />
      <Stack.Screen
        name="EditarMiCita"
        component={EditarMiCita}
        options={{ title: "Editar Cita" }}
      />
      <Stack.Screen
        name="CrearMiCita"
        component={CrearMiCita}
        options={{ title: "Crear Cita" }}
      />
    </Stack.Navigator>
  )
}