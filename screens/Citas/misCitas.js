// screens/Citas/misCitas.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useCallback } from "react"
import { getMisCitas } from "../../Src/Services/CitasPService"

export default function MisCitas() {
  const navigation = useNavigation()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      cargarCitas()
    }, [])
  )

  const cargarCitas = async () => {
    setLoading(true)
    const result = await getMisCitas()
    if (result.success) {
      setCitas(result.data)
    } else {
      Alert.alert("Error", result.error || "No se pudieron cargar tus citas.")
    }
    setLoading(false)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "programada": return "#FFA500"
      case "confirmada": return "#007AFF"
      case "completada": return "#34C759"
      case "cancelada": return "#FF3B30"
      default: return "#666"
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

  const getMedicoNombre = (cita) => {
    return cita.medico?.nombre || cita.medico_nombre || "Médico no especificado"
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.citaItem}
      onPress={() => navigation.navigate("MiDetalleCita", { cita: item })}
    >
      <View style={styles.citaInfo}>
        <View style={styles.citaHeader}>
          <Text style={styles.paciente}>{getPacienteNombre(item)}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}</Text>
          </View>
        </View>
        <Text style={styles.medico}>Dr(a). {getMedicoNombre(item)}</Text>
        <Text style={styles.fecha}>{formatFecha(item.fecha_hora)}</Text>
        <Text style={styles.motivo} numberOfLines={1}>
          {item.motivo_consulta}
        </Text>
      </View>
    </TouchableOpacity>
  )

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
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CrearMiCita")}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Nueva Cita</Text>
      </TouchableOpacity>

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No tienes citas programadas</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate("CrearMiCita")}>
              <Text style={styles.emptyButtonText}>Crear primera cita</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
    loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
    createButton: { backgroundColor: "#007AFF", borderRadius: 8, padding: 15, marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, elevation: 2 },
    createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    citaItem: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    citaInfo: { flex: 1 },
    citaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
    paciente: { fontWeight: "bold", fontSize: 16, color: "#2C3E50", flex: 1, marginRight: 10 },
    estadoBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    estadoText: { color: "#fff", fontWeight: "bold", fontSize: 10 },
    medico: { color: "#007AFF", fontSize: 14, fontWeight: "500", marginBottom: 2 },
    fecha: { color: "#666", fontSize: 12, marginBottom: 4 },
    motivo: { color: "#555", fontSize: 12, fontStyle: "italic" },
    emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    emptyText: { fontSize: 16, color: "#666", marginTop: 10, marginBottom: 20 },
    emptyButton: { backgroundColor: "#007AFF", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    emptyButtonText: { color: "#fff", fontWeight: "bold" },
})