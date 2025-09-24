// Src/Navegacion/NavegacionPrincipal.js (corregido - importaciones exactas)
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { getUserData } from "../Services/AuthService"
import { ActivityIndicator, View, Text } from "react-native"

// Pantallas de inicio según rol
import Inicio from "../../screens/Inicio/Inicio" // Para admin
import InicioDoctor from "../../screens/Inicio/InicioDoctor"
import InicioPaciente from "../../screens/Inicio/InicioPaciente"

// Pantallas de perfil y configuración (importaciones exactas)
import Perfiles from "../../screens/Perfil/perfiles"
import configuraciones from "../../screens/Configuracion/configuraciones"

// Stacks
import CitasStack from "./Stack/CitasStack"
import PacientesStack from "./Stack/PacientesStack"
import MedicosStack from "./Stack/MedicosStack"
import HistorialStack from "./Stack/HistorialStack"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Stack de navegación para Admin
function AdminStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InicioAdmin"
        component={Inicio}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CitasStack"
        component={CitasStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PacientesStack"
        component={PacientesStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicosStack"
        component={MedicosStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistorialStack"
        component={HistorialStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

// Stack de navegación para Doctor
function DoctorStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InicioDoctor"
        component={InicioDoctor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CitasStack"
        component={CitasStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PacientesStack"
        component={PacientesStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistorialStack"
        component={HistorialStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

// Stack de navegación para Paciente
function PacienteStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InicioPaciente"
        component={InicioPaciente}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CitasStack"
        component={CitasStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistorialStack"
        component={HistorialStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicosStack"
        component={MedicosStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

// Componente de carga
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  )
}

// Navegación principal según rol
export default function NavegacionPrincipal() {
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData()
        setUserRole(userData?.role || 'paciente')
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        setUserRole('paciente')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  // Determinar qué navegación mostrar según el rol
  const getTabNavigator = () => {
    switch (userRole) {
      case 'admin':
        return AdminTabs
      case 'doctor':
        return DoctorTabs
      case 'paciente':
        return PacienteTabs
      default:
        return PacienteTabs
    }
  }

  const RoleSpecificTabs = getTabNavigator()

  return <RoleSpecificTabs />
}

// Tabs para Admin
function AdminTabs() {
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
        component={AdminStackNavigator}
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

// Tabs para Doctor
function DoctorTabs() {
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
        component={DoctorStackNavigator}
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

// Tabs para Paciente
function PacienteTabs() {
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
        component={PacienteStackNavigator}
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

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
}