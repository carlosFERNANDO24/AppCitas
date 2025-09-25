// screens/Citas/detalleCita.js
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { deleteCita } from "../../Src/Services/CitaService"

export default function DetalleCita() {
  const navigation = useNavigation()
  const route = useRoute()

  const cita = route?.params?.cita || {
    id: "1",
    paciente: { nombre: "Juan", apellido: "Pérez" },
    medico: { nombre: "Dra. Ana", apellido: "Gómez" },
    fecha_hora: "2024-01-20T10:00:00",
    estado: "programada",
    motivo_consulta: "Consulta general de rutina",
    observaciones: "Paciente viene por primera vez",
  }

  const handleEliminar = () => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await deleteCita(cita.id)
          if (result.success) {
            Alert.alert("Éxito", "Cita eliminada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }])
          } else {
            Alert.alert("Error", result.message)
          }
        },
      },
    ])
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "programada":
        return "#FFA500"
      case "confirmada":
        return "#007AFF"
      case "completada":
        return "#34C759"
      case "cancelada":
        return "#FF3B30"
      default:
        return "#666"
    }
  }

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPacienteNombre = () => {
    if (cita.paciente) {
      return `${cita.paciente.nombre || ""} ${cita.paciente.apellido || ""}`.trim()
    }
    return cita.paciente_nombre || "No especificado"
  }

  const getMedicoNombre = () => {
    if (cita.medico) {
      return `${cita.medico.nombre || ""} ${cita.medico.apellido || ""}`.trim()
    }
    return cita.medico_nombre || "No especificado"
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalle de la Cita</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          <Text style={styles.estadoText}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailItem}>
          <Ionicons name="person" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Paciente</Text>
            <Text style={styles.detailValue}>{getPacienteNombre()}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="medical" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Médico</Text>
            <Text style={styles.detailValue}>{getMedicoNombre()}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha y Hora</Text>
            <Text style={styles.detailValue}>{formatFecha(cita.fecha_hora)}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Motivo de Consulta</Text>
          <Text style={styles.sectionValue}>{cita.motivo_consulta}</Text>
        </View>

        {cita.observaciones && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>Observaciones</Text>
            <Text style={styles.sectionValue}>{cita.observaciones}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditarCita", { cita })}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleEliminar}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.backButtonText}>Volver a la lista</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 14,
    color: "#2C3E50",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  editButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
