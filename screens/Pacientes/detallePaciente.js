// screens/Pacientes/detallePaciente.js
import { ScrollView, View, Text, StyleSheet, Button, ActivityIndicator } from "react-native"
// Importamos los hooks necesarios
import { useFocusEffect } from "@react-navigation/native"
import { useState, useCallback } from "react"
// Asumimos que existe esta función en tu servicio
import { getPacienteById } from "../../Src/Services/PacienteService"

export default function DetallePaciente({ route, navigation }) {
  // 1. Obtenemos el paciente inicial de los parámetros de la ruta
  const pacienteInicial = route?.params?.paciente

  // 2. Lo guardamos en un estado local para poder actualizarlo
  const [paciente, setPaciente] = useState(pacienteInicial)
  const [loading, setLoading] = useState(false)

  // 3. Creamos la función para recargar el paciente
  const cargarPaciente = useCallback(async () => {
    // Si no hay un ID inicial, no podemos hacer nada
    if (!pacienteInicial?.id) return

    setLoading(true)
    try {
      // Llamamos al servicio para obtener los datos más frescos
      // Asegúrate de que tu servicio tenga una función 'getPacienteById'
      const result = await getPacienteById(pacienteInicial.id)
      if (result.success) {
        setPaciente(result.data) // Actualizamos el estado con los datos nuevos
      } else {
        // Si falla, mantenemos los datos que teníamos
        console.log("Error recargando paciente:", result.message)
      }
    } catch (error) {
      console.error("Error en cargarPaciente:", error)
    } finally {
      setLoading(false)
    }
  }, [pacienteInicial?.id]) 

 
  useFocusEffect(
    useCallback(() => {
      console.log("Detalle enfocado, recargando datos...");
      cargarPaciente()
    }, [cargarPaciente])
  )

  
  if (loading && !paciente) { // Mostar carga solo si no hay paciente
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }


  if (!paciente) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.value}>No se pudo cargar la información del paciente.</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} color="#888" />
      </View>
    )
  }

  // 6. El resto del componente renderiza desde el *estado* 'paciente'
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detalle del Paciente</Text>
      
      {/* Mostramos un loader pequeño si está recargando */}
      {loading && (
        <View style={styles.reloadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.reloadingText}>Actualizando...</Text>
        </View>
      )}
      
      <View style={styles.detailBox}>
        <Text style={styles.label}>Documento</Text>
        <Text style={styles.value}>{paciente.documento}</Text>

        <Text style={styles.label}>Nombre Completo</Text>
        <Text style={styles.value}>{paciente.nombre} {paciente.apellido}</Text>

        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{paciente.telefono}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{paciente.email}</Text>

        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <Text style={styles.value}>{paciente.fecha_nacimiento}</Text>

        <Text style={styles.label}>Género</Text>
        <Text style={styles.value}>{paciente.genero === "M" ? "Masculino" : "Femenino"}</Text>

        <Text style={styles.label}>Dirección</Text>
        <Text style={styles.value}>{paciente.direccion}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {/* Pasamos el paciente del *estado* (actualizado) a la pantalla de edición */}
        <Button title="Editar Paciente" onPress={() => navigation.navigate("EditarPaciente", { paciente })} color="#007AFF" />
        <View style={{ height: 10 }} />
        <Button title="Volver" onPress={() => navigation.goBack()} color="#888" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 10,
    color: "#007AFF"
  },
  reloadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  reloadingText: {
    color: "#007AFF",
    fontSize: 14,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  detailBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 12,
    fontSize: 16,
  },
  value: {
    marginBottom: 4,
    color: "#2C3E50",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
})