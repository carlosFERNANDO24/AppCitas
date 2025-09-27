// screens/Citas/editarMiCita.js
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { updateMyCita } from "../../Src/Services/CitasPService"
import { getMedicos } from "../../Src/Services/MedicoService"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"

export default function EditarMiCita() {
  const route = useRoute()
  const navigation = useNavigation()
  const { cita } = route.params
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fecha_hora: cita.fecha_hora,
    estado: cita.estado,
    motivo_consulta: cita.motivo_consulta,
    observaciones: cita.observaciones,
    medico_id: cita.medico_id,
  })

  useEffect(() => {
    const cargarMedicos = async () => {
      const result = await getMedicos()
      if (result.success) {
        setMedicos(result.data)
      }
      setLoading(false)
    }
    cargarMedicos()
  }, [])

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const result = await updateMyCita(cita.id, formData)
    if (result.success) {
      Alert.alert("Éxito", "Cita actualizada correctamente.")
      navigation.goBack()
    } else {
      Alert.alert("Error", result.error || "No se pudo actualizar la cita.")
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Fecha y Hora</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:mm:ss"
        value={formData.fecha_hora}
        onChangeText={(text) => handleChange("fecha_hora", text)}
      />

      <Text style={styles.label}>Estado</Text>
      <Picker
        style={styles.picker}
        selectedValue={formData.estado}
        onValueChange={(itemValue) => handleChange("estado", itemValue)}
      >
        <Picker.Item label="Programada" value="programada" />
        <Picker.Item label="Completada" value="completada" />
        <Picker.Item label="Cancelada" value="cancelada" />
      </Picker>

      <Text style={styles.label}>Motivo de la Consulta</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={formData.motivo_consulta}
        onChangeText={(text) => handleChange("motivo_consulta", text)}
      />

      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={formData.observaciones}
        onChangeText={(text) => handleChange("observaciones", text)}
      />

      <Text style={styles.label}>Médico</Text>
      <Picker
        style={styles.picker}
        selectedValue={formData.medico_id}
        onValueChange={(itemValue) => handleChange("medico_id", itemValue)}
      >
        {medicos.map((medico) => (
          <Picker.Item key={medico.id} label={`${medico.nombre} ${medico.apellido}`} value={medico.id} />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Actualizar Cita" onPress={handleSubmit} color="#007AFF" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: { marginTop: 20 },
})