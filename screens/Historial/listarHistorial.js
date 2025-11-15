import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput, // 1. Importar TextInput
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getHistorial, deleteHistorial } from "../../Src/Services/HistorialService"

const historialEjemplo = [
  {
    id: "1",
    paciente_id: "1",
    paciente: { // Asumimos que la API devuelve el objeto paciente anidado
      nombre: "Juan Pérez",
      documento: "123456"
    },
    medico_id: "1",
    medico: {
      nombre: "Ana Gómez"
    },
    fecha_consulta: "2024-01-15",
    diagnostico: "Hipertensión arterial",
    tratamiento: "Control de presión y dieta baja en sal",
    notas: "Paciente estable, seguir control mensual",
  },
]

export default function ListarHistorial() {
  const navigation = useNavigation()
  
  // 2. Estados modificados y añadidos
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("") // Estado para el texto del buscador
  const [masterHistorial, setMasterHistorial] = useState([]) // Lista completa original
  const [filteredHistorial, setFilteredHistorial] = useState([]) // Lista filtrada a mostrar

  useEffect(() => {
    cargarHistorial()
  }, [])

  // 3. useEffect para manejar el filtrado
  useEffect(() => {
    if (searchQuery === "") {
      // Si no hay búsqueda, mostrar la lista completa
      setFilteredHistorial(masterHistorial)
    } else {
      // Filtrar la lista maestra
      const filteredData = masterHistorial.filter((item) => {
        // Usamos optional chaining (?.) por si 'paciente' o 'documento' son nulos
        return item.paciente?.documento
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      })
      setFilteredHistorial(filteredData)
    }
  }, [searchQuery, masterHistorial]) // Se ejecuta cuando la búsqueda o la lista maestra cambian

  const cargarHistorial = async () => {
    setLoading(true) // Asegurar que el loading se active
    try {
      const result = await getHistorial()
      if (result.success && result.data) {
        setMasterHistorial(result.data) // Guardar en la lista maestra
        // setFilteredHistorial(result.data) // El useEffect se encargará de esto
      } else {
        setMasterHistorial(historialEjemplo) // Fallback
      }
    } catch (error) {
      console.error("Error cargando historial:", error)
      setMasterHistorial(historialEjemplo) // Fallback en error
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
              // 4. Actualizar solo la lista maestra
              // El useEffect actualizará la lista filtrada automáticamente
              setMasterHistorial((prev) =>
                prev.filter((item) => item.id !== id)
              )
            } else {
              Alert.alert("Error", result.message)
            }
          },
        },
      ]
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historialItem}
      onPress={() => navigation.navigate("DetalleHistorial", { historial: item })}
    >
      <View style={styles.historialInfo}>
        <Text style={styles.paciente}>
          {item.paciente?.nombre || "Paciente Desconocido"}
        </Text>
        {/* Añadido para verificar la búsqueda */}
        <Text style={styles.documento}>
          Doc: {item.paciente?.documento || "N/A"}
        </Text> 
        <Text style={styles.medico}>
          Dr. {item.medico?.nombre || "Desconocido"}
        </Text>
        <Text style={styles.fecha}>Fecha: {item.fecha_consulta}</Text>
        <Text style={styles.diagnostico} numberOfLines={1}>
          Diagnóstico: {item.diagnostico}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditarHistorial", { historial: item })}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEliminar(item.id)}
          style={styles.deleteButton}
        >
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

      {/* 5. TextInput (Buscador) añadido */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por documento del paciente..."
          value={searchQuery}
          onChangeText={setSearchQuery} // Actualiza el estado en cada cambio
          placeholderTextColor="#888"
          clearButtonMode="while-editing" // Botón para limpiar (iOS)
        />
      </View>

      <FlatList
        data={filteredHistorial} // 6. Usar la lista filtrada
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? "Cargando..." : (searchQuery ? "No se encontraron registros." : "No hay registros de historial médico.")}
          </Text>
        }
      />
    </View>
  )
}

// 7. Estilos actualizados y añadidos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
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
  // --- Estilos del buscador ---
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: "#333",
  },
  // --- Fin estilos buscador ---
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
    color: "#2C3E50",
  },
  documento: { // Estilo para el documento añadido
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
    marginTop: 2,
  },
  medico: {
    color: "#007AFF",
    marginTop: 2,
    fontWeight: "500",
  },
  fecha: {
    color: "#555",
    marginTop: 2,
  },
  diagnostico: {
    color: "#666",
    marginTop: 4,
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
    color: "#666",
    fontSize: 16,
  },
})