"use client"

import { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { registerUser } from "../../Src/Services/AuthService"

const roles = [
  { id: 'paciente', nombre: 'Paciente', descripcion: 'Acceso para agendar citas y ver historial médico', icon: 'person' },
  { id: 'doctor', nombre: 'Doctor', descripcion: 'Acceso completo para gestionar pacientes y consultas', icon: 'medical' },
  { id: 'admin', nombre: 'Administrador', descripcion: 'Acceso total al sistema y gestión de usuarios', icon: 'shield' }
]

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState('paciente')
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

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
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
      // Cambiado a 'role' para coincidir con la base de datos
      const result = await registerUser(nombre, email, password, selectedRole);
      
      if (result.success) {
        Alert.alert(
          "Registro Exitoso",
          `Te has registrado como ${roles.find(r => r.id === selectedRole)?.nombre}. ${result.message}`,
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

  const getRoleColor = (roleId) => {
    switch(roleId) {
      case 'admin': return '#e74c3c'
      case 'doctor': return '#3498db'
      case 'paciente': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-add-outline" size={60} color="#2C3E50" />
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a nuestro sistema de Eps</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu nombre completo" 
              value={nombre} 
              onChangeText={setNombre}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>
        </View>
        
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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Usuario</Text>
          <Text style={styles.roleDescription}>
            Selecciona tu rol en el sistema médico
          </Text>
          
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleOption,
                selectedRole === role.id && [
                  styles.roleOptionSelected,
                  { borderColor: getRoleColor(role.id) }
                ]
              ]}
              onPress={() => setSelectedRole(role.id)}
              disabled={loading}
            >
              <View style={styles.roleHeader}>
                <View style={[
                  styles.roleIconContainer,
                  { backgroundColor: selectedRole === role.id ? getRoleColor(role.id) : '#ecf0f1' }
                ]}>
                  <Ionicons 
                    name={role.icon} 
                    size={24} 
                    color={selectedRole === role.id ? '#fff' : '#7f8c8d'} 
                  />
                </View>
                <View style={styles.roleInfo}>
                  <Text style={[
                    styles.roleName,
                    selectedRole === role.id && { color: getRoleColor(role.id) }
                  ]}>
                    {role.nombre}
                  </Text>
                  <Text style={styles.roleDesc}>{role.descripcion}</Text>
                </View>
                {selectedRole === role.id && (
                  <Ionicons name="checkmark-circle" size={24} color={getRoleColor(role.id)} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.registerButton,
              { backgroundColor: getRoleColor(selectedRole) },
              loading && styles.buttonDisabled
            ]}
            onPress={handleRegistro} 
            disabled={loading}
          >
            <Ionicons name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.registerButtonText}>
              {loading ? "Registrando..." : `Registrarse como ${roles.find(r => r.id === selectedRole)?.nombre}`}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity 
  onPress={() => navigation.navigate("Login")}
  disabled={loading}
>
  <Text style={styles.loginLink}>Inicia sesión</Text>
</TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
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
  input: { 
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
  },
  roleDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
  },
  roleOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ecf0f1",
    elevation: 2,
  },
  roleOptionSelected: {
    borderWidth: 2,
    backgroundColor: "#f8f9fa",
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  roleDesc: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  loginLink: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
})