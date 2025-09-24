// Services/CitaService.js
import api from "./Conexion"

export const getCitas = async () => {
  try {
    const response = await api.get("/ListarCitas")
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al obtener citas" }
  }
}

export const getMisCitas = async () => {
  try {
    const response = await api.get("/MisCitas")
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al obtener mis citas" }
  }
}

export const createCita = async (citaData) => {
  try {
    const response = await api.post("/CrearCitas", citaData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al crear cita" }
  }
}

export const updateCita = async (id, citaData) => {
  try {
    const response = await api.put(`/ActualizarCitas/${id}`, citaData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al actualizar cita" }
  }
}

export const deleteCita = async (id) => {
  try {
    await api.delete(`/EliminarCitas/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al eliminar cita" }
  }
}