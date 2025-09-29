// Src/Navegacion/Stack/MedicosPStack.js

import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../../../context/ThemeContext";
import ListarMedicos from "../../../screens/Medicos/listarMedicos";

const Stack = createStackNavigator();

export default function MedicosPStack() {
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
        name="ListarMedicos"
        component={ListarMedicos}
        options={{ title: "Listar Médicos" }}
      />
    </Stack.Navigator>
  );
}