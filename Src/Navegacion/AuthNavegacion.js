import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../../screens/Auth/LoginScreen"
import RegistroScreen from "../../screens/Auth/RegistroScreen"
import NavegacionPrincipal from "./NavegacionPrincipal"
import CitasStack from "./Stack/CitasStack"

const Stack = createStackNavigator()

export function AuthNavegacion() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: "Iniciar Sesión" }} 
      />
      <Stack.Screen 
        name="Registro" 
        component={RegistroScreen} 
        options={{ title: "Registro" }} 
      />
      <Stack.Screen 
        name="Main" 
        component={NavegacionPrincipal} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CitasStack" 
        component={CitasStack} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  )
}