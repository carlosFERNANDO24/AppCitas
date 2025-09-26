// screens/Historial/miHistorial.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getMiHistorial } from "../../Src/Services/HistorialService"

export default function MiHistorial() {
  const navigation = useNavigation()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    setLoading(true)
    const result = await getMiHistorial()
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
        <Text style={styles.fecha}>{new Date(item.fecha_consulta).toLocaleDateString()}</Text>
        <Text style={styles.diagnostico}>{item.diagnostico}</Text>
        <Text style={styles.medico}>Dr(a). {item.medico.nombre} {item.medico.apellido}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes registros en tu historial médico.</Text>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  historialItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historialInfo: { flex: 1 },
  fecha: { fontSize: 12, color: "#666", marginBottom: 4 },
  diagnostico: { fontWeight: "bold", fontSize: 16, color: "#2C3E50" },
  medico: { color: "#007AFF", fontSize: 14, marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
})