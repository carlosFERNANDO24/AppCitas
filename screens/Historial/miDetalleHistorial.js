// screens/Historial/miDetalleHistorial.js
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function MiDetalleHistorial() {
  const route = useRoute()
  const historial = route?.params?.historial || {}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={24} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Fecha de Consulta</Text>
            <Text style={styles.detailValue}>{new Date(historial.fecha_consulta).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={24} color="#007AFF" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Médico</Text>
            <Text style={styles.detailValue}>{`${historial.medico?.nombre} ${historial.medico?.apellido}`}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Diagnóstico</Text>
          <Text style={styles.sectionValue}>{historial.diagnostico}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Tratamiento</Text>
          <Text style={styles.sectionValue}>{historial.tratamiento}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>Notas</Text>
          <Text style={styles.sectionValue}>{historial.notas || "Sin notas adicionales"}</Text>
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