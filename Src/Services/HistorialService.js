// Services/HistorialService.js - Corregido con función para pacientes
import api from "./Conexion"

// 🔹 ADMIN y DOCTOR: Pueden ver TODO el historial médico
export const getHistorial = async () => {
  try {
    console.log("🔄 Obteniendo todo el historial médico (Admin/Doctor)...")
    const response = await api.get("/ListarHistorialMedico")
    console.log("📡 Respuesta historial:", response.status)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo historial:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener historial",
      data: [],
    }
  }
}
// 🔹 PACIENTE: Solo puede ver SU historial médico
export const getMiHistorial = async () => {
  try {
    console.log("🔄 Obteniendo MI historial médico (Paciente)...")
    const response = await api.get("/MiHistorialMedico")
    console.log("📡 Respuesta mi historial:", response.status)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo mi historial:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener mi historial",
      data: [],
    }
  }
}
// 🔹 CREAR HISTORIAL: Solo Admin y Doctor
export const createHistorial = async (historialData) => {
  try {
    console.log("🔄 Creando historial médico:", historialData)
    const response = await api.post("/CrearHistorialMedico", historialData)
    return {
      success: true,
      data: response.data,
      message: "Historial creado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error creando historial:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al crear historial",
      errors: error.response?.data?.errors || {},
    }
  }
}
// 🔹 ACTUALIZAR HISTORIAL: Solo Admin y Doctor
export const updateHistorial = async (id, historialData) => {
  try {
    console.log(`🔄 Actualizando historial ID: ${id}...`, historialData)
    const response = await api.put(`/ActualizarHistorialMedico/${id}`, historialData)
    return {
      success: true,
      data: response.data,
      message: "Historial actualizado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error actualizando historial:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al actualizar historial",
      errors: error.response?.data?.errors || {},
    }
  }
}
// 🔹 ELIMINAR HISTORIAL: Solo Admin y Doctor
export const deleteHistorial = async (id) => {
  try {
    console.log(`🔄 Eliminando historial ID: ${id}...`)
    const response = await api.delete(`/EliminarHistorialMedico/${id}`)
    return {
      success: true,
      message: response.data?.message || "Historial eliminado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error eliminando historial:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al eliminar historial",
    }
  }
}
// 🔹 OBTENER UN HISTORIAL: Solo Admin y Doctor
export const getHistorialById = async (id) => {
  try {
    console.log(`🔄 Obteniendo historial ID: ${id}...`)
    const response = await api.get(`/MostrarHistorialMedico/${id}`)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo historial por ID:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Historial no encontrado",
    }
  }
}
// 🔹 OBTENER HISTORIAL POR PACIENTE: Admin y Doctor pueden usar esta función
export const getHistorialPorPaciente = async (pacienteId) => {
  try {
    console.log(`🔄 Obteniendo historial para paciente ID: ${pacienteId}...`)
    const response = await api.get(`/historial/paciente/${pacienteId}`)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo historial por paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener historial del paciente",
      data: [],
    }
  }
}