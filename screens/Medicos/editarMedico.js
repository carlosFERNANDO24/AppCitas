// screens/Medicos/editarMedico.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { updateMedico } from "../../Src/Services/MedicoService"

const especialidades = [
  "Cardiología",
  "Dermatología",
  "Endocrinología",
  "Gastroenterología",
  "Geriatría",
  "Ginecología",
  "Hematología",
  "Infectología",
  "Medicina Interna",
  "Nefrología",
  "Neurología",
  "Oftalmología",
  "Oncología",
  "Ortopedia",
  "Otorrinolaringología",
  "Pediatría",
  "Psiquiatría",
  "Radiología",
  "Reumatología",
  "Urología"
]

export default function EditarMedico() {
  const navigation = useNavigation()
  const route = useRoute()
  const [loading, setLoading] = useState(false)
  const [showEspecialidades, setShowEspecialidades] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    documento: "",
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    email: ""
  })

  useEffect(() => {
    if (route.params?.medico) {
      setFormData(route.params.medico)
    }
  }, [route.params])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.documento || !formData.nombre || !formData.apellido || !formData.especialidad) {
      Alert.alert("Error", "Documento, nombre, apellido y especialidad son obligatorios")
      return
    }

    setLoading(true)
    const result = await updateMedico(formData.id, formData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Médico actualizado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert("Error", result.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Editar Médico</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Documento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de documento"
            value={formData.documento}
            onChangeText={(text) => handleChange("documento", text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(text) => handleChange("apellido", text)}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Especialidad *</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowEspecialidades(true)}
          >
            <Text style={formData.especialidad ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.especialidad || "Seleccionar especialidad"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {loading ? "Actualizando..." : "Actualizar Médico"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de especialidades */}
      {showEspecialidades && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
              <TouchableOpacity onPress={() => setShowEspecialidades(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {especialidades.map((especialidad, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('especialidad', especialidad)
                    setShowEspecialidades(false)
                  }}
                >
                  <Text style={styles.modalItemText}>{especialidad}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
    marginBottom: 20,
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
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  selectButtonPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#2C3E50",
  },
})