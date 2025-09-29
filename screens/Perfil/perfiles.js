// screens/Perfil/perfiles.js
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { getUserData, logoutUser } from "../../Src/Services/AuthService";
import { useTheme } from "../../context/ThemeContext";

export default function Perfiles({ navigation }) {
  const { colors } = useTheme(); // Obtenemos el estado y los colores del hook
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const userData = await getUserData();
      setUsuario(userData);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            if (loggingOut) return;
            setLoggingOut(true);
            try {
              await logoutUser();
            } catch (error) {
              Alert.alert("Error", "Error inesperado al cerrar sesión");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#e74c3c';
      case 'doctor': return '#3498db';
      case 'paciente': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return 'shield';
      case 'doctor': return 'medical';
      case 'paciente': return 'person';
      default: return 'person';
    }
  };
  
  if (cargando) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Ionicons name="person-circle" size={80} color={colors.text} />
        <Text style={[styles.nombre, { color: colors.text }]}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={[styles.email, { color: colors.subtext }]}>{usuario?.email || 'Sin email'}</Text>
        
        {usuario?.role && (
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(usuario.role) }]}>
            <Ionicons name={getRoleIcon(usuario.role)} size={16} color="#fff" />
            <Text style={styles.roleText}>{usuario.role.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información de la cuenta</Text>
        
        <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.subtext} />
          <Text style={[styles.infoLabel, { color: colors.subtext }]}>Nombre:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{usuario?.nombre || 'No especificado'}</Text>
        </View>

        <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={colors.subtext} />
          <Text style={[styles.infoLabel, { color: colors.subtext }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{usuario?.email || 'No especificado'}</Text>
        </View>

        <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
          <Ionicons name="key-outline" size={20} color={colors.subtext} />
          <Text style={[styles.infoLabel, { color: colors.subtext }]}>Rol:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{usuario?.role || 'paciente'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.logoutText}>Cerrando sesión...</Text>
          </>
        ) : (
          <>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", padding: 30, borderRadius: 15, marginBottom: 20, elevation: 3 },
  nombre: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 16, marginTop: 5 },
  roleBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  roleText: { color: "#fff", fontSize: 12, fontWeight: "bold", marginLeft: 5 },
  infoSection: { padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  infoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1 },
  infoLabel: { fontSize: 14, marginLeft: 10, width: 60 },
  infoValue: { fontSize: 14, fontWeight: "500", flex: 1 },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#e74c3c", padding: 16, borderRadius: 12, elevation: 2 },
  logoutButtonDisabled: { backgroundColor: "#95a5a6", opacity: 0.7 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  loadingText: { marginTop: 10, fontSize: 16, textAlign: "center" },
});