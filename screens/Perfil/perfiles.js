import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getUserData, logoutUser } from "../../Src/Services/AuthService"

export default function Perfiles({ navigation }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarUsuario()
  }, [])

  const cargarUsuario = async () => {
    try {
      const userData = await getUserData()
      setUsuario(userData)
    } catch (error) {
      console.error("Error al cargar usuario:", error)
    } finally {
      setCargando(false)
    }
  }

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
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              } else {
                Alert.alert("Error", result.message || "Error al cerrar sesión")
              }
            } catch (error) {
              console.error("Error inesperado en logout:", error)
            }
          }
        }
      ]
    )
  }

  const getRoleColor = (role) => { // Cambiado el parámetro a 'role'
    switch(role) {
      case 'admin': return '#e74c3c'
      case 'doctor': return '#3498db'
      case 'paciente': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  const getRoleIcon = (role) => { // Cambiado el parámetro a 'role'
    switch(role) {
      case 'admin': return 'shield'
      case 'doctor': return 'medical'
      case 'paciente': return 'person'
      default: return 'person'
    }
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#2C3E50" />
        <Text style={styles.nombre}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        
        {usuario?.role && ( // Cambiado a 'role'
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(usuario.role) }]}>
            <Ionicons name={getRoleIcon(usuario.role)} size={16} color="#fff" />
            <Text style={styles.roleText}>{usuario.role.toUpperCase()}</Text> {/* Cambiado a 'role' */}
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{usuario?.nombre || 'No especificado'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{usuario?.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="key-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Rol:</Text>
          <Text style={styles.infoValue}>{usuario?.role || 'paciente'}</Text> {/* Cambiado a 'role' */}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 5,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  roleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2C3E50",
    textAlign: "center",
  },
})