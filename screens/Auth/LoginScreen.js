"use client";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../Src/Services/AuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        Alert.alert("Éxito", "Inicio de sesión exitoso");
      } else {
        Alert.alert("Error de login", result.message || "Ocurrió un error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error inesperado en login:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="log-in-outline" size={60} color="#2C3E50" />
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"  
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#7f8c8d" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin} 
            disabled={loading}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.loginButtonText}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Registro")}
            disabled={loading}
          >
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginTop: 16,
    color: "#2C3E50"
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 8,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eyeIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  input: { 
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 18,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  registerText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  registerLink: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
});