// screens/Pacientes/listarPacientes.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getPacientes, deletePaciente } from "../../Src/Services/PacienteService"

const pacientesEjemplo = [
  {
    id: "1",
    documento: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "3001234567",
    email: "juan@email.com",
    fecha_nacimiento: "1990-05-15",
    genero: "M",
    direccion: "Calle 123 #45-67"
  }
]

export default function ListarPacientes() {
  const navigation = useNavigation()
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarPacientes()
  }, [])

  const cargarPacientes = async () => {
    try {
      const result = await getPacientes()
      if (result.success) {
        setPacientes(result.data)
      } else {
        setPacientes(pacientesEjemplo) // Usar datos de ejemplo si falla la API
      }
    } catch (error) {
      setPacientes(pacientesEjemplo)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este paciente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const result = await deletePaciente(id)
            if (result.success) {
              cargarPacientes()
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
      style={styles.pacienteItem} 
      onPress={() => navigation.navigate("DetallePaciente", { paciente: item })}
    >
      <View style={styles.pacienteInfo}>
        <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.documento}>Documento: {item.documento}</Text>
        <Text style={styles.telefono}>Tel: {item.telefono}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("EditarPaciente", { paciente: item })}>
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
        onPress={() => navigation.navigate("CrearPaciente")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Nuevo Paciente</Text>
      </TouchableOpacity>
      
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay pacientes registrados.</Text>
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
    backgroundColor: "#007AFF",
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
  pacienteItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pacienteInfo: {
    flex: 1,
  },
  nombre: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#2C3E50" 
  },
  documento: { 
    color: "#555", 
    marginTop: 2 
  },
  telefono: { 
    color: "#555", 
    marginTop: 2 
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