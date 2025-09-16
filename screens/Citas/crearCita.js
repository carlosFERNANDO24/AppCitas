import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from "react-native"

export default function CrearCita() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nueva Cita</Text>
      
      <View style={styles.formContainer}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Paciente</Text>
          <TextInput
            style={styles.input}
            placeholder="Seleccionar paciente"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Médico</Text>
          <TextInput
            style={styles.input}
            placeholder="Seleccionar médico"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha y Hora</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha y hora de la cita"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            placeholder="Estado de la cita"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Motivo de Consulta</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo de la consulta"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observaciones</Text>
          <TextInput
            style={styles.input}
            placeholder="Observaciones adicionales"
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})