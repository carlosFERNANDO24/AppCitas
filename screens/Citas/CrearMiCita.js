// screens/Citas/crearMiCita.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, FlatList, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { createMiCita } from "../../Src/Services/CitaService" // Asegúrate de tener esta función
import { getMedicos } from "../../Src/Services/MedicoService"

export default function CrearMiCita() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showMedicoModal, setShowMedicoModal] = useState(false)
  const [medicos, setMedicos] = useState([])

  const [formData, setFormData] = useState({
    medico_id: "",
    medico_nombre: "",
    fecha_hora: new Date(),
    estado: "programada",
    motivo_consulta: "",
    observaciones: "",
  })

  useEffect(() => {
    cargarMedicos()
  }, [])

  const cargarMedicos = async () => {
    setLoading(true)
    const result = await getMedicos()
    if (result.success) {
      setMedicos(result.data)
    } else {
      Alert.alert("Error", result.error || "No se pudieron cargar los médicos.")
    }
    setLoading(false)
  }

  const handleGuardar = async () => {
    if (!formData.medico_id || !formData.motivo_consulta) {
      Alert.alert("Error", "El médico y el motivo de la consulta son obligatorios.")
      return
    }

    setLoading(true)
    const result = await createMiCita({
      ...formData,
      fecha_hora: formData.fecha_hora.toISOString(),
    })

    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Cita creada correctamente.", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack()
          },
        },
      ])
    } else {
      Alert.alert("Error", result.error || "Error al crear la cita.")
    }
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formData.fecha_hora
    setShowDatePicker(false)
    setFormData({ ...formData, fecha_hora: currentDate })
  }

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || formData.fecha_hora
    setShowTimePicker(false)
    const newDateTime = new Date(formData.fecha_hora)
    newDateTime.setHours(currentTime.getHours())
    newDateTime.setMinutes(currentTime.getMinutes())
    setFormData({ ...formData, fecha_hora: newDateTime })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Fecha y Hora de la Cita</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{formData.fecha_hora.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{formData.fecha_hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={formData.fecha_hora}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={formData.fecha_hora}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}

        <Text style={styles.label}>Médico</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowMedicoModal(true)}>
          <Text>{formData.medico_nombre || "Seleccionar Médico"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Motivo de la Consulta</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej. Dolor de cabeza, chequeo general"
          value={formData.motivo_consulta}
          onChangeText={(text) => setFormData({ ...formData, motivo_consulta: text })}
          multiline
        />

        <Text style={styles.label}>Observaciones (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalles adicionales..."
          value={formData.observaciones}
          onChangeText={(text) => setFormData({ ...formData, observaciones: text })}
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar Cita</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMedicoModal}
        animationType="slide"
        onRequestClose={() => setShowMedicoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Seleccionar un Médico</Text>
            <FlatList
              data={medicos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData({ ...formData, medico_id: item.id, medico_nombre: `${item.nombre} ${item.apellido}` })
                    setShowMedicoModal(false)
                  }}
                >
                  <Text>{`${item.nombre} ${item.apellido}`}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMedicoModal(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 2 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#2C3E50" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  datePickerContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  datePickerButton: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, flex: 1, alignItems: "center", marginHorizontal: 4 },
  datePickerText: { fontSize: 16 },
  saveButton: { backgroundColor: "#007AFF", borderRadius: 8, padding: 15, alignItems: "center", marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 8 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "90%", maxHeight: "80%" },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  closeButton: { marginTop: 20, alignItems: "center" },
  closeButtonText: { color: "#007AFF", fontSize: 16 },
})