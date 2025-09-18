"use client"

import { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { registerUser } from "../../Src/Services/AuthService"

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegistro = async () => {
    // Validaciones básicas
    if (!nombre.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre completo");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }
    
    if (!password.trim()) {
      Alert.alert("Error", "Por favor ingresa una contraseña");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    
    try {
      const result = await registerUser(nombre, email, password);
      
      if (result.success) {
        Alert.alert(
          "Registro Exitoso",
          result.message,
          [
            { 
              text: "OK", 
              onPress: () => {
                console.log("Registro exitoso");
                // Si el registro devuelve un token, el sistema detectará automáticamente el cambio
                // Si no, redirigir al login
                if (!result.token) {
                  navigation.navigate("Login");
                }
              } 
            }
          ]
        );
      } else {
        Alert.alert(
          "Error de Registro", 
          result.message || "Ocurrió un error durante el registro"
        );
      }
      
    } catch (error) {
      console.error("Error inesperado en registro:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nombre completo" 
        value={nombre} 
        onChangeText={setNombre}
        editable={!loading}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        secureTextEntry
      />
      
      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Registrando..." : "Registrarse"} 
          onPress={handleRegistro} 
          disabled={loading}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="¿Ya tienes cuenta? Inicia sesión" 
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 24, 
    textAlign: "center",
    color: "#2C3E50"
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    marginBottom: 12,
  }
})