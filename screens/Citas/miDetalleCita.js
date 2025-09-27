// screens/Citas/miDetalleCita.js
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function MiDetalleCita() {
  const route = useRoute()
  const cita = route?.params?.cita || {}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={24} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha y Hora</Text>
            <Text style={styles.detailValue}>{new Date(cita.fecha_hora).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={24} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Médico</Text>
            <Text style={styles.detailValue}>{`${cita.medico?.nombre} ${cita.medico?.apellido}`}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="medkit-outline" size={24} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Estado</Text>
            <Text style={styles.detailValue}>{cita.estado}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Motivo de la Consulta</Text>
          <Text style={styles.sectionValue}>{cita.motivo_consulta}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Observaciones</Text>
          <Text style={styles.sectionValue}>{cita.observaciones || "Sin observaciones"}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 2 },
  detailItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  detailContent: { marginLeft: 12, flex: 1 },
  detailLabel: { fontSize: 14, color: "#666", marginBottom: 2 },
  detailValue: { fontSize: 16, fontWeight: "600", color: "#2C3E50" },
  detailSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: "bold", color: "#007AFF", marginBottom: 8 },
  sectionValue: { fontSize: 14, color: "#2C3E50", lineHeight: 20 },
})