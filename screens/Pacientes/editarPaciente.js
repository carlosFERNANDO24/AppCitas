// screens/Pacientes/editarPaciente.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import { updatePaciente } from "../../Src/Services/PacienteService"

export default function EditarPaciente() {
  const navigation = useNavigation()
  const route = useRoute()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    documento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: ""
  })

  useEffect(() => {
    if (route.params?.paciente) {
      setFormData(route.params.paciente)
    }
  }, [route.params])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.documento || !formData.nombre || !formData.apellido) {
      Alert.alert("Error", "Documento, nombre y apellido son obligatorios")
      return
    }

    setLoading(true)
    const result = await updatePaciente(formData.id, formData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Paciente actualizado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert("Error", result.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Editar Paciente</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Documento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de documento"
            value={formData.documento}
            onChangeText={(text) => handleChange("documento", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(text) => handleChange("apellido", text)}
          />
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.fecha_nacimiento}
            onChangeText={(text) => handleChange("fecha_nacimiento", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Género</Text>
          <TextInput
            style={styles.input}
            placeholder="M o F"
            value={formData.genero}
            onChangeText={(text) => handleChange("genero", text.toUpperCase())}
            maxLength={1}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Dirección completa"
            value={formData.direccion}
            onChangeText={(text) => handleChange("direccion", text)}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Actualizando..." : "Actualizar Paciente"}
          </Text>
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})