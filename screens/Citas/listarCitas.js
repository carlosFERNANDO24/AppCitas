// screens/Citas/listarCitas.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { getCitas, getMisCitas, deleteCita } from "../../Src/Services/CitaService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext"; // 1. Importar useTheme

// ... (citasEjemplo se mantiene igual)

export default function ListarCitas() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // 2. Obtener colors del contexto
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    // ... (lógica interna sin cambios)
     const role = await cargarRolUsuario()
     setLoading(true)
     await cargarCitas(role)
     setLoading(false)
  };

  const cargarRolUsuario = async () => {
   // ... (lógica interna sin cambios)
    try {
      const savedRole = await AsyncStorage.getItem("userRole")
      console.log("[v2] Rol obtenido de AsyncStorage:", savedRole)
      setUserRole(savedRole)
      return savedRole
    } catch (error) {
      console.error("Error cargando rol:", error)
      setUserRole("paciente")
      return "paciente"
    }
  };

  const cargarCitas = async (role) => {
   // ... (lógica interna sin cambios)
    try {
      console.log("[v2] Cargando citas para el rol:", role)
      let result

      if (role === "paciente") {
        console.log("[v2] Usando getMisCitas para paciente")
        result = await getMisCitas()
      } else if (role === "admin" || role === "doctor") {
        console.log("[v2] Usando getCitas para admin/doctor")
        result = await getCitas()
      } else {
        console.log("[v2] Rol desconocido o nulo, usando getCitas")
        result = await getCitas()
      }

      if (result.success) {
        setCitas(result.data)
      } else {
        console.log("[v2] La llamada a la API falló, usando datos de ejemplo.")
        //setCitas(citasEjemplo) // Considera si quieres mostrar ejemplo o un mensaje
        setCitas([]); // O dejar vacío para mostrar el mensaje de "No hay citas"
         Alert.alert("Error", result.error || "No se pudieron cargar las citas.");
      }
    } catch (error) {
      console.error("[v2] Error al cargar citas:", error)
       Alert.alert("Error", "Ocurrió un error inesperado al cargar las citas.");
      //setCitas(citasEjemplo)
       setCitas([]);
    }
  };

  const handleEliminar = (id) => {
    // ... (lógica interna sin cambios)
     Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const result = await deleteCita(id)
          if (result.success) {
            cargarDatos()
          } else {
            Alert.alert("Error", result.message || result.error) // Usa message o error
          }
        },
      },
    ])
  };

  // --- Funciones de formato y obtención de datos (sin cambios) ---
  const getEstadoColor = (estado) => {
    // ... (sin cambios)
     switch (estado) {
      case "programada": return "#FFA500"; // Naranja
      case "confirmada": return "#007AFF"; // Azul
      case "completada": return "#34C759"; // Verde
      case "cancelada": return "#FF3B30"; // Rojo
      default: return colors.subtext; // Color por defecto del tema
    }
  };
   const formatFecha = (fechaString) => {
    // ... (sin cambios)
     if (!fechaString) return "Fecha inválida";
     try {
         const fecha = new Date(fechaString);
         // Verifica si la fecha es válida
         if (isNaN(fecha.getTime())) {
             return "Fecha inválida";
         }
         return fecha.toLocaleDateString("es-ES", {
             day: "numeric",
             month: "short",
             year: 'numeric', // Añadir año puede ser útil
             hour: "2-digit",
             minute: "2-digit",
         });
     } catch (e) {
         console.error("Error formateando fecha:", fechaString, e);
         return "Fecha inválida";
     }
  };
   const getPacienteNombre = (cita) => {
     // ... (sin cambios)
      if (cita.paciente && (cita.paciente.nombre || cita.paciente.apellido)) {
      const nombre = cita.paciente.nombre || ""
      const apellido = cita.paciente.apellido || ""
      return `${nombre} ${apellido}`.trim() || "Paciente sin nombre"; // Asegura que no quede vacío
    }
    // Intenta con el nombre directo si no hay objeto paciente
    return cita.paciente_nombre || "Paciente no especificado";
  };
   const getMedicoNombre = (cita) => {
      // ... (sin cambios)
     if (cita.medico && (cita.medico.nombre || cita.medico.apellido)) {
      const nombre = cita.medico.nombre || ""
      const apellido = cita.medico.apellido || ""
      // Añade "Dr." o "Dra." si es posible, o un título genérico
      const titulo = cita.medico.genero === 'F' ? "Dra." : "Dr.";
      return `${titulo} ${nombre} ${apellido}`.trim() || "Médico sin nombre";
    }
     // Intenta con el nombre directo si no hay objeto medico
    return cita.medico_nombre || "Médico no especificado";
  };
  // -----------------------------------------------------------------

  const renderItem = ({ item }) => (
    <TouchableOpacity
      // 3. Aplicar colores del tema a los items
      style={[styles.citaItem, { backgroundColor: colors.card, shadowColor: colors.text }]}
      onPress={() => navigation.navigate("DetalleCita", { cita: item })}
    >
      <View style={styles.citaInfo}>
        <View style={styles.citaHeader}>
          <Text style={[styles.paciente, { color: colors.text }]}>
            {getPacienteNombre(item)}
          </Text>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1) : 'Sin estado'}</Text>
          </View>
        </View>

        <Text style={[styles.medico, { color: colors.primary }]}>{getMedicoNombre(item)}</Text>
        <Text style={[styles.fecha, { color: colors.subtext }]}>{formatFecha(item.fecha_hora)}</Text>
        <Text style={[styles.motivo, { color: colors.subtext }]} numberOfLines={1}>
          {item.motivo_consulta || 'Sin motivo'}
        </Text>
      </View>

       {/* Mostrar acciones solo si es admin o doctor */}
      {(userRole === "admin" || userRole === "doctor") && (
            <View style={styles.actions}>
                <TouchableOpacity
                onPress={() => navigation.navigate("EditarCita", { cita: item })}
                style={[styles.actionButton, { backgroundColor: colors.background }]} // Fondo sutil del tema
                >
                <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                onPress={() => handleEliminar(item.id)}
                style={[styles.actionButton, { backgroundColor: colors.background }]} // Fondo sutil del tema
                >
                <Ionicons name="trash" size={18} color="#FF3B30" />
                </TouchableOpacity>
            </View>
       )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      // 3. Aplicar colores al contenedor de carga
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    // 3. Aplicar color de fondo principal
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       {/* Botón crear solo para admin/doctor */}
      {(userRole === "admin" || userRole === "doctor") && (
        <TouchableOpacity
         style={[styles.createButton, { backgroundColor: colors.primary }]} // Usar color primario del tema
         onPress={() => navigation.navigate("CrearCita")}
         >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Nueva Cita</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()} // Fallback por si falta ID
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              {userRole === "paciente" ? "No tienes citas programadas" : "No hay citas programadas"}
            </Text>
             {/* Botón crear solo para admin/doctor en lista vacía */}
            {(userRole === "admin" || userRole === "doctor") && (
              <TouchableOpacity
               style={[styles.emptyButton, { backgroundColor: colors.primary }]} // Usar color primario
               onPress={() => navigation.navigate("CrearCita")}
               >
                <Text style={styles.emptyButtonText}>Crear primera cita</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshing={loading}
        onRefresh={cargarDatos} // Permite refrescar la lista deslizando hacia abajo
        contentContainerStyle={citas.length === 0 ? styles.emptyListContainer : null} // Centra el mensaje si está vacío
      />
    </View>
  );
}

// 4. Ajustar StyleSheet para usar menos colores fijos y más colores del tema inline
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  createButton: {
    // backgroundColor: "#007AFF", // Quitado, se aplica inline
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2, // Sombra Android
     // Sombra iOS
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.2,
     shadowRadius: 2,
  },
  createButtonText: {
    color: "#fff", // El texto del botón primario suele ser blanco
    fontWeight: "bold",
    fontSize: 16,
  },
  citaItem: {
    // backgroundColor: "#fff", // Quitado, se aplica inline
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2, // Sombra Android
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
     // Sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  citaInfo: {
    flex: 1,
    marginRight: 10, // Espacio antes de los botones de acción
  },
  citaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Alinea badge arriba
    marginBottom: 4,
  },
  paciente: {
    fontWeight: "bold",
    fontSize: 16,
    // color: "#2C3E50", // Quitado, se aplica inline
    flexShrink: 1, // Permite que el nombre se acorte si es muy largo
    marginRight: 8, // Espacio antes del badge
  },
  estadoBadge: {
    paddingHorizontal: 10, // Más padding horizontal
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 2, // Alinea un poco mejor con el nombre
  },
  estadoText: {
    color: "#fff", // El texto del badge suele ser blanco
    fontWeight: "bold",
    fontSize: 10,
    textTransform: 'capitalize', // Pone la primera letra en mayúscula
  },
  medico: {
    // color: "#007AFF", // Quitado, se aplica inline (color primario)
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4, // Aumentado espacio
  },
  fecha: {
    // color: "#666", // Quitado, se aplica inline (subtext)
    fontSize: 12,
    marginBottom: 6, // Aumentado espacio
  },
  motivo: {
    // color: "#555", // Quitado, se aplica inline (subtext)
    fontSize: 12,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12, // Espacio entre botones de acción
  },
  actionButton: {
    padding: 8,
    borderRadius: 20, // Más redondeado
    // backgroundColor: "#f8f9fa", // Quitado, se aplica inline
  },
   emptyListContainer: { // Estilo para centrar el mensaje de lista vacía
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40, // Menos padding vertical
     paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    // color: "#666", // Quitado, se aplica inline
    marginTop: 15,
    marginBottom: 25,
     textAlign: 'center', // Centrar texto
  },
  emptyButton: {
    // backgroundColor: "#007AFF", // Quitado, se aplica inline
    paddingHorizontal: 25, // Más padding
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});