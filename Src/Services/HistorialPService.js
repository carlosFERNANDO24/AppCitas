// HistorialPService.js
import api from "./Conexion"

// Obtener el historial médico completo del paciente autenticado
export const getMyHistorial = async () => {
    try {
        console.log("🔄 Obteniendo mi historial médico...")
        const response = await api.get("/MiHistorialMedico")
        return {
            success: true,
            data: response.data || [],
        }
    } catch (error) {
        console.error("❌ Error en getMyHistorial:", error)
        return {
            success: false,
            message: error.response?.data?.message || "Error al obtener el historial médico",
            data: [],
        }
    }
}