// Src/Services/CitaService.js - Servicio corregido para todos los roles
import api from "./Conexion"

// 🔹 ADMIN y DOCTOR: Pueden acceder a TODAS las citas
export const getCitas = async () => {
  try {
    console.log("🔄 Solicitando todas las citas (Admin/Doctor)...")

    const response = await api.get("/ListarCitas")
    console.log("📡 Respuesta del servidor:", response.status)
    console.log("📊 Datos recibidos:", response.data)

    return {
      success: true,
      data: response.data || [],
    }
  } catch (error) {
    console.error("❌ Error en getCitas:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al obtener citas",
      data: [],
    }
  }
}

// 🔹 PACIENTE: Solo puede ver SUS citas
export const getMisCitas = async () => {
  try {
    let userRole = null
    let userType = null
    let isAdmin = false
    let isDoctor = false

    try {
      // Import AsyncStorage dynamically for React Native
      const AsyncStorage = require("@react-native-async-storage/async-storage").default

      // Wait for all storage reads to complete before proceeding
      const [roleValue, typeValue, adminValue, doctorValue] = await Promise.all([
        AsyncStorage.getItem("userRole"),
        AsyncStorage.getItem("userType"),
        AsyncStorage.getItem("isAdmin"),
        AsyncStorage.getItem("isDoctor"),
      ])

      userRole = roleValue
      userType = typeValue
      isAdmin = adminValue === "true"
      isDoctor = doctorValue === "true"

      console.log(
        "[v0] getMisCitas role check - userRole:",
        userRole,
        "userType:",
        userType,
        "isAdmin:",
        isAdmin,
        "isDoctor:",
        isDoctor,
      )

      // STRICT validation - if ANY indication of admin/doctor, redirect immediately
      if (
        userRole === "admin" ||
        userRole === "doctor" ||
        userType === "admin" ||
        userType === "doctor" ||
        isAdmin ||
        isDoctor
      ) {
        console.log("🔄 Admin/Doctor detected in getMisCitas - redirecting to getCitas")
        return await getCitas()
      }

      // Additional safety check - if no clear patient indication, default to getCitas
      if (!userRole && !userType) {
        console.log("🔄 No role information found - defaulting to getCitas for safety")
        return await getCitas()
      }
    } catch (storageError) {
      // Fallback to localStorage for web environments
      if (typeof window !== "undefined" && window.localStorage) {
        userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole")
        userType = localStorage.getItem("userType") || sessionStorage.getItem("userType")
        isAdmin = localStorage.getItem("isAdmin") === "true" || sessionStorage.getItem("isAdmin") === "true"
        isDoctor = localStorage.getItem("isDoctor") === "true" || sessionStorage.getItem("isDoctor") === "true"

        console.log(
          "[v0] getMisCitas localStorage check - userRole:",
          userRole,
          "userType:",
          userType,
          "isAdmin:",
          isAdmin,
          "isDoctor:",
          isDoctor,
        )

        if (
          userRole === "admin" ||
          userRole === "doctor" ||
          userType === "admin" ||
          userType === "doctor" ||
          isAdmin ||
          isDoctor
        ) {
          console.log("🔄 Admin/Doctor detected in getMisCitas (localStorage) - redirecting to getCitas")
          return await getCitas()
        }
      } else {
        console.log("🔄 No storage available - defaulting to getCitas for safety")
        return await getCitas()
      }
    }

    // Only proceed with /MisCitas if we're absolutely sure it's a patient
    if (userRole === "paciente" || userType === "paciente") {
      console.log("🔄 Confirmed patient role - proceeding with getMisCitas")
      const response = await api.get("/MisCitas")

      return {
        success: true,
        data: response.data || [],
      }
    } else {
      // If we reach here, we're not sure about the role - default to getCitas
      console.log("🔄 Uncertain role - defaulting to getCitas for safety")
      return await getCitas()
    }
  } catch (error) {
    console.error("❌ Error en getMisCitas:", error)

    if (error.response?.status === 403) {
      console.log("🔄 Error 403 detected - redirecting to getCitas")
      return await getCitas()
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al obtener mis citas",
      data: [],
    }
  }
}

// 🔹 CREAR CITA: Todos los roles pueden crear
export const crearCita = async (citaData) => {
  try {
    console.log("🔄 Creando nueva cita:", citaData)

    const response = await api.post("/CrearCitas", citaData)
    console.log("📡 Respuesta crear cita:", response.data)

    return {
      success: true,
      data: response.data,
      message: "Cita creada exitosamente",
    }
  } catch (error) {
    console.error("❌ Error creando cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al crear la cita",
      errors: error.response?.data?.errors || {},
    }
  }
}

// 🔹 OBTENER UNA CITA: Admin y Doctor pueden ver cualquiera
export const getCita = async (id) => {
  try {
    console.log(`🔄 Obteniendo cita ID: ${id}...`)

    const response = await api.get(`/MostrarCitas/${id}`)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Cita no encontrada",
    }
  }
}

// 🔹 ACTUALIZAR CITA: Solo Admin y Doctor
export const actualizarCita = async (id, citaData) => {
  try {
    console.log(`🔄 Actualizando cita ID: ${id}...`, citaData)

    const response = await api.put(`/ActualizarCitas/${id}`, citaData)

    return {
      success: true,
      data: response.data,
      message: "Cita actualizada exitosamente",
    }
  } catch (error) {
    console.error("❌ Error actualizando cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al actualizar la cita",
      errors: error.response?.data?.errors || {},
    }
  }
}

// 🔹 ELIMINAR CITA: Solo Admin y Doctor
export const eliminarCita = async (id) => {
  try {
    console.log(`🔄 Eliminando cita ID: ${id}...`)

    const response = await api.delete(`/EliminarCitas/${id}`)

    return {
      success: true,
      message: response.data?.message || "Cita eliminada exitosamente",
    }
  } catch (error) {
    console.error("❌ Error eliminando cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al eliminar la cita",
    }
  }
}

// 🔹 OBTENER HISTORIAL POR CITA: Admin y Doctor
export const getHistorialPorCita = async (citaId) => {
  try {
    console.log(`🔄 Obteniendo historial para cita ID: ${citaId}...`)

    const response = await api.get(`/citas/${citaId}/historial`)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("❌ Error obteniendo historial por cita:", error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al obtener historial de la cita",
    }
  }
}

export const createCita = crearCita
export const updateCita = actualizarCita
export const deleteCita = eliminarCita
