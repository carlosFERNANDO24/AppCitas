// CitasPService.js
import api from "./Conexion"

// Obtener todas las citas del paciente autenticado
export const getMyCitas = async () => {
    try {
        console.log("🔄 Obteniendo mis citas...")
        const response = await api.get("/MisCitas")
        return {
            success: true,
            data: response.data || [],
        }
    } catch (error) {
        console.error("❌ Error en getMyCitas:", error)
        return {
            success: false,
            message: error.response?.data?.message || "Error al obtener las citas",
            data: [],
        }
    }
}

// Crear una nueva cita para el paciente autenticado
export const createMyCita = async (citaData) => {
    try {
        console.log("🔄 Creando mi cita...", citaData)
        const response = await api.post("/CrearMiCita", citaData)
        return {
            success: true,
            data: response.data,
            message: "Cita creada exitosamente",
        }
    } catch (error) {
        console.error("❌ Error en createMyCita:", error)
        return {
            success: false,
            message: error.response?.data?.message || "Error al crear la cita",
            errors: error.response?.data?.errors || {},
        }
    }
}

// Actualizar una cita específica del paciente autenticado
export const updateMyCita = async (id, citaData) => {
    try {
        console.log(`🔄 Actualizando mi cita ID: ${id}...`, citaData)
        const response = await api.put(`/ActualizarMiCita/${id}`, citaData)
        return {
            success: true,
            data: response.data,
            message: "Cita actualizada exitosamente",
        }
    } catch (error) {
        console.error("❌ Error en updateMyCita:", error)
        return {
            success: false,
            message: error.response?.data?.message || "Error al actualizar la cita",
            errors: error.response?.data?.errors || {},
        }
    }
}

// Eliminar una cita específica del paciente autenticado
export const deleteMyCita = async (id) => {
    try {
        console.log(`🔄 Eliminando mi cita ID: ${id}...`)
        const response = await api.delete(`/EliminarMiCita/${id}`)
        return {
            success: true,
            message: response.data?.message || "Cita eliminada correctamente",
        }
    } catch (error) {
        console.error("❌ Error en deleteMyCita:", error)
        return {
            success: false,
            message: error.response?.data?.message || "Error al eliminar la cita",
        }
    }
}