// screens/Citas/detalleCita.js
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { deleteCita } from "../../Src/Services/CitaService";
import { useTheme } from "../../context/ThemeContext"; // 1. Importar useTheme

export default function DetalleCita() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme(); // 2. Obtener colors

  const cita = route?.params?.cita || {
    id: "1",
    paciente: { nombre: "Juan", apellido: "Pérez" },
    medico: { nombre: "Dra. Ana", apellido: "Gómez" },
    fecha_hora: "2024-01-20T10:00:00",
    estado: "programada",
    motivo_consulta: "Consulta general de rutina",
    observaciones: "Paciente viene por primera vez",
  };

  const handleEliminar = () => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await deleteCita(cita.id);
          if (result.success) {
            Alert.alert("Éxito", "Cita eliminada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }]);
          } else {
             Alert.alert("Error", result.message || result.error || "No se pudo eliminar la cita.");
          }
        },
      },
    ]);
  };

  // Se mantienen los colores específicos para el estado, ya que son significativos
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "programada": return "#FFA500"; // Naranja
      case "confirmada": return "#007AFF"; // Azul (usar colors.primary podría ser una opción también)
      case "completada": return "#34C759"; // Verde
      case "cancelada": return "#FF3B30"; // Rojo
      default: return colors.subtext; // Usar subtext del tema para estados desconocidos
    }
  };

   const formatFecha = (fechaString) => {
     if (!fechaString) return "Fecha inválida";
     try {
        const fecha = new Date(fechaString);
        if (isNaN(fecha.getTime())) return "Fecha inválida";
        return fecha.toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
     } catch (e) {
         console.error("Error formateando fecha en DetalleCita:", fechaString, e);
         return "Fecha inválida";
     }
  };


   const getPacienteNombre = () => {
     if (cita.paciente) {
       return `${cita.paciente.nombre || ""} ${cita.paciente.apellido || ""}`.trim() || "Paciente sin nombre";
     }
     return cita.paciente_nombre || "No especificado";
  };

   const getMedicoNombre = () => {
      if (cita.medico) {
         // Intenta añadir Dr./Dra. si es posible
         const titulo = cita.medico.genero === 'F' ? "Dra." : "Dr.";
         return `${titulo} ${cita.medico.nombre || ""} ${cita.medico.apellido || ""}`.trim() || "Médico sin nombre";
     }
     return cita.medico_nombre || "No especificado";
  };


  return (
    // 3. Aplicar color de fondo principal
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Detalle de la Cita</Text> {/* Color texto título */}
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          {/* El texto del badge se mantiene blanco para contraste */}
          <Text style={styles.estadoText}>{cita.estado ? cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1) : 'Desconocido'}</Text>
        </View>
      </View>

      {/* 3. Aplicar color de fondo a la tarjeta */}
      <View style={[styles.detailCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={20} color={colors.primary} /> {/* Color icono primario */}
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.subtext }]}>Paciente</Text> {/* Color subtexto */}
            <Text style={[styles.detailValue, { color: colors.text }]}>{getPacienteNombre()}</Text> {/* Color texto */}
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="medical-outline" size={20} color={colors.primary} /> {/* Color icono primario */}
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.subtext }]}>Médico</Text> {/* Color subtexto */}
            <Text style={[styles.detailValue, { color: colors.text }]}>{getMedicoNombre()}</Text> {/* Color texto */}
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} /> {/* Color icono primario */}
          <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.subtext }]}>Fecha y Hora</Text> {/* Color subtexto */}
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatFecha(cita.fecha_hora)}</Text> {/* Color texto */}
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Motivo de Consulta</Text> {/* Color primario */}
          <Text style={[styles.sectionValue, { color: colors.text }]}>{cita.motivo_consulta || 'No especificado'}</Text> {/* Color texto */}
        </View>

        {cita.observaciones && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Observaciones</Text> {/* Color primario */}
            <Text style={[styles.sectionValue, { color: colors.text }]}>{cita.observaciones}</Text> {/* Color texto */}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón Editar - Usar color primario del tema */}
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("EditarCita", { cita })}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar Cita</Text>
        </TouchableOpacity>

        {/* Botón Eliminar - Mantiene color rojo */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleEliminar}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar Cita</Text>
        </TouchableOpacity>

        {/* Botón Volver - Adaptar borde y texto al color primario */}
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Volver a la lista</Text>
        </TouchableOpacity>
      </View>
        <View style={{ height: 30 }} /> {/* Espacio al final */}
    </ScrollView>
  );
}

// 4. Ajustar StyleSheet quitando colores fijos y ajustando estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5", // Quitado
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#2C3E50", // Quitado
    flex: 1, // Permite que el título ocupe espacio disponible
     marginRight: 10, // Espacio antes del badge
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoText: {
    color: "#fff", // Mantenido blanco para contraste
    fontWeight: "bold",
    fontSize: 12,
     textTransform: 'capitalize',
  },
  detailCard: {
    // backgroundColor: "#fff", // Quitado
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2, // Sombra Android
    // Sombra iOS
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    // color: "#666", // Quitado
    marginBottom: 4, // Más espacio
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    // color: "#2C3E50", // Quitado
  },
  detailSection: {
    marginBottom: 20,
     paddingTop: 10, // Espacio extra antes de secciones
     borderTopWidth: 1, // Separador sutil
     borderColor: 'rgba(128, 128, 128, 0.1)', // Color del borde muy suave
  },
  // Estilo específico para la primera sección para quitar borde superior
  detailSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#007AFF", // Quitado
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 15, // Ligeramente más grande
    // color: "#2C3E50", // Quitado
    lineHeight: 22, // Mejor espaciado de línea
  },
  buttonContainer: {
    gap: 15, // Más espacio entre botones
     marginTop: 10, // Espacio sobre los botones
  },
  editButton: {
    // backgroundColor: "#007AFF", // Quitado
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
     elevation: 2,
  },
  deleteButton: {
    backgroundColor: "#FF3B30", // Mantenido rojo para acción destructiva
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  backButton: {
    backgroundColor: "transparent", // Mantenido transparente
    borderWidth: 1.5, // Borde ligeramente más grueso
    // borderColor: "#007AFF", // Quitado
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: "#fff", // Mantenido blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#fff", // Mantenido blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonText: {
    // color: "#007AFF", // Quitado
    fontSize: 16,
    fontWeight: "bold",
  },
});