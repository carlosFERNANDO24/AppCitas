import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

const citasEjemplo = [
  {
    id: "1",
    paciente: "Juan Pérez",
    medico: "Dra. Ana Gómez",
    fecha: "2024-06-10",
    hora: "10:30 AM",
    motivo: "Consulta general",
    estado: "Pendiente",
  },
  {
    id: "2",
    paciente: "María López",
    medico: "Dr. Carlos Ruiz",
    fecha: "2024-06-11",
    hora: "2:00 PM",
    motivo: "Control de presión",
    estado: "Confirmada",
  },
  {
    id: "3",
    paciente: "Pedro García",
    medico: "Dra. Laura Martín",
    fecha: "2024-06-12",
    hora: "9:15 AM",
    motivo: "Revisión anual",
    estado: "Pendiente",
  },
]

export default function ListarCitas() {
  const navigation = useNavigation()

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.citaItem} 
      onPress={() => navigation.navigate("DetalleCita", { cita: item })}
    >
      <Text style={styles.paciente}>{item.paciente}</Text>
      <Text style={styles.detalle}>
        {item.fecha} - {item.hora}
      </Text>
      <Text style={styles.detalle}>{item.medico}</Text>
      <Text style={[styles.estado, { color: item.estado === "Confirmada" ? "#28a745" : "#ffc107" }]}>
        {item.estado}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate("CrearCita")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Nueva Cita</Text>
      </TouchableOpacity>
      
      <FlatList
        data={citasEjemplo}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay citas registradas.</Text>
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
  citaItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  paciente: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#2C3E50" 
  },
  detalle: { 
    color: "#555", 
    marginTop: 2 
  },
  estado: { 
    fontWeight: "bold", 
    marginTop: 4 
  },
  emptyText: { 
    textAlign: "center", 
    marginTop: 50, 
    color: "#666" 
  },
})