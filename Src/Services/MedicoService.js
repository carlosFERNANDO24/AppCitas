// Services/MedicoService.js
import api from "./Conexion"

export const getMedicos = async () => {
  try {
    const response = await api.get("/ListarMedicos")
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al obtener médicos" }
  }
}

export const createMedico = async (medicoData) => {
  try {
    const response = await api.post("/CrearMedicos", medicoData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al crear médico" }
  }
}

export const updateMedico = async (id, medicoData) => {
  try {
    const response = await api.put(`/ActualizarMedicos/${id}`, medicoData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al actualizar médico" }
  }
}

export const deleteMedico = async (id) => {
  try {
    await api.delete(`/EliminarMedicos/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al eliminar médico" }
  }
}