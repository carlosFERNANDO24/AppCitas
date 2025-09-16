import { createStackNavigator } from '@react-navigation/stack';
import DetalleHistorial from '../../screens/HistorialMedico/DetalleHistorial';
import EditarHistorial from '../../screens/HistorialMedico/EditarHistorial';
import ListarHistorial from '../../screens/HistorialMedico/ListarHistorial';

const Stack = createStackNavigator();

export default function HistorialMedicoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListarHistorial"
       component={ListarHistorial}
        options={{ title: 'Historial Médico' }}
         />
      <Stack.Screen name="DetalleHistorial"
       component={DetalleHistorial} 
       options={{ title: 'Detalle Historial' }}
     />
      <Stack.Screen name="EditarHistorial"
       component={EditarHistorial} 
       options={{ title: 'Editar Historial' }}
     />
    </Stack.Navigator>
  );
}