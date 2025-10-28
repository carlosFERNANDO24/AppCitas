// screens/Citas/editarCita.js
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, FlatList, Platform } from "react-native"; // Agregado Platform
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateCita } from "../../Src/Services/CitaService";
import { getPacientes } from "../../Src/Services/PacienteService";
import { getMedicos } from "../../Src/Services/MedicoService";
import { useTheme } from "../../context/ThemeContext"; // 1. Importar useTheme

export default function EditarCita() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme(); // 2. Obtener colors
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  // ... (Estado formData sin cambios)
   const [formData, setFormData] = useState({
    id: "",
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
    // ... (Lógica de carga inicial sin cambios)
      if (route.params?.cita) {
      const cita = route.params.cita;
      // Intenta obtener nombres directamente si existen, sino usa los objetos relacionados
      const pacienteNombreCompleto = cita.paciente_nombre || (cita.paciente ? `${cita.paciente.nombre || ''} ${cita.paciente.apellido || ''}`.trim() : '');
      const medicoNombreCompleto = cita.medico_nombre || (cita.medico ? `Dr. ${cita.medico.nombre || ''} ${cita.medico.apellido || ''}`.trim() : '');

      setFormData({
        id: cita.id,
        paciente_id: cita.paciente_id,
        paciente_nombre: pacienteNombreCompleto || "Paciente no especificado",
        medico_id: cita.medico_id,
        medico_nombre: medicoNombreCompleto || "Médico no especificado",
        // Asegúrate de que la fecha_hora sea un objeto Date válido
        fecha_hora: cita.fecha_hora ? new Date(cita.fecha_hora) : new Date(),
        estado: cita.estado || "programada",
        motivo_consulta: cita.motivo_consulta || "",
        observaciones: cita.observaciones || "",
      });
    }
    cargarDatos();
  }, [route.params]);

  const cargarDatos = async () => {
    // ... (sin cambios)
     try {
      const [pacientesResult, medicosResult] = await Promise.all([getPacientes(), getMedicos()])

      if (pacientesResult.success) setPacientes(pacientesResult.data)
      if (medicosResult.success) setMedicos(medicosResult.data)
    } catch (error) {
      console.error("Error cargando datos:", error)
        Alert.alert("Error", "No se pudieron cargar los datos necesarios para editar la cita.");
    }
  };

  const handleChange = (field, value) => {
    // ... (sin cambios)
     setFormData((prev) => ({ ...prev, [field]: value }))
  };

  const handleDateChange = (event, selectedDate) => {
    // ... (sin cambios)
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
    // ... (sin cambios)
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
    // ... (sin cambios)
    if (!formData.paciente_id || !formData.medico_id || !formData.motivo_consulta) {
      Alert.alert("Error", "Paciente, médico y motivo de consulta son obligatorios")
      return
    }

    setLoading(true)

    const citaData = {
      paciente_id: formData.paciente_id,
      medico_id: formData.medico_id,
      // Asegúrate de enviar en formato ISO correcto
      fecha_hora: formData.fecha_hora.toISOString(),
      estado: formData.estado,
      motivo_consulta: formData.motivo_consulta,
      observaciones: formData.observaciones,
    }

    const result = await updateCita(formData.id, citaData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Cita actualizada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }])
    } else {
        const errorMsg = result.errors
            ? Object.values(result.errors).flat().join('\n')
            : result.message || result.error || "Ocurrió un error desconocido al actualizar.";
      Alert.alert("Error", errorMsg)
    }
  };

  const renderPacienteItem = ({ item }) => (
    <TouchableOpacity
      // 3. Aplicar colores
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        handleChange("paciente_id", item.id);
        handleChange("paciente_nombre", `${item.nombre} ${item.apellido}`);
        setShowPacienteModal(false);
      }}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}>
        {item.nombre} {item.apellido}
      </Text>
      <Text style={[styles.modalItemSubtext, { color: colors.subtext }]}>Doc: {item.documento}</Text>
    </TouchableOpacity>
  );

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      // 3. Aplicar colores
      style={[styles.modalItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        handleChange("medico_id", item.id);
        handleChange("medico_nombre", `Dr. ${item.nombre} ${item.apellido}`);
        setShowMedicoModal(false);
      }}
    >
      <Text style={[styles.modalItemText, { color: colors.text }]}>
        Dr. {item.nombre} {item.apellido}
      </Text>
      <Text style={[styles.modalItemSubtext, { color: colors.subtext }]}>{item.especialidad}</Text>
    </TouchableOpacity>
  );

  return (
    // 3. Aplicar color fondo
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Editar Cita Médica</Text>

       {/* 3. Aplicar colores tarjeta */}
      <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.text }]}>
        {/* Selección de Paciente */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Paciente *</Text>
          <TouchableOpacity
            style={[styles.selectButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Aplicar colores
            onPress={() => setShowPacienteModal(true)}
            >
            <Text style={[styles.selectButtonText, { color: colors.text }]}>{formData.paciente_nombre}</Text> {/* Aplicar color texto */}
            <Ionicons name="chevron-down" size={20} color={colors.subtext} /> {/* Aplicar color icono */}
          </TouchableOpacity>
        </View>

        {/* Selección de Médico */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Médico *</Text>
          <TouchableOpacity
             style={[styles.selectButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Aplicar colores
             onPress={() => setShowMedicoModal(true)}
             >
            <Text style={[styles.selectButtonText, { color: colors.text }]}>{formData.medico_nombre}</Text> {/* Aplicar color texto */}
            <Ionicons name="chevron-down" size={20} color={colors.subtext} /> {/* Aplicar color icono */}
          </TouchableOpacity>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Fecha y Hora *</Text>
          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={[styles.datetimeButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Aplicar colores
              onPress={() => setShowDatePicker(true)}
              >
              <Ionicons name="calendar" size={20} color={colors.primary} /> {/* Color icono primario */}
              <Text style={[styles.datetimeText, { color: colors.text }]}>{formData.fecha_hora.toLocaleDateString("es-ES")}</Text> {/* Color texto */}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.datetimeButton, { backgroundColor: colors.background, borderColor: colors.border }]} // Aplicar colores
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
          <Text style={[styles.label, { color: colors.text }]}>Estado</Text>
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
          <Text style={[styles.label, { color: colors.text }]}>Motivo de Consulta *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} // Aplicar colores
            placeholder="Describa el motivo de la consulta"
            placeholderTextColor={colors.placeholder} // Aplicar color placeholder
            value={formData.motivo_consulta}
            onChangeText={(text) => handleChange("motivo_consulta", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Observaciones */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Observaciones</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} // Aplicar colores
            placeholder="Observaciones adicionales"
            placeholderTextColor={colors.placeholder} // Aplicar color placeholder
            value={formData.observaciones}
            onChangeText={(text) => handleChange("observaciones", text)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          {/* Botón Cancelar - Usar color subtexto o un gris */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { backgroundColor: colors.subtext }]}
            onPress={() => navigation.goBack()}
            >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

           {/* Botón Guardar - Usar color primario */}
          <TouchableOpacity
            style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>{loading ? "Actualizando..." : "Actualizar Cita"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
           // themeVariant={darkMode ? 'dark' : 'light'}
           />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          // themeVariant={darkMode ? 'dark' : 'light'}
           />
      )}

        {/* Modales - Aplicar colores */}
        <Modal visible={showPacienteModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Paciente</Text>
                        <TouchableOpacity onPress={() => setShowPacienteModal(false)}>
                            <Ionicons name="close" size={24} color={colors.subtext} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={pacientes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPacienteItem}
                         ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
                        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.subtext }]}>No hay pacientes</Text>}
                    />
                </View>
            </View>
        </Modal>

        <Modal visible={showMedicoModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Médico</Text>
                        <TouchableOpacity onPress={() => setShowMedicoModal(false)}>
                            <Ionicons name="close" size={24} color={colors.subtext} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={medicos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderMedicoItem}
                         ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
                        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.subtext }]}>No hay médicos</Text>}
                    />
                </View>
            </View>
        </Modal>
        <View style={{ height: 50 }} />
    </ScrollView>
  );
}

