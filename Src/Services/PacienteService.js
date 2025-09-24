// Services/PacienteService.js
import api from "./Conexion"

export const getPacientes = async () => {
  try {
    const response = await api.get("/ListarPacientes")
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al obtener pacientes" }
  }
}

export const createPaciente = async (pacienteData) => {
  try {
    const response = await api.post("/CrearPacientes", pacienteData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al crear paciente" }
  }
}

export const updatePaciente = async (id, pacienteData) => {
  try {
    const response = await api.put(`/ActualizarPacientes/${id}`, pacienteData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al actualizar paciente" }
  }
}

export const deletePaciente = async (id) => {
  try {
    await api.delete(`/EliminarPacientes/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al eliminar paciente" }
  }
}