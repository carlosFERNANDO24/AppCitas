// screens/Historial/crearHistorial.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, FlatList } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { createHistorial } from "../../Src/Services/HistorialService"
import { getPacientes } from "../../Src/Services/PacienteService"
import { getMedicos } from "../../Src/Services/MedicoService"
import { getCitas } from "../../Src/Services/CitaService"

export default function CrearHistorial() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPacienteModal, setShowPacienteModal] = useState(false)
  const [showMedicoModal, setShowMedicoModal] = useState(false)
  const [showCitaModal, setShowCitaModal] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [citas, setCitas] = useState([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    paciente_nombre: "",
    medico_id: "",
    medico_nombre: "",
    cita_id: "",
    fecha_consulta: new Date(),
    diagnostico: "",
    tratamiento: "",
    notas: ""
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [pacientesResult, medicosResult, citasResult] = await Promise.all([
        getPacientes(),
        getMedicos(),
        getCitas()
      ])

      if (pacientesResult.success) setPacientes(pacientesResult.data)
      if (medicosResult.success) setMedicos(medicosResult.data)
      if (citasResult.success) setCitas(citasResult.data)
    } catch (error) {
      console.error("Error cargando datos:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      handleChange('fecha_consulta', selectedDate)
    }
  }

  const handleSubmit = async () => {
    if (!formData.paciente_id || !formData.medico_id || !formData.diagnostico || !formData.tratamiento) {
      Alert.alert("Error", "Paciente, médico, diagnóstico y tratamiento son obligatorios")
      return
    }

    setLoading(true)
    
    const historialData = {
      paciente_id: formData.paciente_id,
      medico_id: formData.medico_id,
      cita_id: formData.cita_id || null,
      fecha_consulta: formData.fecha_consulta.toISOString().split('T')[0],
      diagnostico: formData.diagnostico,
      tratamiento: formData.tratamiento,
      notas: formData.notas
    }

    const result = await createHistorial(historialData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Historial médico creado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert("Error", result.message)
    }
  }

  const renderPacienteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleChange('paciente_id', item.id)
        handleChange('paciente_nombre', `${item.nombre} ${item.apellido}`)
        setShowPacienteModal(false)
      }}
    >
      <Text style={styles.modalItemText}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.modalItemSubtext}>Doc: {item.documento}</Text>
    </TouchableOpacity>
  )

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleChange('medico_id', item.id)
        handleChange('medico_nombre', `Dr. ${item.nombre} ${item.apellido}`)
        setShowMedicoModal(false)
      }}
    >
      <Text style={styles.modalItemText}>Dr. {item.nombre} {item.apellido}</Text>
      <Text style={styles.modalItemSubtext}>{item.especialidad}</Text>
    </TouchableOpacity>
  )

  const renderCitaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleChange('cita_id', item.id)
        setShowCitaModal(false)
      }}
    >
      <Text style={styles.modalItemText}>
        {item.paciente_nombre} - {new Date(item.fecha_hora).toLocaleDateString()}
      </Text>
      <Text style={styles.modalItemSubtext}>{item.motivo_consulta}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nuevo Historial Médico</Text>
      
      <View style={styles.formContainer}>
        {/* Selección de Paciente */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Paciente *</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowPacienteModal(true)}
          >
            <Text style={formData.paciente_nombre ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.paciente_nombre || "Seleccionar paciente"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Selección de Médico */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Médico *</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowMedicoModal(true)}
          >
            <Text style={formData.medico_nombre ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.medico_nombre || "Seleccionar médico"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Fecha de Consulta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Consulta *</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.selectButtonText}>
              {formData.fecha_consulta.toLocaleDateString('es-ES')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cita Relacionada */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cita Relacionada (Opcional)</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowCitaModal(true)}
          >
            <Text style={formData.cita_id ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.cita_id ? `Cita ID: ${formData.cita_id}` : "Seleccionar cita"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Diagnóstico */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diagnóstico *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Diagnóstico del paciente"
            value={formData.diagnostico}
            onChangeText={(text) => handleChange('diagnostico', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Tratamiento */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tratamiento *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tratamiento prescrito"
            value={formData.tratamiento}
            onChangeText={(text) => handleChange('tratamiento', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Notas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones y notas adicionales"
            value={formData.notas}
            onChangeText={(text) => handleChange('notas', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {loading ? "Creando Historial..." : "Crear Historial Médico"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha_consulta}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Modales de selección */}
      <Modal visible={showPacienteModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Paciente</Text>
              <TouchableOpacity onPress={() => setShowPacienteModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={pacientes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPacienteItem}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showMedicoModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Médico</Text>
              <TouchableOpacity onPress={() => setShowMedicoModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={medicos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMedicoItem}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showCitaModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Cita</Text>
              <TouchableOpacity onPress={() => setShowCitaModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={citas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCitaItem}
            />
          </View>
        </View>
      </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
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
    fontWeight: "bold",
    color: "#2C3E50",
  },
  modalItemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
})