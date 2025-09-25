import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./Conexion";

// Variable para prevenir múltiples logouts simultáneos
let isLoggingOut = false;

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data?.token || response.data;
    const user = response.data?.user || {};

    console.log("Respuesta del servidor:", response.data);

    if (token) {
      await AsyncStorage.setItem("userToken", token);
      console.log("Token actualizado:", token);
      // Guardar información del usuario - usando 'role' en lugar de 'rol'
      await AsyncStorage.setItem("userData", JSON.stringify({
        nombre: user.nombre || user.name,
        email: user.email,
        role: user.role || 'paciente' // Cambiado a 'role'
      }));
      return { success: true, token, user };
    } else {
      return { success: false, message: "El servidor no devolvió token" };
    }
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data?.message || JSON.stringify(error.response.data) };
    } else if (error.request) {
      return { success: false, message: "El servidor no responde" };
    } else {
      return { success: false, message: error.message };
    }
  }
};

export const registerUser = async (nombre, email, password, role = 'paciente') => { // Cambiado a 'role'
  try {
    const response = await api.post("/registro", { 
      name: nombre, 
      email, 
      password, 
      role // Cambiado a 'role'
    });
    console.log("Respuesta del registro:", response.data);

    if (response.data.token) {
      await AsyncStorage.setItem("userToken", response.data.token);
      // Guardar información del usuario - usando 'role'
      await AsyncStorage.setItem("userData", JSON.stringify({
        nombre: nombre,
        email: email,
        role: role // Cambiado a 'role'
      }));
      return { success: true, token: response.data.token, message: "Registro exitoso" };
    } else {
      return { success: true, message: "Registro exitoso. Por favor inicia sesión." };
    }
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data?.message || JSON.stringify(error.response.data) };
    } else if (error.request) {
      return { success: false, message: "El servidor no responde" };
    } else {
      return { success: false, message: error.message };
    }
  }
};

export const logoutUser = async () => {
  // Prevenir múltiples llamadas simultáneas
  if (isLoggingOut) {
    console.log("⚠️ Logout ya está en proceso, ignorando nueva solicitud");
    return { success: true, message: "Logout ya en proceso" };
  }

  isLoggingOut = true;

  try {
    console.log("🔄 Iniciando proceso de logout...");
    
    // Intentar hacer logout en el servidor
    try {
      await api.post("/logout");
      console.log("✅ Logout exitoso en servidor");
    } catch (error) {
      console.log("⚠️ Error al hacer logout en servidor:", error.message);
      // Continuamos con el logout local aunque falle el servidor
    }

    // Limpiar datos locales
    await AsyncStorage.multiRemove(["userToken", "userData"]);
    console.log("✅ Datos locales eliminados");

    return { success: true, message: "Sesión cerrada exitosamente" };
  } catch (error) {
    console.error("❌ Error en logout:", error);
    return { success: false, message: "Error al cerrar sesión" };
  } finally {
    // Siempre resetear el flag, incluso si hay error
    setTimeout(() => {
      isLoggingOut = false;
      console.log("🔓 Flag de logout reseteado");
    }, 1000); // Esperar 1 segundo antes de permitir otro logout
  }
};

export const checkAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    return token !== null;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
};