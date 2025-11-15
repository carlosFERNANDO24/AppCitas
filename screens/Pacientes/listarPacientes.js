// screens/Pacientes/listarPacientes.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native"
// Importamos useFocusEffect y useCallback
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
// Importamos useCallback
import { useState, useCallback } from "react"
import { getPacientes, deletePaciente } from "../../Src/Services/PacienteService"

const pacientesEjemplo = [{
  id: "1",
  documento: "12345678",
  nombre: "Juan",
  apellido: "Pérez",
  telefono: "3001234567",
  email: "juan@email.com",
  fecha_nacimiento: "1990-05-15",
  genero: "M",
  direccion: "Calle 123 #45-67"
}]

export default function ListarPacientes() {
  const navigation = useNavigation()
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)

  // Envolvemos la función de carga en useCallback para optimizar
  const cargarPacientes = useCallback(async () => {
    setLoading(true); // Mostrar loading en cada recarga
    try {
      const result = await getPacientes()
      if (result.success) {
        setPacientes(result.data)
      } else {
        console.log("Error al cargar pacientes, usando datos de ejemplo.");
        setPacientes(pacientesEjemplo) // Usar datos de ejemplo si falla la API
      }
    } catch (error) {
      console.error("Error en cargarPacientes:", error);
      setPacientes(pacientesEjemplo)
    } finally {
      setLoading(false)
    }
  }, []) // Dependencia vacía, la función no cambia

  // Usamos useFocusEffect para ejecutar la carga cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      // Esta función se ejecuta cada vez que la pantalla se enfoca
      console.log("Pantalla enfocada, cargando pacientes...");
      cargarPacientes()
    }, [cargarPacientes]) // La dependencia es la función memorizada
  )

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
            setLoading(true); // Mostramos carga mientras se elimina
            const result = await deletePaciente(id)
            if (result.success) {
              // Volvemos a cargar los pacientes después de eliminar
              cargarPacientes()
            } else {
              Alert.alert("Error", result.message)
              setLoading(false); // Quitamos la carga si hubo error
            }
          }
        }
      ]
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pacienteItem}
      // Navega al detalle al presionar el item
      onPress={() => navigation.navigate("DetallePaciente", { paciente: item })}
    >
      <View style={styles.pacienteInfo}>
        <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.documento}>Documento: {item.documento}</Text>
        <Text style={styles.telefono}>Tel: {item.telefono}</Text>
      </View>
      <View style={styles.actions}>
        {/* Botón Editar */}
        <TouchableOpacity onPress={() => navigation.navigate("EditarPaciente", { paciente: item })}>
          <Ionicons name="pencil" size={22} color="#007AFF" />
        </TouchableOpacity>
        {/* Botón Eliminar */}
        <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Botón para crear un nuevo paciente */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CrearPaciente")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Nuevo Paciente</Text>
      </TouchableOpacity>

      {/* Mostramos un texto mientras carga */}
      {loading ? (
        <Text style={styles.emptyText}>Cargando pacientes...</Text>
      ) : (
        // Mostramos la lista cuando termina de cargar
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          // Mensaje si la lista está vacía
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay pacientes registrados.</Text>
          }
        />
      )}
    </View>
  )
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1, // <-- Importante para que la FlatList funcione
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
    gap: 8, // Espacio entre el icono y el texto
    // Sombra para Android
    elevation: 3,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    // Sombra para Android
    elevation: 2,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pacienteInfo: {
    flex: 1, // Permite que ocupe el espacio disponible
  },
  nombre: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#2C3E50"
  },
  documento: {
    color: "#555",
    fontSize: 14,
    marginTop: 2
  },
  telefono: {
    color: "#555",
    fontSize: 14,
    marginTop: 2
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // Espacio entre los iconos de acción
  },
  deleteButton: {
    // No es necesario el margen izquierdo si usamos 'gap'
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
    fontSize: 16
  },
})