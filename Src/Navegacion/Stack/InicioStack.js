import { createStackNavigator } from '@react-navigation/stack'
import Inicio from  '../../../screens/Inicio/Inicio';

const Stack = createStackNavigator();

export default function InicioStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name="Inicio"
                component={Inicio}
                options={{headerShown: false }}
            />

        </Stack.Navigator>
    )
}