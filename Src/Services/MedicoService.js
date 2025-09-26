// Services/MedicoService.js - Solo para Admin
import api from "./Conexion"

// ⚠️ IMPORTANTE: Solo ADMIN puede usar estas funciones
// Los doctores NO pueden gestionar otros médicos

export const getMedicos = async () => {
  try {
    console.log("🔄 Obteniendo lista de médicos (Solo Admin)...")
    const response = await api.get("/ListarMedicos")
    console.log("📡 Respuesta médicos:", response.status)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo médicos:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener médicos",
      data: [],
    }
  }
}
export const createMedico = async (medicoData) => {
  try {
    console.log("🔄 Creando médico (Solo Admin):", medicoData)
    const response = await api.post("/CrearMedicos", medicoData)
    return {
      success: true,
      data: response.data,
      message: "Médico creado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error creando médico:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al crear médico",
      errors: error.response?.data?.errors || {},
    }
  }
}
export const updateMedico = async (id, medicoData) => {
  try {
    console.log(`🔄 Actualizando médico ID: ${id} (Solo Admin)...`, medicoData)
    const response = await api.put(`/ActualizarMedicos/${id}`, medicoData)
    return {
      success: true,
      data: response.data,
      message: "Médico actualizado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error actualizando médico:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al actualizar médico",
      errors: error.response?.data?.errors || {},
    }
  }
}
export const deleteMedico = async (id) => {
  try {
    console.log(`🔄 Eliminando médico ID: ${id}...`)
    const response = await api.delete(`/EliminarMedicos/${id}`)
    return {
      success: true,
      message: response.data?.message || "Médico eliminado exitosamente",
    }
  } catch (error) {
    console.error("❌ Error eliminando médico:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al eliminar médico",
    }
  }
}
export const getMedico = async (id) => {
  try {
    console.log(`🔄 Obteniendo médico ID: ${id}...`)
    const response = await api.get(`/MostrarMedicos/${id}`)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo médico:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Médico no encontrado",
    }
  }
}
// 🔹 OBTENER CITAS POR MÉDICO: Admin y Doctor pueden usar esta función
export const getCitasPorMedico = async (medicoId) => {
  try {
    console.log(`🔄 Obteniendo citas para médico ID: ${medicoId}...`)
    const response = await api.get(`/medicos/${medicoId}/citas`)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo citas por médico:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener citas del médico",
      data: [],
    }
  }
}
// 🔹 OBTENER MÉDICOS POR ESPECIALIDAD: Útil para todos los roles
export const getMedicosPorEspecialidad = async (especialidad) => {
  try {
    console.log(`🔄 Obteniendo médicos de especialidad: ${especialidad}...`)
    const response = await api.get(`/medicos/especialidad/${especialidad}`)
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo médicos por especialidad:", error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener médicos por especialidad",
      data: [],
    }
  }
}