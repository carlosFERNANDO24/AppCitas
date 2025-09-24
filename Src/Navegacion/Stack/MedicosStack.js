// Stack/MedicosStack.js
import { createStackNavigator } from "@react-navigation/stack"
import ListarMedicos from "../../../screens/Medicos/listarMedicos"
import DetalleMedico from "../../../screens/Medicos/detalleMedico"
import EditarMedico from "../../../screens/Medicos/editarMedico"
import CrearMedico from "../../../screens/Medicos/crearMedico"

const Stack = createStackNavigator()

export default function MedicosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarMedicos" 
        component={ListarMedicos} 
        options={{ title: "Médicos" }} 
      />
      <Stack.Screen 
        name="DetalleMedico" 
        component={DetalleMedico} 
        options={{ title: "Detalle del Médico" }} 
      />
      <Stack.Screen 
        name="EditarMedico" 
        component={EditarMedico} 
        options={{ title: "Editar Médico" }} 
      />
      <Stack.Screen 
        name="CrearMedico" 
        component={CrearMedico} 
        options={{ title: "Nuevo Médico" }} 
      />
    </Stack.Navigator>
  )
}