// Src/Services/HistorialPService.js
import api from "./Conexion"

// 🔹 PACIENTE: Solo puede ver SU historial médico
export const getMiHistorial = async () => {
  try {
    console.log("🔄 Obteniendo MI historial médico (Paciente)...")
    const response = await api.get("/MiHistorialMedico")
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