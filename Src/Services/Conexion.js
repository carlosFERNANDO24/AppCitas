import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.1.15:8000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

const RutasPublicas = ["/login", "/registro"]

api.interceptors.request.use(
  async (config) => {
    const EsRutaPublica = RutasPublicas.some((ruta) => config.url.includes(ruta))
    if (!EsRutaPublica) {
      const userToken = await AsyncStorage.getItem("userToken")
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`
      }
    }
    console.log(`📤 Petición ${config.method.toUpperCase()} a ${config.url}`, config.data)
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta de ${response.config.url}:`, response.status)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const IsRutaPublica = RutasPublicas.some((ruta) => originalRequest?.url?.includes(ruta))

    console.error(
      ` Error en petición a ${originalRequest?.url || "desconocida"}:`,
      error.response?.status || "sin status",
      error.response?.data || error.message || "sin detalles",
    )

    if (error.response && error.response.status === 401 && !originalRequest._retry && !IsRutaPublica) {
      originalRequest._retry = true
      await AsyncStorage.removeItem("userToken")
      console.log(" Token inválido o expirado eliminado.")
    }
    return Promise.reject(error)
  },
)

export default api
