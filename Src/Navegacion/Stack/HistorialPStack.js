// Src/Navegacion/Stack/HistorialPStack.js
import { createStackNavigator } from "@react-navigation/stack"
import MiHistorial from "../../../screens/Historial/miHistorial"
import MiDetalleHistorial from "../../../screens/Historial/miDetalleHistorial"

const Stack = createStackNavigator()

export default function HistorialPStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MiHistorial"
        component={MiHistorial}
        options={{ title: "Mi Historial Médico" }}
      />
      <Stack.Screen
        name="MiDetalleHistorial"
        component={MiDetalleHistorial}
        options={{ title: "Detalle del Historial" }}
      />
    </Stack.Navigator>
  )
}