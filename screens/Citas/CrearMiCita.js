// screens/Citas/CrearMiCita.js
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { useState, useEffect } from "react";
import { createMyCita } from "../../Src/Services/CitasPService";
import { getMedicos } from "../../Src/Services/MedicoPService"; 
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { Ionicons } from "@expo/vector-icons"; 

export default function CrearMiCita() {
  const navigation = useNavigation();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [formData, setFormData] = useState({
    fecha_hora: new Date(), 
    estado: "programada",
    motivo_consulta: "",
    observaciones: "", 
    medico_id: "",
  });

  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        setLoading(true);
        const result = await getMedicos(); 
        if (result.success) {
          setMedicos(result.data);
          if (result.data.length > 0) {
            setFormData((prev) => ({ ...prev, medico_id: result.data[0].id }));
          }
        } else {
          Alert.alert("Error", "No se pudo cargar la lista de médicos.");
        }
      } catch (error) {
        console.error("Error en cargarMedicos:", error);
        Alert.alert("Error", "Ocurrió un error inesperado al cargar los médicos.");
      } finally {
        setLoading(false);
      }
    };
    cargarMedicos();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      const currentDate = selectedDate || formData.fecha_hora;
      const newDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        formData.fecha_hora.getHours(),
        formData.fecha_hora.getMinutes()
      );
      handleChange("fecha_hora", newDateTime);
    }
  };


  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const currentTime = selectedTime || formData.fecha_hora;
    
      const newDateTime = new Date(
        formData.fecha_hora.getFullYear(),
        formData.fecha_hora.getMonth(),
        formData.fecha_hora.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes()
      );
      handleChange("fecha_hora", newDateTime);
    }
  };

  const handleSubmit = async () => {
     if (!formData.medico_id || !formData.motivo_consulta) {
      Alert.alert("Error", "Médico y motivo de consulta son obligatorios");
      return;
    }
    if (!(formData.fecha_hora instanceof Date) || isNaN(formData.fecha_hora)) {
      Alert.alert("Error", "La fecha y hora seleccionadas no son válidas.");
      return;
    }


    setIsSubmitting(true); 
    try {
      
      const dataToSend = {
        ...formData,
        fecha_hora: formData.fecha_hora.toISOString(),
      };
      const result = await createMyCita(dataToSend);
      if (result.success) {
        Alert.alert("Éxito", result.message);
        navigation.goBack();
      } else {
        const errors = result.errors;
        let errorMsg = result.message || "Error desconocido"; // Use message instead of error
        if (errors) {
          errorMsg = Object.values(errors).flat().join("\n");
        }
        Alert.alert("Error", errorMsg);
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al crear la cita.");
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  };

  if (loading && !isSubmitting) { // Show loading only for initial data fetch
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando médicos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Crear Nueva Cita</Text>

      {/* Date and Time Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha y Hora *</Text>
        <View style={styles.datetimeContainer}>
          {/* Date Button */}
          <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.datetimeText}>
              {formData.fecha_hora.toLocaleDateString("es-ES")}
            </Text>
          </TouchableOpacity>

          {/* Time Button */}
          <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time" size={20} color="#007AFF" />
            <Text style={styles.datetimeText}>
              {formData.fecha_hora.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()} // Prevent selecting past dates
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={formData.fecha_hora}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Motivo de la Consulta *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe brevemente el motivo"
        multiline
        numberOfLines={4}
        value={formData.motivo_consulta}
        onChangeText={(text) => handleChange("motivo_consulta", text)}
        editable={!isSubmitting}
      />

       <Text style={styles.label}>Observaciones (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notas o detalles adicionales"
        multiline
        numberOfLines={3}
        value={formData.observaciones}
        onChangeText={(text) => handleChange("observaciones", text)}
        editable={!isSubmitting}
      />


      <Text style={styles.label}>Médico *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={formData.medico_id}
          onValueChange={(itemValue) => handleChange("medico_id", itemValue)}
          enabled={!isSubmitting}
        >
          {medicos.length === 0 && <Picker.Item label="Cargando médicos..." value="" />}
          {medicos.map((medico) => (
            <Picker.Item
              key={medico.id}
              label={`${medico.nombre} ${medico.apellido} (${medico.especialidad})`}
              value={medico.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
         <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Confirmar Cita</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting} // Deshabilitar si se está enviando
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
   header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
   inputGroup: {
    marginBottom: 20,
  },
  label: { fontSize: 16, fontWeight: "bold", color: "#2C3E50", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
     paddingVertical: 12,
    marginBottom: 5, // Reduced margin
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: '#333',
  },
   textArea: {
    minHeight: 100,
    textAlignVertical: "top", // Align text to the top for multiline
  },
   datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
     marginBottom: 15,
  },
  datetimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flex: 0.48, // Take slightly less than half width
    backgroundColor: '#fff',
    justifyContent: 'center', // Center content
  },
  datetimeText: {
    marginLeft: 8,
    fontSize: 16, // Consistent font size
    color: "#2C3E50",
  },
  pickerContainer: { // Container to style the picker background and border
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    overflow: 'hidden', // Necessary on Android to respect borderRadius
  },
  picker: {
    // backgroundColor: "#fff", // Removed, applied to container
    // marginBottom: 15, // Removed, applied to container
    // borderWidth: 1, // Removed, applied to container
    // borderColor: "#ccc", // Removed, applied to container
     height: Platform.OS === 'ios' ? 180 : 50, // Specific height adjustments
     width: '100%', // Ensure it takes full width
     color: '#333',
  },
  buttonContainer: { marginTop: 20, gap: 10 }, // Add gap between buttons
   submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // Space between icon and text
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
   buttonDisabled: {
    opacity: 0.6,
  },
    button: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
    cancelButton: {
    backgroundColor: "#6c757d", // Grey color for cancel
  },
   cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});