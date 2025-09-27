// Services/MedicoPService.js - Solo para Paciente

import api from "./Conexion"

export const getMedicos = async () => {
  try {
    console.log("🔄 Obteniendo lista de médicos (para Paciente)...")
    const response = await api.get("/ListarMedicos")
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error obteniendo médicos para paciente:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener la lista de médicos",
      data: [],
    }
  }
}