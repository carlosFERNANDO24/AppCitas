// screens/Inicio/InicioDoctor.js - Panel del Médico
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getCitas } from "../../Src/Services/CitaService"
import { getHistorial } from "../../Src/Services/HistorialService"

export default function InicioDoctor() {
  const navigation = useNavigation()
  const [stats, setStats] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    citasCompletadas: 0,
    totalConsultas: 0
  })

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      // Solo puede acceder a citas e historial médico
      const [citasResult, historialResult] = await Promise.all([
        getCitas(),
        getHistorial()
      ])

      const hoy = new Date().toISOString().split('T')[0]
      let citasHoy = 0
      let citasPendientes = 0
      let citasCompletadas = 0

      if (citasResult.success && citasResult.data) {
        // Filtrar solo las citas del doctor actual (se implementaría en el backend)
        citasHoy = citasResult.data.filter(cita => 
          cita.fecha_hora.startsWith(hoy)
        ).length
        
        citasPendientes = citasResult.data.filter(cita => 
          cita.estado === 'programada' || cita.estado === 'confirmada'
        ).length

        citasCompletadas = citasResult.data.filter(cita => 
          cita.estado === 'completada' && cita.fecha_hora.startsWith(hoy)
        ).length
      }

      setStats({
        citasHoy,
        citasPendientes,
        citasCompletadas,
        totalConsultas: historialResult.success ? historialResult.data.length : 0
      })
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
      setStats({
        citasHoy: 3,
        citasPendientes: 2,
        citasCompletadas: 1,
        totalConsultas: 15
      })
    }
  }

  const menuItems = [
    {
      title: "Mis Citas",
      subtitle: "Gestionar mis citas programadas",
      icon: "calendar",
      color: "#007AFF",
      screen: "CitasStack",
      available: true
    },
    {
      title: "Historial Médico",
      subtitle: "Crear y consultar historiales",
      icon: "document-text",
      color: "#34C759",
      screen: "HistorialStack",
      available: true
    }
    // Nota: Doctor NO puede gestionar pacientes ni otros médicos según las rutas
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Panel del Médico</Text>
        <Text style={styles.subtitle}>Dr. Ana Gómez</Text>
        <View style={styles.doctorBadge}>
          <Ionicons name="medical" size={16} color="#fff" />
          <Text style={styles.doctorBadgeText}>Especialista</Text>
        </View>
      </View>
      
      <View style={styles.menuGrid}>
        {menuItems.filter(item => item.available).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={45} color="#fff" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Mi Agenda de Hoy</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={28} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.citasHoy}</Text>
            <Text style={styles.statLabel}>Citas Programadas</Text>
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
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CitasStack", { screen: "CrearCita" })}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.quickActionText}>Programar Nueva Cita</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("HistorialStack", { screen: "CrearHistorial" })}
        >
          <Ionicons name="document-text" size={24} color="#34C759" />
          <Text style={styles.quickActionText}>Nuevo Registro Médico</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("CitasStack")}
        >
          <Ionicons name="list" size={24} color="#666" />
          <Text style={styles.quickActionText}>Ver Todas Mis Citas</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>Próximas Citas</Text>
        <View style={styles.nextAppointment}>
          <Ionicons name="time" size={20} color="#007AFF" />
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTime}>10:00 AM</Text>
            <Text style={styles.appointmentPatient}>Juan Pérez</Text>
            <Text style={styles.appointmentReason}>Consulta general</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Ver</Text>
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
  },
  doctorBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  menuItem: {
    width: "45%",
    height: 160,
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
  menuText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  menuSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 8,
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
  quickActionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
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
  scheduleContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  nextAppointment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
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
})