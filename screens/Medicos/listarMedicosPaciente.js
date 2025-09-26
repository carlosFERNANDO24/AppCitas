// screens/Medicos/listarMedicosPaciente.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useState, useCallback } from "react"

import { getMedicosForPaciente } from "../../Src/Services/MedicoPService"

export default function ListarMedicosPaciente() {
  const navigation = useNavigation()
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      cargarMedicos()
    }, [])
  )

  const cargarMedicos = async () => {
    setLoading(true)
    const result = await getMedicosForPaciente()
    if (result.success) {
      setMedicos(result.data)
    } else {
      Alert.alert("Error", result.error || "No se pudieron cargar los médicos.")
    }
    setLoading(false)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.medicoItem}
      onPress={() => navigation.navigate("DetalleMedico", { medico: item })}
    >
      <View style={styles.medicoInfo}>
        <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.especialidad}>{item.especialidad}</Text>
        <Text style={styles.contacto}>Tel: {item.telefono}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando médicos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay médicos disponibles.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  medicoItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  medicoInfo: { flex: 1 },
  nombre: { fontWeight: "bold", fontSize: 16, color: "#2C3E50" },
  especialidad: { color: "#007AFF", fontSize: 14, marginTop: 4 },
  contacto: { color: "#666", fontSize: 12, marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#666" },
})