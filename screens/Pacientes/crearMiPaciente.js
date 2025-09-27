// screens/Pacientes/crearMiPaciente.js
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useState } from "react"
import { createMyPaciente } from "../../Src/Services/PacientePService"
import { useNavigation } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"

export default function CrearMiPaciente() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    documento: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "M",
    telefono: "",
    direccion: "",
  })

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const result = await createMyPaciente(formData)
    if (result.success) {
      Alert.alert("Éxito", result.message)
      navigation.goBack() 
    } else {
      Alert.alert("Error", result.message || "No se pudo crear el perfil de paciente.")
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
      <Text style={styles.header}>Completa tu Perfil</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          value={formData.documento}
          onChangeText={(text) => handleChange("documento", text)}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={formData.apellido}
          onChangeText={(text) => handleChange("apellido", text)}
        />

        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.fecha_nacimiento}
          onChangeText={(text) => handleChange("fecha_nacimiento", text)}
        />
        
        <Text style={styles.label}>Género</Text>
        <Picker
          selectedValue={formData.genero}
          style={styles.input}
          onValueChange={(itemValue) => handleChange("genero", itemValue)}
        >
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Femenino" value="F" />
        </Picker>

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={formData.telefono}
          onChangeText={(text) => handleChange("telefono", text)}
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={formData.direccion}
          onChangeText={(text) => handleChange("direccion", text)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Crear Perfil" onPress={handleSubmit} color="#007AFF" />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  formContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: { marginTop: 20 },
})