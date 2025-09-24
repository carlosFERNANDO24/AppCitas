// screens/Medicos/detalleMedico.js
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { deleteMedico } from "../../Src/Services/MedicoService"

export default function DetalleMedico() {
  const navigation = useNavigation()
  const route = useRoute()
  
  const medico = route?.params?.medico || {
    id: "1",
    documento: "12345678",
    nombre: "Ana",
    apellido: "Gómez",
    especialidad: "Cardiología",
    telefono: "3001234567",
    email: "ana.gomez@hospital.com",
    created_at: "2024-01-01"
  }

  const handleEliminar = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este médico?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const result = await deleteMedico(medico.id)
            if (result.success) {
              Alert.alert("Éxito", "Médico eliminado correctamente", [
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
        <View style={styles.avatar}>
          <Ionicons name="medical" size={40} color="#fff" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Dr. {medico.nombre} {medico.apellido}</Text>
          <Text style={styles.especialidad}>{medico.especialidad}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <View style={styles.detailItem}>
          <Ionicons name="document" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Documento</Text>
            <Text style={styles.detailValue}>{medico.documento}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="call" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Teléfono</Text>
            <Text style={styles.detailValue}>{medico.telefono}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="mail" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{medico.email}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha de Registro</Text>
            <Text style={styles.detailValue}>
              {new Date(medico.created_at).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>Citas este mes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Pacientes activos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfacción</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate("EditarMedico", { medico })}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar Médico</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleEliminar}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar Médico</Text>
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
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
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