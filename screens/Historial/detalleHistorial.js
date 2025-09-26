// screens/Historial/detalleHistorial.js
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { deleteHistorial } from "../../Src/Services/HistorialService"

export default function DetalleHistorial() {
  const navigation = useNavigation()
  const route = useRoute()
  
  const historial = route?.params?.historial || {
    id: "1",
    paciente_nombre: "Juan Pérez",
    medico_nombre: "Dra. Ana Gómez",
    fecha_consulta: "2024-01-15",
    diagnostico: "Hipertensión arterial grado I",
    tratamiento: "Control de presión arterial cada 15 días. Dieta baja en sal. Ejercicio moderado 30 min/día.",
    notas: "Paciente se muestra colaborador. Seguir control mensual.",
    cita_id: "1"
  }

  const handleEliminar = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este registro de historial médico?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const result = await deleteHistorial(historial.id)
            if (result.success) {
              Alert.alert("Éxito", "Registro eliminado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
              ])
            } else {
              Alert.alert("Error", result.message)
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalle del Historial Médico</Text>
        <View style={styles.estadoBadge}>
          <Text style={styles.estadoText}>Consulta</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailItem}>
          <Ionicons name="person" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Paciente</Text>
            <Text style={styles.detailValue}>{historial.paciente?.nombre || 'Paciente Desconocido'}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="medical" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Médico</Text>
            <Text style={styles.detailValue}>{historial.medico?.nombre || 'Médico Desconocido'}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha de Consulta</Text>
            <Text style={styles.detailValue}>{historial.fecha_consulta}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Diagnóstico</Text>
          <Text style={styles.sectionValue}>{historial.diagnostico}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Tratamiento</Text>
          <Text style={styles.sectionValue}>{historial.tratamiento}</Text>
        </View>

        {historial.notas && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>Notas Adicionales</Text>
            <Text style={styles.sectionValue}>{historial.notas}</Text>
          </View>
        )}

        {historial.cita_id && (
          <View style={styles.detailItem}>
            <Ionicons name="document" size={20} color="#007AFF" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Cita Relacionada</Text>
              <Text style={styles.detailValue}>ID: {historial.cita_id}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate("EditarHistorial", { historial })}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleEliminar}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
    backgroundColor: "#34C759",
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
    textAlign: "justify",
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