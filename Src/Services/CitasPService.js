// Src/Services/CitasPService.js
import api from "./Conexion"

// 🔹 PACIENTE: Solo puede ver SUS citas
export const getMisCitas = async () => {
  try {
    console.log("🔄 Solicitando mis citas (Paciente)...")
    const response = await api.get("/MisCitas")
    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error en getMisCitas:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al obtener mis citas",
      data: [],
    }
  }
}

// 🔹 PACIENTE: Puede crear SU propia cita
export const crearMiCita = async (citaData) => {
  try {
    console.log("🔄 Creando mi cita (Paciente)...", citaData)
    // El paciente_id se asigna en el backend a partir del token de usuario.
    const response = await api.post("/CrearCitas", citaData) 
    return {
      success: true,
      data: response.data,
      message: "Cita creada exitosamente",
    }
  } catch (error) {
    console.error("❌ Error creando mi cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al crear la cita",
      errors: error.response?.data?.errors || {},
    }
  }
}

// 🔹 PACIENTE: Puede ver el detalle de SU cita
export const getMiCita = async (id) => {
  try {
    console.log(`🔄 Obteniendo mi cita ID: ${id}...`)
    // El backend debe validar que la cita pertenezca al paciente autenticado
    const response = await api.get(`/MostrarCitas/${id}`) 
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo mi cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Cita no encontrada o acceso denegado",
    }
  }
}