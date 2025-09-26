// screens/Historial/listarHistorial.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getHistorial, deleteHistorial } from "../../Src/Services/HistorialService"

const historialEjemplo = [
  {
    id: "1",
    paciente_id: "1",
    paciente_nombre: "Juan Pérez",
    medico_id: "1",
    medico_nombre: "Ana Gómez",
    fecha_consulta: "2024-01-15",
    diagnostico: "Hipertensión arterial",
    tratamiento: "Control de presión y dieta baja en sal",
    notas: "Paciente estable, seguir control mensual"
  }
]

export default function ListarHistorial() {
  const navigation = useNavigation()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    try {
      const result = await getHistorial()
      if (result.success) {
        setHistorial(result.data)
      } else {
        setHistorial(historialEjemplo)
      }
    } catch (error) {
      setHistorial(historialEjemplo)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const result = await deleteHistorial(id)
            if (result.success) {
              cargarHistorial()
            } else {
              Alert.alert("Error", result.message)
            }
          }
        }
      ]
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historialItem} 
      onPress={() => navigation.navigate("DetalleHistorial", { historial: item })}
    >
      <View style={styles.historialInfo}>
        <Text style={styles.paciente}>{item.paciente?.nombre || 'Paciente Desconocido'}</Text>
        <Text style={styles.medico}>Dr. {item.medico?.nombre || 'Desconocido'}</Text>
        <Text style={styles.fecha}>Fecha: {item.fecha_consulta}</Text>
        <Text style={styles.diagnostico} numberOfLines={1}>
          Diagnóstico: {item.diagnostico}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("EditarHistorial", { historial: item })}>
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate("CrearHistorial")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Nuevo Registro</Text>
      </TouchableOpacity>
      
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay registros de historial médico.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", 
    padding: 16 
  },
  createButton: {
    backgroundColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  historialInfo: {
    flex: 1,
  },
  paciente: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#2C3E50" 
  },
  medico: { 
    color: "#007AFF", 
    marginTop: 2,
    fontWeight: "500",
  },
  fecha: { 
    color: "#555", 
    marginTop: 2 
  },
  diagnostico: { 
    color: "#666", 
    marginTop: 4,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    marginLeft: 8,
  },
  emptyText: { 
    textAlign: "center", 
    marginTop: 50, 
    color: "#666" 
  },
})