import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function Inicio() {
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gestión Médica</Text>
      <View style={styles.gridContainer}>
        
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("CitasStack")}
        >
          <Text style={styles.cardTitle}>Citas</Text>
          <Text style={styles.cardSubtitle}>Gestionar agenda</Text>
          <Text style={styles.cardValue}>12 hoy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("HistorialStack")}
        >
          <Text style={styles.cardTitle}>Historial Médico</Text>
          <Text style={styles.cardSubtitle}>Expedientes</Text>
          <Text style={styles.cardValue}>345</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("MedicosStack")}
        >
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardSubtitle}>Especialistas</Text>
          <Text style={styles.cardValue}>15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PacientesStack")}
        >
          <Text style={styles.cardTitle}>Pacientes</Text>
          <Text style={styles.cardSubtitle}>Registrados</Text>
          <Text style={styles.cardValue}>428</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ConsultoriosStack")}
        >
          <Text style={styles.cardTitle}>Consultorios</Text>
          <Text style={styles.cardSubtitle}>Disponibles</Text>
          <Text style={styles.cardValue}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ReportesStack")}
        >
          <Text style={styles.cardTitle}>Reportes</Text>
          <Text style={styles.cardSubtitle}>Estadísticas</Text>
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
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  cardNote: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
})