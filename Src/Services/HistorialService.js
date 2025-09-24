// Services/HistorialService.js
import api from "./Conexion"

export const getHistorial = async () => {
  try {
    const response = await api.get("/ListarHistorialMedico")
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al obtener historial" }
  }
}

export const createHistorial = async (historialData) => {
  try {
    const response = await api.post("/CrearHistorialMedico", historialData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al crear historial" }
  }
}

export const updateHistorial = async (id, historialData) => {
  try {
    const response = await api.put(`/ActualizarHistorialMedico/${id}`, historialData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al actualizar historial" }
  }
}

export const deleteHistorial = async (id) => {
  try {
    await api.delete(`/EliminarHistorialMedico/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al eliminar historial" }
  }
}