import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logoutUser } from "../../Src/Services/AuthService"
import api from "../../Src/Services/Conexion"
import { useState, useEffect } from "react"

export default function Perfiles() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargando(true)
        setError(null)
        
        const token = await AsyncStorage.getItem("userToken")
        if (token) {
          const response = await api.get('/me')
          setUsuario(response.data)
        } else {
          setError("No se encontró token de sesión")
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        setError("Error al cargar el perfil")
        
        if (error.response?.status === 401) {
          Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.")
          // Limpiar token inválido
          await AsyncStorage.removeItem("userToken")
        } else {
          Alert.alert("Error", "No se pudo cargar la información del perfil.")
        }
      } finally {
        setCargando(false)
      }
    }
    
    cargarPerfil()
  }, [])

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await logoutUser()
              if (result.success) {
                console.log("Logout exitoso, el sistema detectará la ausencia del token automáticamente...")
              } else {
                Alert.alert("Error", result.message || "Error al cerrar sesión")
              }
            } catch (error) {
              console.error("Error inesperado en logout:", error)
              Alert.alert("Error", "Ocurrió un error inesperado al cerrar sesión.")
            }
          }
        }
      ]
    )
  }

  if (cargando) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#2C3E50" />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        {usuario && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{usuario.nombre || usuario.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{usuario.email}</Text>
          </View>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#2C3E50" />
          <Text style={styles.menuText}>Información Personal</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
          <Text style={styles.menuText}>Notificaciones</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-outline" size={24} color="#2C3E50" />
          <Text style={styles.menuText}>Privacidad</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#2C3E50" />
          <Text style={styles.menuText}>Ayuda y Soporte</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color="#2C3E50" />
          <Text style={styles.menuText}>Acerca de</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 10,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: "#e74c3c",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 1,
    borderRadius: 8,
    elevation: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 16,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})