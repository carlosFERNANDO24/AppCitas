// Services/PacienteService.js - Solo para Admin y Doctor
import api from "./Conexion"
// ⚠️ IMPORTANTE: Admin y Doctor pueden usar estas funciones
// Los pacientes NO tienen acceso a gestión de otros pacientes
export const getPacientes = async () => {
  try {
    console.log("🔄 Obteniendo lista de pacientes (Solo Admin)...")
    const response = await api.get("/ListarPacientes")
    console.log("📡 Respuesta pacientes:", response.status)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo pacientes:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener pacientes",
      data: [],
    }
  }
}
export const createPaciente = async (pacienteData) => {
  try {
    console.log("🔄 Creando paciente (Solo Admin):", pacienteData)
    const response = await api.post("/CrearPacientes", pacienteData)
    return {
      success: true,
      data: response.data,
      message: "Paciente creado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error creando paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al crear paciente",
      errors: error.response?.data?.errors || {},
    }
  }
}
export const updatePaciente = async (id, pacienteData) => {
  try {
    console.log(`🔄 Actualizando paciente ID: ${id} (Solo Admin)...`, pacienteData)
    const response = await api.put(`/ActualizarPacientes/${id}`, pacienteData)
    return {
      success: true,
      data: response.data,
      message: "Paciente actualizado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error actualizando paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al actualizar paciente",
      errors: error.response?.data?.errors || {},
    }
  }
}
export const deletePaciente = async (id) => {
  try {
    console.log(`🔄 Eliminando paciente ID: ${id} (Solo Admin)...`)
    const response = await api.delete(`/EliminarPacientes/${id}`)
    return {
      success: true,
      message: response.data?.message || "Paciente eliminado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error eliminando paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al eliminar paciente",
    }
  }
}
export const getPaciente = async (id) => {
  try {
    console.log(`🔄 Obteniendo paciente ID: ${id} (Solo Admin)...`)
    const response = await api.get(`/MostrarPacientes/${id}`)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Paciente no encontrado",
    }
  }
}
// 🔹 OBTENER CITAS POR PACIENTE: Admin y Doctor pueden usar esta función
export const getCitasPorPaciente = async (pacienteId) => {
  try {
    console.log(`🔄 Obteniendo citas para paciente ID: ${pacienteId}...`)
    const response = await api.get(`/pacientes/${pacienteId}/citas`)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo citas por paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener citas del paciente",
      data: [],
    }
  }
}
// 🔹 OBTENER PACIENTES MAYORES DE 60: Función adicional disponible en la API
export const getPacientesMayores60 = async () => {
  try {
    console.log("🔄 Obteniendo pacientes mayores de 60 años...")
    const response = await api.get("/pacientes/mayores-60")
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo pacientes mayores de 60:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener pacientes mayores de 60",
      data: [],
    }
  }
}