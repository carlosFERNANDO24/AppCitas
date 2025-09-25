"use client"

// screens/Citas/crearCita.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, FlatList } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { createCita } from "../../Src/Services/CitaService"
import { getPacientes } from "../../Src/Services/PacienteService"
import { getMedicos } from "../../Src/Services/MedicoService"

export default function CrearCita() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showPacienteModal, setShowPacienteModal] = useState(false)
  const [showMedicoModal, setShowMedicoModal] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    paciente_nombre: "",
    medico_id: "",
    medico_nombre: "",
    fecha_hora: new Date(),
    estado: "programada",
    motivo_consulta: "",
    observaciones: "",
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [pacientesResult, medicosResult] = await Promise.all([getPacientes(), getMedicos()])

      if (pacientesResult.success) setPacientes(pacientesResult.data)
      if (medicosResult.success) setMedicos(medicosResult.data)
    } catch (error) {
      console.error("Error cargando datos:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const newDate = new Date(formData.fecha_hora)
      newDate.setFullYear(selectedDate.getFullYear())
      newDate.setMonth(selectedDate.getMonth())
      newDate.setDate(selectedDate.getDate())
      handleChange("fecha_hora", newDate)
    }
  }

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(formData.fecha_hora)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      handleChange("fecha_hora", newDate)
    }
  }

  const formatDateTime = (date) => {
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmit = async () => {
    if (!formData.paciente_id || !formData.medico_id || !formData.motivo_consulta) {
      Alert.alert("Error", "Paciente, médico y motivo de consulta son obligatorios")
      return
    }

    setLoading(true)

    const citaData = {
      paciente_id: formData.paciente_id,
      medico_id: formData.medico_id,
      fecha_hora: formData.fecha_hora.toISOString(),
      estado: formData.estado,
      motivo_consulta: formData.motivo_consulta,
      observaciones: formData.observaciones,
    }

    const result = await createCita(citaData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Cita creada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }])
    } else {
      Alert.alert("Error", result.message)
    }
  }

  const renderPacienteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleChange("paciente_id", item.id)
        handleChange("paciente_nombre", `${item.nombre} ${item.apellido}`)
        setShowPacienteModal(false)
      }}
    >
      <Text style={styles.modalItemText}>
        {item.nombre} {item.apellido}
      </Text>
      <Text style={styles.modalItemSubtext}>Doc: {item.documento}</Text>
    </TouchableOpacity>
  )

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        handleChange("medico_id", item.id)
        handleChange("medico_nombre", `Dr. ${item.nombre} ${item.apellido}`)
        setShowMedicoModal(false)
      }}
    >
      <Text style={styles.modalItemText}>
        Dr. {item.nombre} {item.apellido}
      </Text>
      <Text style={styles.modalItemSubtext}>{item.especialidad}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nueva Cita Médica</Text>

      <View style={styles.formContainer}>
        {/* Selección de Paciente */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Paciente *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowPacienteModal(true)}>
            <Text style={formData.paciente_nombre ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.paciente_nombre || "Seleccionar paciente"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Selección de Médico */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Médico *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowMedicoModal(true)}>
            <Text style={formData.medico_nombre ? styles.selectButtonText : styles.selectButtonPlaceholder}>
              {formData.medico_nombre || "Seleccionar médico"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha y Hora *</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={20} color="#007AFF" />
              <Text style={styles.datetimeText}>{formData.fecha_hora.toLocaleDateString("es-ES")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time" size={20} color="#007AFF" />
              <Text style={styles.datetimeText}>
                {formData.fecha_hora.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.radioContainer}>
            {["programada", "confirmada", "completada", "cancelada"].map((estado) => (
              <TouchableOpacity key={estado} style={styles.radioOption} onPress={() => handleChange("estado", estado)}>
                <View style={styles.radioCircle}>
                  {formData.estado === estado && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioText}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivo de Consulta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Motivo de Consulta *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describa el motivo de la consulta"
            value={formData.motivo_consulta}
            onChangeText={(text) => handleChange("motivo_consulta", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Observaciones */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observaciones</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones adicionales"
            value={formData.observaciones}
            onChangeText={(text) => handleChange("observaciones", text)}
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
          <Text style={styles.saveButtonText}>{loading ? "Creando Cita..." : "Crear Cita"}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker value={formData.fecha_hora} mode="time" display="default" onChange={handleTimeChange} />
      )}

      {/* Modal de Selección de Paciente */}
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
              ListEmptyComponent={<Text style={styles.emptyText}>No hay pacientes disponibles</Text>}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Selección de Médico */}
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
              ListEmptyComponent={<Text style={styles.emptyText}>No hay médicos disponibles</Text>}
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
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datetimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
    backgroundColor: "#fff",
  },
  datetimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2C3E50",
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  radioText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
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
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
})
