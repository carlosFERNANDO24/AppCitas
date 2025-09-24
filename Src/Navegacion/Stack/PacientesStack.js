// Stack/PacientesStack.js
import { createStackNavigator } from "@react-navigation/stack"
import ListarPacientes from "../../../screens/Pacientes/listarPacientes"
import DetallePaciente from "../../../screens/Pacientes/detallePaciente"
import EditarPaciente from "../../../screens/Pacientes/editarPaciente"
import CrearPaciente from "../../../screens/Pacientes/crearPaciente"

const Stack = createStackNavigator()

export default function PacientesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarPacientes" 
        component={ListarPacientes} 
        options={{ title: "Pacientes" }} 
      />
      <Stack.Screen 
        name="DetallePaciente" 
        component={DetallePaciente} 
        options={{ title: "Detalle del Paciente" }} 
      />
      <Stack.Screen 
        name="EditarPaciente" 
        component={EditarPaciente} 
        options={{ title: "Editar Paciente" }} 
      />
      <Stack.Screen 
        name="CrearPaciente" 
        component={CrearPaciente} 
        options={{ title: "Nuevo Paciente" }} 
      />
    </Stack.Navigator>
  )
}