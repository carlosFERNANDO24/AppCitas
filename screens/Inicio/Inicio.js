"use client"

// screens/Inicio/Inicio.js - Panel de Administrador Mejorado
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getCitas } from "../../Src/Services/CitaService"
import { getPacientes } from "../../Src/Services/PacienteService"
import { getMedicos } from "../../Src/Services/MedicoService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../../context/ThemeContext" // ✅ 1. Importar hook

export default function Inicio() {
  const navigation = useNavigation()
  const { darkMode } = useTheme(); // ✅ 2. Obtener estado del tema
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Administrador")
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
      setLoading(true)
      
      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        setUserName(JSON.parse(userData).nombre || "Administrador")
      }

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
      setStats({ citasHoy: 0, totalPacientes: 0, totalMedicos: 0, citasPendientes: 0 })
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    { title: "Gestión de Citas", subtitle: "Ver, crear y modificar citas", icon: "calendar", color: "#007AFF", screen: "CitasStack" },
    { title: "Gestión de Pacientes", subtitle: "CRUD completo de pacientes", icon: "people", color: "#34C759", screen: "PacientesStack" },
    { title: "Gestión de Médicos", subtitle: "CRUD completo de médicos", icon: "medical", color: "#FF9500", screen: "MedicosStack" },
    { title: "Historial Médico", subtitle: "Ver todo el historial médico", icon: "document-text", color: "#FF3B30", screen: "HistorialStack" },
  ]

  // ✅ 3. Definir estilos dinámicos
  const theme = {
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    cardColor: darkMode ? '#1e1e1e' : '#fff',
    textColor: darkMode ? '#fff' : '#2C3E50',
    subtitleColor: darkMode ? '#aaa' : '#666',
    badgeTextColor: '#fff',
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, { color: theme.subtitleColor }]}>Cargando datos...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcome, { color: theme.textColor }]}>¡Hola, {userName}!</Text>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Panel de Administración</Text>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color={theme.badgeTextColor} />
          <Text style={[styles.adminBadgeText, { color: theme.badgeTextColor }]}>Acceso Total</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={40} color={theme.badgeTextColor} />
            <Text style={[styles.menuText, { color: theme.badgeTextColor }]}>{item.title}</Text>
            <Text style={[styles.menuSubtitle, { color: theme.badgeTextColor, opacity: 0.9 }]}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.cardColor }]}>
        <Text style={[styles.statsTitle, { color: theme.textColor }]}>Resumen del Sistema</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            <Text style={[styles.statNumber, { color: theme.textColor }]}>{stats.citasHoy}</Text>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Citas Hoy</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#FF9500" />
            <Text style={[styles.statNumber, { color: theme.textColor }]}>{stats.citasPendientes}</Text>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color="#34C759" />
            <Text style={[styles.statNumber, { color: theme.textColor }]}>{stats.totalPacientes}</Text>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Pacientes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="medical-outline" size={24} color="#FF3B30" />
            <Text style={[styles.statNumber, { color: theme.textColor }]}>{stats.totalMedicos}</Text>
            <Text style={[styles.statLabel, { color: theme.subtitleColor }]}>Médicos</Text>
          </View>
        </View>
      </View>

      <View style={[styles.quickActionsContainer, { backgroundColor: theme.cardColor }]}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Acciones Rápidas</Text>
        <TouchableOpacity
          style={[styles.quickActionButton, { borderBottomColor: darkMode ? '#333' : '#eee' }]}
          onPress={() => navigation.navigate("CitasStack", { screen: "CrearCita" })}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={[styles.quickActionText, { color: theme.textColor }]}>Nueva Cita</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.subtitleColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, { borderBottomColor: darkMode ? '#333' : '#eee' }]}
          onPress={() => navigation.navigate("PacientesStack", { screen: "CrearPaciente" })}
        >
          <Ionicons name="person-add" size={24} color="#34C759" />
          <Text style={[styles.quickActionText, { color: theme.textColor }]}>Registrar Paciente</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.subtitleColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, { borderBottomColor: darkMode ? '#333' : '#eee' }]}
          onPress={() => navigation.navigate("MedicosStack", { screen: "CrearMedico" })}
        >
          <Ionicons name="medical" size={24} color="#FF9500" />
          <Text style={[styles.quickActionText, { color: theme.textColor }]}>Registrar Médico</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.subtitleColor} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  welcomeSection: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  welcome: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 15, textAlign: "center" },
  adminBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#28a745", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
  adminBadgeText: { fontSize: 12, fontWeight: "bold" },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 30 },
  menuItem: { width: "48%", height: 140, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 15, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, padding: 15 },
  menuText: { fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  menuSubtitle: { fontSize: 11, marginTop: 4, textAlign: "center" },
  statsContainer: { borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  statsTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  statItem: { alignItems: "center", width: "45%", marginBottom: 15 },
  statNumber: { fontSize: 28, fontWeight: "bold", marginTop: 5 },
  statLabel: { fontSize: 12, marginTop: 5, textAlign: "center" },
  quickActionsContainer: { borderRadius: 15, padding: 20, elevation: 3, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  quickActionButton: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1 },
  quickActionText: { marginLeft: 15, fontSize: 16, flex: 1 },
})