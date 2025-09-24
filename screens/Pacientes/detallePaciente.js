// screens/Pacientes/detallePaciente.js
import { ScrollView, View, Text, StyleSheet, Button } from "react-native"

export default function DetallePaciente({ route, navigation }) {
  const paciente = route?.params?.paciente || {
    documento: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "3001234567",
    email: "juan@email.com",
    fecha_nacimiento: "1990-05-15",
    genero: "M",
    direccion: "Calle 123 #45-67"
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detalle del Paciente</Text>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Documento</Text>
        <Text style={styles.value}>{paciente.documento}</Text>
        
        <Text style={styles.label}>Nombre Completo</Text>
        <Text style={styles.value}>{paciente.nombre} {paciente.apellido}</Text>
        
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{paciente.telefono}</Text>
        
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{paciente.email}</Text>
        
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <Text style={styles.value}>{paciente.fecha_nacimiento}</Text>
        
        <Text style={styles.label}>Género</Text>
        <Text style={styles.value}>{paciente.genero === "M" ? "Masculino" : "Femenino"}</Text>
        
        <Text style={styles.label}>Dirección</Text>
        <Text style={styles.value}>{paciente.direccion}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Editar Paciente" onPress={() => navigation.navigate("EditarPaciente", { paciente })} color="#007AFF" />
        <View style={{ height: 10 }} />
        <Button title="Volver" onPress={() => navigation.goBack()} color="#888" />
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
    marginTop: 10,
    textAlign: "center",
  },
  detailBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 12,
    fontSize: 16,
  },
  value: {
    marginBottom: 4,
    color: "#2C3E50",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
})