// Src/Services/MedicosPService.js
import api from "./Conexion"

export const getMedicosForPaciente = async () => {
  try {
    console.log("🔄 Obteniendo lista de médicos para paciente...")
    // Suponiendo que has creado una nueva ruta en el backend (por ejemplo, /Medicos/publica)
    const response = await api.get("/Medicos/publica")
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo lista de médicos:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al obtener la lista de médicos",
      data: [],
    }
  }
}