"use client";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { loginUser } from "../../Src/Services/AuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        Alert.alert("Exitoso", "Inicio de sesión exitoso");
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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLogin} disabled={loading} />
      <Button title="¿No tienes cuenta? Regístrate" onPress={() => navigation.navigate("Registro")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
});
