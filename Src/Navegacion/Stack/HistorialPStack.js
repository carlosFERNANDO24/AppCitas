// Src/Navegacion/Stack/HistorialPStack.js
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../../../context/ThemeContext";
import MiHistorial from "../../../screens/Historial/miHistorial";
import MiDetalleHistorial from "../../../screens/Historial/miDetalleHistorial";

const Stack = createStackNavigator();

export default function HistorialPStack() {
  const { darkMode } = useTheme();

  const headerStyles = {
    headerStyle: {
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
    },
    headerTintColor: darkMode ? '#fff' : '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  return (
    <Stack.Navigator screenOptions={headerStyles}>
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
  );
}