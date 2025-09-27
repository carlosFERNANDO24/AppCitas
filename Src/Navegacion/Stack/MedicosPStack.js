// Src/Navegacion/Stack/MedicosPStack.js

import { createStackNavigator } from "@react-navigation/stack"
import ListarMedicos from "../../../screens/Medicos/listarMedicos"

const Stack = createStackNavigator()

export default function MedicosPStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarMedicos"
        component={ListarMedicos}
        options={{ title: "Listar Médicos" }}
      />
    </Stack.Navigator>
  )
}