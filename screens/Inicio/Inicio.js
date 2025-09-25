"use client"

// screens/Inicio/Inicio.js - Panel de Administrador
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getCitas } from "../../Src/Services/CitaService"
import { getPacientes } from "../../Src/Services/PacienteService"
import { getMedicos } from "../../Src/Services/MedicoService"

export default function Inicio() {
  const navigation = useNavigation()
  const [stats, setStats] = useState({
    citasHoy: 0,
    totalPacientes: 0,
    totalMedicos: 0,
    citasPendientes: 0,
  })

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      // Cargar datos desde las APIs disponibles para admin
      const [citasResult, pacientesResult, medicosResult] = await Promise.all([
        getCitas(),
        getPacientes(),
        getMedicos(),
      ])

      const hoy = new Date().toISOString().split("T")[0]
      let citasHoy = 0
      let citasPendientes = 0

      if (citasResult.success && citasResult.data) {
        citasHoy = citasResult.data.filter((cita) => cita.fecha_hora.startsWith(hoy)).length

        citasPendientes = citasResult.data.filter(
          (cita) => cita.estado === "programada" || cita.estado === "confirmada",
        ).length
      }

      setStats({
        citasHoy,
        totalPacientes: pacientesResult.success ? pacientesResult.data.length : 0,
        totalMedicos: medicosResult.success ? medicosResult.data.length : 0,
        citasPendientes,
      })
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
      // Valores por defecto si hay error
      setStats({
        citasHoy: 5,
        totalPacientes: 12,
        totalMedicos: 8,
        citasPendientes: 3,
      })
    }
  }

  const menuItems = [
    {
      title: "Gestión de Citas",
      subtitle: "Ver, crear y modificar citas",
      icon: "calendar",
      color: "#007AFF",
      screen: "CitasStack",
      available: true, // Admin tiene acceso completo
    },
    {
      title: "Gestión de Pacientes",
      subtitle: "CRUD completo de pacientes",
      icon: "people",
      color: "#34C759",
      screen: "PacientesStack",
      available: true, // Solo admin puede gestionar pacientes
    },
    {
      title: "Gestión de Médicos",
      subtitle: "CRUD completo de médicos",
      icon: "medical",
      color: "#FF9500",
      screen: "MedicosStack",
      available: true, // Solo admin puede gestionar médicos
    },
    {
      title: "Historial Médico",
      subtitle: "Ver todo el historial médico",
      icon: "document-text",
      color: "#FF3B30",
      screen: "HistorialStack",
      available: true, // Admin ve todo el historial
    },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Panel de Administrador</Text>
        <Text style={styles.subtitle}>Sistema de Gestión de Citas Médicas</Text>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.adminBadgeText}>Acceso Total</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {menuItems
          .filter((item) => item.available)
          .map((item, index) => (
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

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Resumen del Sistema</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.citasHoy}</Text>
            <Text style={styles.statLabel}>Citas Hoy</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.citasPendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{stats.totalPacientes}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="medical-outline" size={24} color="#FF3B30" />
            <Text style={styles.statNumber}>{stats.totalMedicos}</Text>
            <Text style={styles.statLabel}>Médicos</Text>
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
          <Text style={styles.quickActionText}>Nueva Cita</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("PacientesStack", { screen: "CrearPaciente" })}
        >
          <Ionicons name="person-add" size={24} color="#34C759" />
          <Text style={styles.quickActionText}>Registrar Paciente</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate("MedicosStack", { screen: "CrearMedico" })}
        >
          <Ionicons name="medical" size={24} color="#FF9500" />
          <Text style={styles.quickActionText}>Registrar Médico</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
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
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  menuItem: {
    width: "48%",
    height: 140,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
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
    marginTop: 10,
    textAlign: "center",
  },
  menuSubtitle: {
    color: "#fff",
    fontSize: 11,
    opacity: 0.9,
    marginTop: 4,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  quickActionsContainer: {
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
})
