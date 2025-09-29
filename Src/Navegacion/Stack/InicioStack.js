// Src/Navegacion/Stack/InicioStack.js
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../../../context/ThemeContext';
import Inicio from '../../../screens/Inicio/Inicio';

const Stack = createStackNavigator();

export default function InicioStack() {
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
                name="Inicio"
                component={Inicio}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}