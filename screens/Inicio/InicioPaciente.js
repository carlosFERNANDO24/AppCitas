// screens/Inicio/InicioPaciente.js
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getMyCitas } from "../../Src/Services/CitasPService"
import { getMyHistorial } from "../../Src/Services/HistorialPService"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function InicioPaciente() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("...")
  const [stats, setStats] = useState({
    proximasCitas: 0,
    citasCompletadas: 0,
    totalConsultas: 0,
  })
  const [proximaCita, setProximaCita] = useState(null)

  useEffect(() => {
    cargarDatosPaciente()
  }, [])

  const cargarDatosPaciente = async () => {
    try {
      setLoading(true)
      const [citasResult, historialResult] = await Promise.all([
        getMyCitas(),
        getMyHistorial(),
      ])

      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUserName(parsedData.nombre)
      }

      if (citasResult.success) {
        const proximas = citasResult.data.filter(c => c.estado === 'programada').length
        const completadas = citasResult.data.filter(c => c.estado === 'completada').length
        setStats(prev => ({
          ...prev,
          proximasCitas: proximas,
          citasCompletadas: completadas,
        }))

        // Encontrar la próxima cita más cercana
        const hoy = new Date()
        const proxima = citasResult.data
          .filter(c => new Date(c.fecha_hora) >= hoy)
          .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))[0]
        setProximaCita(proxima)
      }

      if (historialResult.success) {
        setStats(prev => ({
          ...prev,
          totalConsultas: historialResult.data.length,
        }))
      }
    } catch (error) {
      console.error("Error al cargar datos del paciente:", error)
    } finally {
      setLoading(false)
    }
  }

  // Menú de opciones disponibles para el paciente
  const menuItems = [
    {
      title: "Mis Citas",
      subtitle: "Ver mis citas programadas",
      icon: "calendar",
      color: "#007AFF",
      screen: "Citas",
      params: { screen: "MisCitas" }
    },
    {
      title: "Mi Historial",
      subtitle: "Consultar mi historial médico",
      icon: "document-text",
      color: "#34C759",
      screen: "Historial",
      params: { screen: "MiHistorial" }
    },
    // ✅ CORRECCIÓN: Se eliminó el ítem de "Médicos"
    // ✅ NUEVO: Se agregó el ítem para "Crear mi Perfil"
    {
      title: "Crear mi Perfil",
      subtitle: "Completa tus datos de paciente",
      icon: "person-add",
      color: "#FF9500",
      screen: "CrearMiPaciente",
    },
    {
      title: "Crear Cita",
      subtitle: "Agenda una nueva cita",
      icon: "add-circle",
      color: "#E53E3E",
      screen: "Citas",
      params: { screen: "CrearMiCita" }
    },
  ]

  const formatFechaHora = (isoString) => {
    if (!isoString) return "N/A"
    const date = new Date(isoString)
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString('es-ES', options)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {userName}!</Text>
        <Text style={styles.subtitle}>Panel de Paciente</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      ) : (
        <>
          {/* Tarjeta de Próxima Cita */}
          <Text style={styles.sectionTitle}>Próxima Cita</Text>
          {proximaCita ? (
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                <Text style={styles.appointmentDate}>
                  {formatFechaHora(proximaCita.fecha_hora)}
                </Text>
              </View>
              <Text style={styles.appointmentDetail}>
                <Text style={styles.label}>Médico:</Text> {proximaCita.medico_nombre}
              </Text>
              <Text style={styles.appointmentDetail}>
                <Text style={styles.label}>Motivo:</Text> {proximaCita.motivo_consulta}
              </Text>
              <TouchableOpacity
                style={styles.appointmentButton}
                onPress={() => navigation.navigate("Citas", { screen: "MiDetalleCita", params: { cita: proximaCita } })}
              >
                <Text style={styles.appointmentButtonText}>Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noDataCard}>
              <Ionicons name="calendar-outline" size={50} color="#ccc" />
              <Text style={styles.noDataText}>No tienes citas programadas.</Text>
            </View>
          )}

          {/* Sección de estadísticas */}
          <Text style={styles.sectionTitle}>Tus Estadísticas</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: "#FF9500" }]}>
              <Ionicons name="clipboard-outline" size={30} color="#fff" />
              <Text style={styles.statNumber}>{stats.proximasCitas}</Text>
              <Text style={styles.statText}>Citas Programadas</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#34C759" }]}>
              <Ionicons name="checkmark-circle-outline" size={30} color="#fff" />
              <Text style={styles.statNumber}>{stats.citasCompletadas}</Text>
              <Text style={styles.statText}>Citas Completadas</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#5856D6" }]}>
              <Ionicons name="pulse-outline" size={30} color="#fff" />
              <Text style={styles.statNumber}>{stats.totalConsultas}</Text>
              <Text style={styles.statText}>Consultas en Historial</Text>
            </View>
          </View>

          {/* Menú de navegación */}
          <Text style={styles.sectionTitle}>Menú Principal</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => navigation.navigate(item.screen, item.params)}
              >
                <Ionicons name={item.icon} size={40} color="#fff" />
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#7F8C8D",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 10,
  },
  appointmentDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#2C3E50",
  },
  appointmentButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  appointmentButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noDataCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    marginBottom: 20,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  statText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    width: "48%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 5,
  },
})