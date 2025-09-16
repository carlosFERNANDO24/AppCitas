import { ScrollView, View, Text, StyleSheet, Button } from "react-native"

export default function DetalleCita({ route, navigation }) {
  // Recibe los datos de la cita por route.params
  const cita = route?.params?.cita || {
    paciente: "Juan Pérez",
    medico: "Dra. Ana Gómez",
    fecha: "2024-06-10",
    hora: "10:30 AM",
    motivo: "Consulta general",
    estado: "Pendiente",
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detalle de la Cita</Text>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Paciente</Text>
        <Text style={styles.value}>{cita.paciente}</Text>
        <Text style={styles.label}>Médico</Text>
        <Text style={styles.value}>{cita.medico}</Text>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{cita.fecha}</Text>
        <Text style={styles.label}>Hora</Text>
        <Text style={styles.value}>{cita.hora}</Text>
        <Text style={styles.label}>Motivo</Text>
        <Text style={styles.value}>{cita.motivo}</Text>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.value}>{cita.estado}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Editar Cita" onPress={() => navigation.navigate("EditarCita", { cita })} color="#007AFF" />
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
    marginTop: 8,
  },
  value: {
    marginBottom: 4,
    color: "#2C3E50",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
})
