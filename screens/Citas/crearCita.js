// screens/Citas/crearCita.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, FlatList, Platform } from "react-native"; // Añadido Platform
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createCita } from "../../Src/Services/CitaService";
import { getPacientes } from "../../Src/Services/PacienteService";
import { getMedicos } from "../../Src/Services/MedicoService";
import { useTheme } from "../../context/ThemeContext"; // Asegúrate que esta importación esté

export default function CrearCita() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Obtener colors del contexto
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [formData, setFormData] = useState({
    paciente_id: "",
    paciente_nombre: "",
    medico_id: "",
    medico_nombre: "",
    fecha_hora: new Date(),
    estado: "programada",
    motivo_consulta: "",
    observaciones: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [pacientesResult, medicosResult] = await Promise.all([getPacientes(), getMedicos()]);

      if (pacientesResult.success) setPacientes(pacientesResult.data);
      if (medicosResult.success) setMedicos(medicosResult.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      // Considera mostrar un Alert aquí si la carga falla
      // Alert.alert("Error", "No se pudieron cargar los datos necesarios para crear la cita.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
     if (Platform.OS === 'android') {
        setShowDatePicker(false);
     }
     if (selectedDate) {
        const currentDateTime = new Date(formData.fecha_hora);
        const newDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentDateTime.getHours(),
            currentDateTime.getMinutes()
        );
        handleChange("fecha_hora", newDateTime);
         if (Platform.OS === 'ios') {
            setShowDatePicker(false);
         }
     } else if (Platform.OS === 'ios') {
        setShowDatePicker(false);
     }
  };

  const handleTimeChange = (event, selectedTime) => {
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
     }
     if (selectedTime) {
         const currentDateTime = new Date(formData.fecha_hora);
         const newDateTime = new Date(
            currentDateTime.getFullYear(),
            currentDateTime.getMonth(),
            currentDateTime.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );
         handleChange("fecha_hora", newDateTime);
          if (Platform.OS === 'ios') {
            setShowTimePicker(false);
         }
     } else if (Platform.OS === 'ios') {
         setShowTimePicker(false);
     }
  };

  const handleSubmit = async () => {
    if (!formData.paciente_id || !formData.medico_id || !formData.motivo_consulta) {
      Alert.alert("Error", "Paciente, médico y motivo de consulta son obligatorios");
      return;
    }

    setLoading(true);

    const citaData = {
      paciente_id: formData.paciente_id,
      medico_id: formData.medico_id,
      fecha_hora: formData.fecha_hora.toISOString(),
      estado: formData.estado,
      motivo_consulta: formData.motivo_consulta,
      observaciones: formData.observaciones,
    };

    const result = await createCita(citaData);
    setLoading(false);

    if (result.success) {
      Alert.alert("Éxito", "Cita creada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } else {
        const errorMsg = result.errors
            ? Object.values(result.errors).flat().join('\n')
            : result.message || result.error || "Ocurrió un error desconocido al crear la cita.";
        Alert.alert("Error", errorMsg);
    }
  };

  const renderPacienteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]} // Aplicar color borde
      onPress={() => {
        handleChange("paciente_id", item.id);
        handleChange("paciente_nombre", `${item.nombre} ${item.apellido}`);
        setShowPacienteModal(false);
      }}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}> {/* Aplicar color texto */}
        {item.nombre} {item.apellido}
      </Text>
      <Text style={[styles.modalItemSubtext, { color: colors.subtext }]}>Doc: {item.documento}</Text> {/* Aplicar color subtexto */}
    </TouchableOpacity>
  );

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.modalItem, { borderBottomColor: colors.border }]} // Aplicar color borde
      onPress={() => {
        handleChange("medico_id", item.id);
        handleChange("medico_nombre", `Dr. ${item.nombre} ${item.apellido}`);
        setShowMedicoModal(false);
      }}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}> {/* Aplicar color texto */}
        Dr. {item.nombre} {item.apellido}
      </Text>
      <Text style={[styles.modalItemSubtext, { color: colors.subtext }]}>{item.especialidad}</Text> {/* Aplicar color subtexto */}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> {/* Color fondo principal */}
      <Text style={[styles.header, { color: colors.text }]}>Nueva Cita Médica</Text> {/* Color texto header */}

      <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.text }]}> {/* Color fondo tarjeta y sombra */}
        {/* Selección de Paciente */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Paciente *</Text> {/* Color texto label */}
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Colores botón selección
            onPress={() => setShowPacienteModal(true)}
          >
            <Text style={formData.paciente_nombre ? [styles.selectButtonText, { color: colors.text }] : [styles.selectButtonPlaceholder, { color: colors.placeholder }]}> {/* Color texto o placeholder */}
              {formData.paciente_nombre || "Seleccionar paciente"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.subtext} /> {/* Color icono */}
          </TouchableOpacity>
        </View>

        {/* Selección de Médico */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Médico *</Text> {/* Color texto label */}
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Colores botón selección
            onPress={() => setShowMedicoModal(true)}>
            <Text style={formData.medico_nombre ? [styles.selectButtonText, { color: colors.text }] : [styles.selectButtonPlaceholder, { color: colors.placeholder }]}> {/* Color texto o placeholder */}
              {formData.medico_nombre || "Seleccionar médico"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.subtext} /> {/* Color icono */}
          </TouchableOpacity>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Fecha y Hora *</Text> {/* Color texto label */}
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={[styles.datetimeButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Colores botón fecha/hora
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} /> {/* Color icono primario */}
              <Text style={[styles.datetimeText, { color: colors.text }]}>{formData.fecha_hora.toLocaleDateString("es-ES")}</Text> {/* Color texto */}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.datetimeButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Colores botón fecha/hora
              onPress={() => setShowTimePicker(true)}
              >
              <Ionicons name="time" size={20} color={colors.primary} /> {/* Color icono primario */}
              <Text style={[styles.datetimeText, { color: colors.text }]}> {/* Color texto */}
                {formData.fecha_hora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Estado</Text> {/* Color texto label */}
          <View style={styles.radioContainer}>
            {["programada", "confirmada", "completada", "cancelada"].map((estado) => (
              <TouchableOpacity key={estado} style={styles.radioOption} onPress={() => handleChange("estado", estado)}>
                <View style={[styles.radioCircle, { borderColor: colors.primary }]}> {/* Color borde primario */}
                  {formData.estado === estado && <View style={[styles.radioSelected, { backgroundColor: colors.primary }]} />} {/* Color fondo primario */}
                </View>
                <Text style={[styles.radioText, { color: colors.text }]}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Text> {/* Color texto */}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivo de Consulta */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Motivo de Consulta *</Text> {/* Color texto label */}
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} // Colores input
            placeholder="Describa el motivo de la consulta"
            placeholderTextColor={colors.placeholder} // Color placeholder
            value={formData.motivo_consulta}
            onChangeText={(text) => handleChange("motivo_consulta", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Observaciones */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Observaciones</Text> {/* Color texto label */}
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} // Colores input
            placeholder="Observaciones adicionales"
            placeholderTextColor={colors.placeholder} // Color placeholder
            value={formData.observaciones}
            onChangeText={(text) => handleChange("observaciones", text)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]} // Color fondo primario
          onPress={handleSubmit}
          disabled={loading}
        >
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>{loading ? "Creando Cita..." : "Crear Cita"}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          // themeVariant={darkMode ? 'dark' : 'light'} // Comentado por si no es compatible universalmente
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          // themeVariant={darkMode ? 'dark' : 'light'} // Comentado por si no es compatible universalmente
           />
      )}

      {/* Modal de Selección de Paciente */}
        <Modal visible={showPacienteModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}> {/* Color fondo modal */}
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}> {/* Color borde header modal */}
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Paciente</Text> {/* Color texto título modal */}
                        <TouchableOpacity onPress={() => setShowPacienteModal(false)}>
                            <Ionicons name="close" size={24} color={colors.subtext} /> {/* Color icono cerrar */}
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={pacientes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPacienteItem}
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />} // Separador con color del tema
                        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.subtext }]}>No hay pacientes disponibles</Text>} // Color texto vacío
                    />
                </View>
            </View>
        </Modal>

        {/* Modal de Selección de Médico */}
        <Modal visible={showMedicoModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}> {/* Color fondo modal */}
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}> {/* Color borde header modal */}
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Médico</Text> {/* Color texto título modal */}
                        <TouchableOpacity onPress={() => setShowMedicoModal(false)}>
                            <Ionicons name="close" size={24} color={colors.subtext} /> {/* Color icono cerrar */}
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={medicos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderMedicoItem}
                         ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />} // Separador con color del tema
                        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.subtext }]}>No hay médicos disponibles</Text>} // Color texto vacío
                    />
                </View>
            </View>
        </Modal>
         <View style={{ height: 50 }} /> {/* Espacio extra al final */}
    </ScrollView>
  );
}

// Estilos sin colores hardcodeados (se aplican inline)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    borderRadius: 12,
    padding: 20,
    elevation: 2, // Sombra Android
     // Sombra iOS
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.1,
     shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
  },
  selectButtonPlaceholder: {
    fontSize: 16,
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
     gap: 10,
  },
  datetimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flex: 1,
     justifyContent: 'center',
  },
  datetimeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
     gap: 15, // Aumentado el espacio
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Mantenido para separación vertical si envuelve
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    borderRadius: 12,
    paddingVertical: 0, // Padding vertical gestionado por header/items
    paddingHorizontal: 0,
    width: "90%",
    maxHeight: "70%",
    elevation: 5,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 4,
     overflow: 'hidden', // Asegura que el borde redondeado recorte el FlatList
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15, // Aumentado padding vertical
     borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalItem: {
    paddingVertical: 15,
     paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
   modalItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalItemSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 15,
  },
});