// screens/Historial/miHistorial.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useState, useCallback } from "react"
import { getMyHistorial } from "../../Src/Services/HistorialPService"
import { Ionicons } from "@expo/vector-icons"

export default function MiHystorial() {
  const navigation = useNavigation()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      cargarHistorial()
    }, [])
  )

  const cargarHistorial = async () => {
    setLoading(true)
    const result = await getMyHistorial()
    if (result.success) {
      setHistorial(result.data)
    } else {
      Alert.alert("Error", result.error || "No se pudo cargar tu historial médico.")
    }
    setLoading(false)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historialItem}
      onPress={() => navigation.navigate("MiDetalleHistorial", { historial: item })}
    >
      <View style={styles.historialInfo}>
        <Text style={styles.diagnostico}>{item.diagnostico}</Text>
        <Text style={styles.fecha}>{new Date(item.fecha_consulta).toLocaleDateString()}</Text>
        <Text style={styles.medico}>Dr(a). {item.medico?.nombre} {item.medico?.apellido}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando historial...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes registros en tu historial médico.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  historialItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  historialInfo: { flex: 1 },
  diagnostico: { fontSize: 16, fontWeight: "bold", color: "#2C3E50" },
  fecha: { fontSize: 12, color: "#666", marginTop: 4 },
  medico: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
})