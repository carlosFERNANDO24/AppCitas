import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons, Feather } from "@expo/vector-icons"
import Inicio from "../../screens/Inicio/Inicio"
import Perfiles from "../../screens/Perfil/perfiles"
import configuraciones from "../../screens/Configuracion/configuraciones"
import CitasStack from "../Navegacion/Stack/CitasStack"

const Tab = createBottomTabNavigator()

export default function NavegacionPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#eef6d7",
          borderTopWidth: 1,
          borderTopColor: "#3d481d",
          height: 60, 
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "#808080",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: "Inicio",
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfiles}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          tabBarLabel: "Perfil",
        }}
      />
      <Tab.Screen
        name="Configuración"
        component={configuraciones}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          tabBarLabel: "Configuración",
        }}
      />
    </Tab.Navigator>
  )
}
