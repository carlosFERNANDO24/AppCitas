// screens/Inicio/InicioPaciente.js - Panel del Paciente
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getMisCitas } from "../../Src/Services/CitaService"
import { getMiHistorial } from "../../Src/Services/HistorialService"

export default function InicioPaciente() {
  const navigation = useNavigation()
  const [stats, setStats] = useState({
    proximasCitas: 0,
    citasCompletadas: 0,
    totalConsultas: 0
  })
  
  const [proximaCita, setProximaCita] = useState(null)

  useEffect(() => {
    cargarDatosPaciente()
  }, [])

  const cargarDatosPaciente = async () => {
    try {
      // Usar las APIs específicas para pacientes
      const [citasResult, historialResult] = await Promise.all([
        getMisCitas(), // API específica para pacientes
        getMiHistorial() // API específica para pacientes
      ])

      const hoy = new Date()
      let proximasCitas = 0
      let citasCompletadas = 0
      let proximaCitaData = null

      if (citasResult.success && citasResult.data) {
        // Filtrar citas futuras
        const citasFuturas = citasResult.data.filter(cita => 
          new Date(cita.fecha_hora) > hoy
        ).sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))

        proximasCitas = citasFuturas.length
        proximaCitaData = citasFuturas[0] || null

        citasCompletadas = citasResult.data.filter(cita => 
          cita.estado === 'completada'
        ).length
      }

      setStats({
        proximasCitas,
        citasCompletadas,
        totalConsultas: historialResult.success ? historialResult.data.length : 0
      })

      setProximaCita(proximaCitaData)
    } catch (error) {
      console.error("Error cargando datos del paciente:", error)
      // Datos de ejemplo si hay error
      setStats({
        proximasCitas: 2,
        citasCompletadas: 5,
        totalConsultas: 8
      })
      setProximaCita({
        fecha_hora: "2024-01-20T10:00:00",
        medico_nombre: "Dr. Ana Gómez",
        motivo_consulta: "Consulta de seguimiento"
      })
    }
  }

  const menuItems = [
    {
      title: "Mis Citas",
      subtitle: "Ver mis citas programadas",
      icon: "calendar",
      color: "#007AFF",
      screen: "CitasStack",
      available: true // Solo puede ver sus citas
    },
    {
      title: "Mi Historial",
      subtitle: "Consultar mi historial médico",
      icon: "document-text",
      color: "#34C759",
      screen: "HistorialStack",
      available: true // Solo puede ver su historial
    },
    {
      title: "Médicos",
      subtitle: "Ver información de médicos",
      icon: "medical",
      color: "#FF9500",
      screen: "MedicosStack",
      available: false // Los pacientes no tienen esta funcionalidad según las rutas
    }
  ]

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Mi Portal de Salud</Text>
        <Text style={styles.subtitle}>Juan Pérez</Text>
        <View style={styles.patientBadge}>
          <Ionicons name="person" size={16} color="#fff" />
          <Text style={styles.patientBadgeText}>Paciente</Text>
        </View>
      </View>

      {/* Próxima Cita */}
      {proximaCita && (
        <View style={styles.nextAppointmentContainer}>
          <Text style={styles.sectionTitle}>Próxima Cita</Text>
          <View style={styles.appointmentCard}>
            <Ionicons name="calendar" size={30} color="#007AFF" />
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentDate}>
                {formatFecha(proximaCita.fecha_hora)}
              </Text>
              <Text style={styles.appointmentDoctor}>{proximaCita.medico_nombre}</Text>
              <Text style={styles.appointmentReason}>{proximaCita.motivo_consulta}</Text>
            </View>
            <TouchableOpacity 
              style={styles.appointmentButton}
              onPress={() => navigation.navigate("CitasStack")}
            >
              <Text style={styles.appointmentButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Menú Principal - Solo funciones disponibles para pacientes */}
      <View style={styles.menuGrid}>
        {menuItems.filter(item => item.available).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={40} color="#fff" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estadísticas del Paciente */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Mi Resumen Médico</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.proximasCitas}</Text>
            <Text style={styles.statLabel}>Próximas Citas</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{stats.citasCompletadas}</Text>
            <Text style={styles.statLabel}>Citas Completadas</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.totalConsultas}</Text>
            <Text style={styles.statLabel}>Total Consultas</Text>
          </View>
        </View>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Disponibles</Text>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CitasStack", { screen: "CrearCita" })}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.quickActionText}>Solicitar Nueva Cita</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CitasStack")}
        >
          <Ionicons name="list" size={24} color="#34C759" />
          <Text style={styles.quickActionText}>Ver Mis Citas</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("HistorialStack")}
        >
          <Ionicons name="document-text" size={24} color="#FF9500" />
          <Text style={styles.quickActionText}>Consultar Mi Historial</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Recordatorios */}
      <View style={styles.remindersContainer}>
        <Text style={styles.sectionTitle}>Recordatorios de Salud</Text>
        
        <View style={styles.reminderItem}>
          <Ionicons name="alert-circle" size={20} color="#FF9500" />
          <Text style={styles.reminderText}>Tomar medicamento a las 8:00 PM</Text>
          <TouchableOpacity style={styles.reminderButton}>
            <Ionicons name="checkmark" size={16} color="#34C759" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.reminderItem}>
          <Ionicons name="medical" size={20} color="#007AFF" />
          <Text style={styles.reminderText}>Examen de sangre pendiente</Text>
          <TouchableOpacity style={styles.reminderButton}>
            <Ionicons name="time" size={16} color="#FF9500" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.reminderItem}>
          <Ionicons name="fitness" size={20} color="#34C759" />
          <Text style={styles.reminderText}>Realizar ejercicio 30 min/día</Text>
          <TouchableOpacity style={styles.reminderButton}>
            <Ionicons name="checkmark" size={16} color="#34C759" />
          </TouchableOpacity>
        </View>
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
  welcomeSection: {
    alignItems: "center",
    marginBottom: 25,
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
  patientBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34C759",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  patientBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  nextAppointmentContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  appointmentInfo: {
    marginLeft: 15,
    flex: 1,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  appointmentDoctor: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 2,
  },
  appointmentReason: {
    fontSize: 13,
    color: "#666",
  },
  appointmentButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  appointmentButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  menuItem: {
    width: "45%",
    height: 140,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  menuSubtitle: {
    color: "#fff",
    fontSize: 11,
    opacity: 0.9,
    marginTop: 6,
    textAlign: "center",
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
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  quickActionText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#2C3E50",
    flex: 1,
  },
  remindersContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 10,
  },
  reminderText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#2C3E50",
    flex: 1,
  },
  reminderButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 1,
  },
})