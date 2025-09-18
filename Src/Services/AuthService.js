import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./Conexion";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data?.token || response.data;

    console.log("Respuesta del servidor:", response.data);

    if (token) {
      await AsyncStorage.setItem("userToken", token);
      return { success: true, token };
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

export const registerUser = async (nombre, email, password) => {
  try {
    const response = await api.post("/registro", { name: nombre, email, password });
    console.log("Respuesta del registro:", response.data);

    if (response.data.token) {
      await AsyncStorage.setItem("userToken", response.data.token);
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
  try {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("⚠️ Error al hacer logout en servidor:", error.message);
    }

    await AsyncStorage.removeItem("userToken");
    console.log("✅ Sesión cerrada exitosamente");

    return { success: true, message: "Sesión cerrada exitosamente" };
  } catch (error) {
    return { success: false, message: "Error al cerrar sesión" };
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
