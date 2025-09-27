// Src/Services/PacientePService.js
import api from "./Conexion"

export const createMyPaciente = async (pacienteData) => {
  try {
    const response = await api.post("/CrearMiPaciente", pacienteData)
    return {
      success: true,
      message: response.data.message || "Perfil de paciente creado exitosamente",
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear el perfil de paciente",
      errors: error.response?.data?.errors || {},
    }
  }
}