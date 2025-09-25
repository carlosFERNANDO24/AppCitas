"use client"

// screens/Citas/listarCitas.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getCitas, getMisCitas, deleteCita } from "../../Src/Services/CitaService"
import AsyncStorage from "@react-native-async-storage/async-storage"

const citasEjemplo = [
  {
    id: "1",
    paciente_nombre: "Juan Pérez",
    medico_nombre: "Dra. Ana Gómez",
    fecha_hora: "2024-01-20T10:00:00",
    estado: "programada",
    motivo_consulta: "Consulta general",
  },
]

export default function ListarCitas() {
  const navigation = useNavigation()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    cargarRolUsuario()
  }, [])

  useEffect(() => {
    if (userRole !== null) {
      cargarCitas()
    }
  }, [userRole])

  const cargarRolUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      const userType = await AsyncStorage.getItem("userType")
      const isAdmin = await AsyncStorage.getItem("isAdmin")
      const isDoctor = await AsyncStorage.getItem("isDoctor")
      const savedRole = await AsyncStorage.getItem("userRole")

      console.log(
        "[v0] Role detection - userType:",
        userType,
        "isAdmin:",
        isAdmin,
        "isDoctor:",
        isDoctor,
        "savedRole:",
        savedRole,
      )

      let role = "paciente" // default

      // Priority order: explicit role > admin flag > doctor flag > userType
      if (savedRole === "admin" || isAdmin === "true" || userType === "admin") {
        role = "admin"
      } else if (savedRole === "doctor" || isDoctor === "true" || userType === "doctor") {
        role = "doctor"
      } else if (savedRole === "paciente" || userType === "paciente") {
        role = "paciente"
      } else if (!token) {
        // No token means likely not logged in - default to admin to prevent getMisCitas
        role = "admin"
      }

      console.log("[v0] Final determined role:", role)
      setUserRole(role)
    } catch (error) {
      console.error("Error cargando rol:", error)
      setUserRole("admin")
    }
  }

  const cargarCitas = async () => {
    try {
      console.log("[v0] Loading citas for role:", userRole)
      let result

      if (userRole === "paciente") {
        console.log("[v0] Using getMisCitas for paciente")
        result = await getMisCitas()
      } else if (userRole === "admin" || userRole === "doctor") {
        console.log("[v0] Using getCitas for admin/doctor")
        result = await getCitas()
      } else {
        // Fallback for unknown roles - use getCitas to be safe
        console.log("[v0] Unknown role, defaulting to getCitas")
        result = await getCitas()
      }

      if (result.success) {
        setCitas(result.data)
      } else {
        console.log("[v0] API call failed, using example data")
        setCitas(citasEjemplo)
      }
    } catch (error) {
      console.error("[v0] Error loading citas:", error)
      setCitas(citasEjemplo)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = (id) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await deleteCita(id)
          if (result.success) {
            cargarCitas()
          } else {
            Alert.alert("Error", result.message)
          }
        },
      },
    ])
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "programada":
        return "#FFA500"
      case "confirmada":
        return "#007AFF"
      case "completada":
        return "#34C759"
      case "cancelada":
        return "#FF3B30"
      default:
        return "#666"
    }
  }

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPacienteNombre = (cita) => {
    if (cita.paciente && (cita.paciente.nombre || cita.paciente.apellido)) {
      const nombre = cita.paciente.nombre || ""
      const apellido = cita.paciente.apellido || ""
      return `${nombre} ${apellido}`.trim()
    }
    return cita.paciente_nombre || "Paciente no especificado"
  }

  const getMedicoNombre = (cita) => {
    if (cita.medico && (cita.medico.nombre || cita.medico.apellido)) {
      const nombre = cita.medico.nombre || ""
      const apellido = cita.medico.apellido || ""
      return `${nombre} ${apellido}`.trim()
    }
    return cita.medico_nombre || "Médico no especificado"
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.citaItem} onPress={() => navigation.navigate("DetalleCita", { cita: item })}>
      <View style={styles.citaInfo}>
        <View style={styles.citaHeader}>
          <Text style={styles.paciente}>{getPacienteNombre(item)}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}</Text>
          </View>
        </View>

        <Text style={styles.medico}>{getMedicoNombre(item)}</Text>
        <Text style={styles.fecha}>{formatFecha(item.fecha_hora)}</Text>
        <Text style={styles.motivo} numberOfLines={1}>
          {item.motivo_consulta}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("EditarCita", { cita: item })} style={styles.actionButton}>
          <Ionicons name="pencil" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.actionButton}>
          <Ionicons name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  if (userRole === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil de usuario...</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {(userRole === "admin" || userRole === "doctor") && (
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CrearCita")}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Nueva Cita</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {userRole === "paciente" ? "No tienes citas programadas" : "No hay citas programadas"}
            </Text>
            {(userRole === "admin" || userRole === "doctor") && (
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate("CrearCita")}>
                <Text style={styles.emptyButtonText}>Crear primera cita</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshing={loading}
        onRefresh={cargarCitas}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  createButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  citaItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  citaInfo: {
    flex: 1,
  },
  citaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  paciente: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2C3E50",
    flex: 1,
    marginRight: 10,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },
  medico: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  fecha: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  motivo: {
    color: "#555",
    fontSize: 12,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