// 4. Ajustar StyleSheet quitando colores fijos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5", // Quitado
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#2C3E50", // Quitado
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    // backgroundColor: "#fff", // Quitado
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
    // color: "#2C3E50", // Quitado
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    // borderColor: "#ddd", // Quitado
    borderRadius: 8,
    padding: 12,
    // backgroundColor: "#fff", // Quitado
  },
  selectButtonText: {
    fontSize: 16,
    // color: "#2C3E50", // Quitado
  },
    selectButtonPlaceholder: { // Añadido para placeholder
    fontSize: 16,
    // color: "#999", // Se aplica inline
  },
  datetimeContainer: {
    flexDirection: "row",
     gap: 10, // Espacio
  },
  datetimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    // borderColor: "#ddd", // Quitado
    borderRadius: 8,
    padding: 12,
    flex: 1, // Ocupan espacio equitativo
     justifyContent: 'center',
  },
  datetimeText: {
    marginLeft: 8,
    fontSize: 14,
    // color: "#2C3E50", // Quitado
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
     // justifyContent: "space-between", // Mantenido si se prefiere
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    // width: "48%", // Quitado por gap
    marginBottom: 10, // Para wrap
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    // borderColor: "#007AFF", // Quitado
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // backgroundColor: "#007AFF", // Quitado
  },
  radioText: {
    fontSize: 14,
    // color: "#2C3E50", // Quitado
  },
  input: {
    borderWidth: 1,
    // borderColor: "#ddd", // Quitado
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    // color, backgroundColor se aplican inline
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30, // Más espacio arriba
    gap: 15, // Más espacio entre botones
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
     elevation: 2, // Sombra botones
  },
  saveButton: {
    // backgroundColor: "#007AFF", // Quitado
  },
  cancelButton: {
    // backgroundColor: "#6c757d", // Quitado
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff", // El texto del botón cancelar también blanco
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
    // backgroundColor: "#fff", // Quitado
    borderRadius: 12,
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: "90%",
    maxHeight: "70%",
     elevation: 5,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 4,
     overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
     borderBottomWidth: 1,
     // borderBottomColor: ... // Aplicado inline
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#2C3E50", // Quitado
  },
  modalItem: {
    paddingVertical: 15,
     paddingHorizontal: 20,
    borderBottomWidth: 1,
    // borderBottomColor: "#eee", // Quitado
  },
   modalItemText: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#2C3E50", // Quitado
  },
  modalItemSubtext: {
    fontSize: 14,
    // color: "#666", // Quitado
    marginTop: 2,
  },
   emptyText: { // Añadido para modal
    textAlign: "center",
    // color: "#666", // Se aplica inline
    padding: 20,
    fontSize: 15,
  },
});