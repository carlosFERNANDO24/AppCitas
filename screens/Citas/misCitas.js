// screens/Citas/misCitas.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useState, useCallback } from "react"
import { getMyCitas, deleteMyCita } from "../../Src/Services/CitasPService"
import { Ionicons } from "@expo/vector-icons"

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
    const result = await getMyCitas()
    if (result.success) {
      setCitas(result.data)
    } else {
      Alert.alert("Error", result.error || "No se pudieron cargar tus citas.")
    }
    setLoading(false)
  }

  const handleEliminarCita = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            const result = await deleteMyCita(id)
            if (result.success) {
              Alert.alert("Éxito", "Cita eliminada correctamente.")
              cargarCitas()
            } else {
              Alert.alert("Error", result.error || "No se pudo eliminar la cita.")
            }
          },
        },
      ]
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.citaItem}
      onPress={() => navigation.navigate("MiDetalleCita", { cita: item })}
    >
      <View style={styles.citaInfo}>
        <Text style={styles.medico}>Dr(a). {item.medico?.nombre} {item.medico?.apellido}</Text>
        <Text style={styles.fecha}>{new Date(item.fecha_hora).toLocaleString()}</Text>
        <Text style={styles.motivo}>{item.motivo_consulta}</Text>
      </View>
      <View style={styles.citaActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditarMiCita", { cita: item })}
        >
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEliminarCita(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CrearMiCita")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Nueva Cita</Text>
      </TouchableOpacity>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes citas programadas.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  citaItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  citaInfo: { flex: 1 },
  medico: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  fecha: { fontSize: 14, color: "#666", marginTop: 4 },
  motivo: { fontSize: 14, color: "#333", marginTop: 4 },
  citaActions: { flexDirection: "row", gap: 10 },
  actionButton: { padding: 5 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
})