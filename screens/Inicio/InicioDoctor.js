// screens/Inicio/InicioDoctor.js
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getCitas } from "../../Src/Services/CitaService"
import { getHistorial } from "../../Src/Services/HistorialService"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function InicioDoctor() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Médico")
  const [stats, setStats] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    citasCompletadas: 0,
    totalConsultas: 0,
  })
  const [proximasCitas, setProximasCitas] = useState([])

  useEffect(() => {
    cargarDatosDoctor()
  }, [])

  const cargarDatosDoctor = async () => {
    try {
      setLoading(true)
      const [citasResult, historialResult] = await Promise.all([
        getCitas(),
        getHistorial(),
      ])

      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        setUserName(JSON.parse(userData).nombre || "Médico")
      }

      const hoy = new Date().toISOString().split("T")[0]
      let citasHoy = 0
      let citasPendientes = 0
      let citasCompletadas = 0
      let citasFuturas = []

      if (citasResult.success && citasResult.data) {
        citasHoy = citasResult.data.filter((cita) => cita.fecha_hora.startsWith(hoy)).length
        citasPendientes = citasResult.data.filter((cita) => cita.estado === "programada").length
        citasCompletadas = citasResult.data.filter((cita) => cita.estado === "completada" && cita.fecha_hora.startsWith(hoy)).length

        citasFuturas = citasResult.data
          .filter((cita) => new Date(cita.fecha_hora).toISOString().split("T")[0] > hoy)
          .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha.hora))
          .slice(0, 3) // Mostrar solo las 3 más próximas
      }

      setStats({
        citasHoy,
        citasPendientes,
        citasCompletadas,
        totalConsultas: historialResult.success ? historialResult.data.length : 0,
      })

      setProximasCitas(citasFuturas)
    } catch (error) {
      console.error("Error cargando estadísticas del médico:", error)
      setStats({ citasHoy: 0, citasPendientes: 0, citasCompletadas: 0, totalConsultas: 0 })
      setProximasCitas([])
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const getPacienteNombre = (cita) => {
    return cita.paciente?.nombre || "Paciente Desconocido"
  }

  // 💡 Acciones unificadas para el doctor
  const quickActions = [
    { title: "Nueva Cita", icon: "add-circle", screen: "CitasStack", params: { screen: "CrearCita" }, color: "#007AFF" },
    { title: "Gestión de Citas", icon: "calendar", screen: "CitasStack", color: "#FF9500" },
    { title: "Ver Pacientes", icon: "person", screen: "PacientesStack", color: "#FF9500" },
    { title: "Ver Historiales", icon: "document-text", screen: "HistorialStack", color: "#34C759" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Panel del Médico</Text>
        <Text style={styles.subtitle}>Dr. {userName}</Text>
        <View style={styles.doctorBadge}>
          <Ionicons name="medical" size={16} color="#fff" />
          <Text style={styles.doctorBadgeText}>Especialista</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Mi Agenda de Hoy</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={28} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.citasHoy}</Text>
            <Text style={styles.statLabel}>Citas de Hoy</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={28} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.citasPendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#34C759" />
            <Text style={styles.statNumber}>{stats.citasCompletadas}</Text>
            <Text style={styles.statLabel}>Completadas Hoy</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={28} color="#FF3B30" />
            <Text style={styles.statNumber}>{stats.totalConsultas}</Text>
            <Text style={styles.statLabel}>Total Consultas</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton}
            onPress={() => {
              if (action.params) {
                navigation.navigate(action.screen, action.params);
              } else {
                navigation.navigate(action.screen);
              }
            }}
          >
            <Ionicons name={action.icon} size={24} color={action.color} />
            <Text style={styles.quickActionButtonText}>{action.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </View>

      {proximasCitas.length > 0 && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.sectionTitle}>Próximas Citas</Text>
          {proximasCitas.map((cita) => (
            <TouchableOpacity
              key={cita.id}
              style={styles.nextAppointment}
              onPress={() => navigation.navigate("CitasStack", { screen: "DetalleCita", params: { cita } })}
            >
              <Ionicons name="time" size={20} color="#007AFF" />
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentTime}>{formatFecha(cita.fecha_hora)}</Text>
                <Text style={styles.appointmentPatient}>{getPacienteNombre(cita)}</Text>
                <Text style={styles.appointmentReason}>{cita.motivo_consulta}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 15,
  },
  doctorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    marginBottom: 10,
  },
  doctorBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "48%",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  menuGrid: { // ❌ Este estilo ya no se usa y puede ser eliminado
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  menuItem: { // ❌ Este estilo ya no se usa y puede ser eliminado
    width: "45%",
    height: 180,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 20,
  },
  menuText: { // ❌ Este estilo ya no se usa y puede ser eliminado
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  menuSubtitle: { // ❌ Este estilo ya no se usa y puede ser eliminado
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 8,
    textAlign: "center",
  },
  scheduleContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  nextAppointment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentInfo: {
    marginLeft: 15,
    flex: 1,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  appointmentPatient: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 2,
  },
  appointmentReason: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  quickActionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  quickActionButtonText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  chevron: {
    marginLeft: "auto",
  },
})