"use client"

// screens/Inicio/InicioPaciente.js - Panel del Paciente (Corregido)
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { getMisCitas } from "../../Src/Services/CitaService" // ✅ API específica para pacientes
import { getMiHistorial } from "../../Src/Services/HistorialService" // ✅ Ahora existe

export default function InicioPaciente() {
  const navigation = useNavigation()
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
      // ✅ Usar las APIs específicas para pacientes
      const [citasResult, historialResult] = await Promise.all([
        getMisCitas(), // ✅ API específica para pacientes
        getMiHistorial(), // ✅ API específica para pacientes
      ])

      const hoy = new Date()
      let proximasCitas = 0
      let citasCompletadas = 0
      let proximaCitaData = null

      if (citasResult.success && citasResult.data) {
        // Filtrar citas futuras
        const citasFuturas = citasResult.data
          .filter((cita) => new Date(cita.fecha_hora) > hoy)
          .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))

        proximasCitas = citasFuturas.length
        proximaCitaData = citasFuturas[0] || null

        citasCompletadas = citasResult.data.filter((cita) => cita.estado === "completada").length
      }

      setStats({
        proximasCitas,
        citasCompletadas,
        totalConsultas: historialResult.success && historialResult.data ? historialResult.data.length : 0,
      })

      setProximaCita(proximaCitaData)
    } catch (error) {
      console.error("Error cargando datos del paciente:", error)
      // Datos de ejemplo si hay error
      setStats({
        proximasCitas: 2,
        citasCompletadas: 5,
        totalConsultas: 8,
      })
      setProximaCita({
        fecha_hora: "2024-01-20T10:00:00",
        medico_nombre: "Dr. Ana Gómez",
        motivo_consulta: "Consulta de seguimiento",
      })
    }
  }

  // ✅ Solo funciones disponibles para pacientes según API
  const menuItems = [
    {
      title: "Mis Citas",
      subtitle: "Ver mis citas programadas",
      icon: "calendar",
      color: "#007AFF",
      screen: "CitasStack",
      available: true, // ✅ Paciente puede ver SUS citas
      permissions: "Ver mis citas, Crear nuevas",
    },
    {
      title: "Mi Historial",
      subtitle: "Consultar mi historial médico",
      icon: "document-text",
      color: "#34C759",
      screen: "HistorialStack",
      available: true, // ✅ Paciente puede ver SU historial
      permissions: "Solo lectura",
    },
    // ❌ REMOVIDO: Gestión de Médicos (no disponible para pacientes)
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Mi Portal de Salud</Text>
        <Text style={styles.subtitle}>Juan Pérez</Text>
        <View style={styles.patientBadge}>
          <Ionicons name="person" size={16} color="#fff" />
          <Text style={styles.patientBadgeText}>Paciente</Text>
        </View>

        {/* ✅ AGREGADO: Indicador de permisos limitados */}
        <View style={styles.permissionsIndicator}>
          <Text style={styles.permissionsText}>👁️ Solo puedo ver MIS citas e historial</Text>
        </View>
      </View>

      {/* Próxima Cita */}
      {proximaCita && (
        <View style={styles.nextAppointmentContainer}>
          <Text style={styles.sectionTitle}>Próxima Cita</Text>
          <View style={styles.appointmentCard}>
            <Ionicons name="calendar" size={30} color="#007AFF" />
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentDate}>{formatFecha(proximaCita.fecha_hora)}</Text>
              <Text style={styles.appointmentDoctor}>{proximaCita.medico_nombre || "Médico no asignado"}</Text>
              <Text style={styles.appointmentReason}>{proximaCita.motivo_consulta || "Sin motivo especificado"}</Text>
            </View>
            <TouchableOpacity style={styles.appointmentButton} onPress={() => navigation.navigate("CitasStack")}>
              <Text style={styles.appointmentButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Menú Principal - Solo funciones disponibles para pacientes */}
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
              {/* ✅ AGREGADO: Badge de permisos */}
              <View style={styles.permissionsBadge}>
                <Text style={styles.permissionsBadgeText}>{item.permissions}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* ✅ AGREGADO: Sección de limitaciones */}
      <View style={styles.limitationsContainer}>
        <Text style={styles.sectionTitle}>⚠️ Funciones No Disponibles</Text>
        <View style={styles.limitationItem}>
          <Ionicons name="people" size={20} color="#999" />
          <Text style={styles.limitationText}>Ver otros pacientes - Solo Admin</Text>
        </View>
        <View style={styles.limitationItem}>
          <Ionicons name="medical" size={20} color="#999" />
          <Text style={styles.limitationText}>Gestión de médicos - Solo Admin</Text>
        </View>
        <View style={styles.limitationItem}>
          <Ionicons name="calendar" size={20} color="#999" />
          <Text style={styles.limitationText}>Ver todas las citas - Admin/Doctor</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const formatFecha = (fechaString) => {
  const fecha = new Date(fechaString)
  return fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const styles = StyleSheet.create({
  permissionsIndicator: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  permissionsText: {
    color: "#2E7D2E",
    fontSize: 12,
    fontWeight: "600",
  },
  permissionsBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  permissionsBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  limitationsContainer: {
    backgroundColor: "#FFF8DC",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  limitationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  limitationText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
})
