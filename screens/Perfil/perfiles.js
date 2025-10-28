// screens/Perfil/perfiles.js
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, Platform, ScrollView } from "react-native"; // Agregados: Image, Platform, ScrollView
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage directamente
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import { getUserData, logoutUser } from "../../Src/Services/AuthService";
import { useTheme } from "../../context/ThemeContext";

export default function Perfiles({ navigation }) {
  const { colors } = useTheme();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null); // Estado para la URI de la imagen

  useEffect(() => {
    cargarUsuarioYFoto(); // Llama a la función combinada 
    requestPermissions(); // Solicita permisos al montar
  }, []);

  // Función para solicitar permisos de la galería
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Necesitamos permiso para acceder a tus fotos para la foto de perfil.');
      }
    }
  };

  const cargarUsuarioYFoto = async () => {
    setCargando(true);
    let userEmail = null; // Variable para guardar el email
    try {
      // Carga datos del usuario desde AsyncStorage
      const userDataString = await AsyncStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData && userData.email) {
        setUsuario(userData);
        userEmail = userData.email; // Guarda el email
        // Carga la URI de la imagen de perfil guardada usando el email como clave
        const savedImageUri = await AsyncStorage.getItem(`profileImage_${userEmail}`);
        if (savedImageUri) {
          setProfileImageUri(savedImageUri);
        } else {
           setProfileImageUri(null); // Asegura que no haya imagen si no se encuentra
        }
      } else {
         console.warn("No se encontraron datos de usuario o email en AsyncStorage");
         setUsuario(null);
         setProfileImageUri(null);
      }

    } catch (error) {
      console.error("Error al cargar datos:", error);
       setUsuario(null);
       setProfileImageUri(null);
    } finally {
      setCargando(false);
    }
  };

  // Función para seleccionar imagen de la galería
  const handleSelectImage = async () => {
    // Asegúrate de tener datos de usuario y email antes de continuar
    if (!usuario || !usuario.email) {
        Alert.alert("Error", "No se pueden guardar cambios sin información de usuario.");
        return;
    }

    // Pide permiso si aún no se ha concedido (importante para el primer uso)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Necesitamos permiso para acceder a tus fotos.');
        return; // No continúa si no hay permiso
      }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Aspecto cuadrado
      quality: 0.5, // Calidad reducida
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImageUri(uri); // Actualiza la UI inmediatamente
      try {
        // Guarda la URI usando el email del usuario como parte de la clave
        await AsyncStorage.setItem(`profileImage_${usuario.email}`, uri);
      } catch (error) {
        console.error("Error guardando imagen en AsyncStorage:", error);
        Alert.alert("Error", "No se pudo guardar la foto de perfil.");
       
      }
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
               // Resetea estados locales después del logout exitoso
              setUsuario(null);
              setProfileImageUri(null);

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
    // ... (sin cambios)
     switch(role) {
      case 'admin': return '#e74c3c';
      case 'doctor': return '#3498db';
      case 'paciente': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getRoleIcon = (role) => {
    // ... (sin cambios)
     switch(role) {
      case 'admin': return 'shield';
      case 'doctor': return 'medical';
      case 'paciente': return 'person';
      default: return 'person';
    }
  };

  if (cargando) {
    // ... (sin cambios)
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Cargando perfil...</Text>
      </View>
    );
  }

  // Si no hay usuario después de cargar
   if (!usuario) {
       return (
            <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle-outline" size={60} color={colors.subtext} />
                <Text style={[styles.loadingText, { color: colors.subtext, marginTop: 20, textAlign: 'center' }]}>
                    No se pudieron cargar los datos del usuario. Por favor, inicia sesión de nuevo.
                </Text>
                 <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, {marginTop: 30, width: '80%', backgroundColor: colors.primary }]}>
                     <Ionicons name="log-in-outline" size={24} color="#fff" />
                     <Text style={styles.logoutText}>Ir a Inicio de Sesión</Text>
                 </TouchableOpacity>
            </View>
        );
  }


  return (
    // Usa ScrollView por si el contenido crece
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        {/* Contenedor Táctil para la imagen */}
        <TouchableOpacity onPress={handleSelectImage} style={styles.profileImageContainer}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          ) : (
            // Placeholder si no hay imagen
            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.border }]}>
              <Ionicons name="person-circle-outline" size={80} color={colors.subtext} />
            </View>
          )}
          {/* Ícono de cámara superpuesto */}
          <View style={styles.cameraIconOverlay}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Nombre y Email (se mantienen como Text por ahora) */}
        <Text style={[styles.nombre, { color: colors.text }]}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={[styles.email, { color: colors.subtext }]}>{usuario?.email || 'Sin email'}</Text>

        {/* Rol */}
        {usuario?.role && (
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(usuario.role) }]}>
            <Ionicons name={getRoleIcon(usuario.role)} size={16} color="#fff" />
            <Text style={styles.roleText}>{usuario.role.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Sección de Información (sin cambios) */}
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

      {/* Botón de Logout (sin cambios) */}
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
        <View style={{ height: 50 }} /> {/* Espacio al final */}
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }, // Añadido flex: 1
  header: { alignItems: "center", paddingVertical: 30, paddingHorizontal: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  profileImageContainer: {
    position: 'relative', // Para posicionar el ícono de cámara encima
    marginBottom: 15, // Aumentado espacio debajo de la imagen
  },
  profileImage: {
    width: 120, // Imagen más grande
    height: 120,
    borderRadius: 60, // Mitad del width/height para círculo perfecto
    borderWidth: 3, // Borde más grueso
    borderColor: '#E0E0E0', // Color de borde gris claro
  },
  profileImagePlaceholder: {
     width: 120,
     height: 120,
     borderRadius: 60,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 3,
     borderColor: '#E0E0E0',
  },
   cameraIconOverlay: {
    position: 'absolute',
    bottom: 5, // Ajusta posición vertical
    right: 5, // Ajusta posición horizontal
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente
    borderRadius: 15, // Circular
    padding: 8, // Espaciado interno
    borderWidth: 1, // Borde sutil
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  nombre: { fontSize: 26, fontWeight: "bold", marginTop: 5, textAlign: 'center' }, // Tamaño aumentado
  email: { fontSize: 17, marginTop: 5, textAlign: 'center', marginBottom: 15 }, // Tamaño aumentado
  roleBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 7, borderRadius: 20, marginTop: 10 }, // Aumentado padding
  roleText: { color: "#fff", fontSize: 13, fontWeight: "bold", marginLeft: 6 }, // Tamaño aumentado
  infoSection: { padding: 25, borderRadius: 15, marginBottom: 25, elevation: 3 }, // Aumentado padding y margen
  sectionTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 20 }, // Tamaño aumentado y margen
  infoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 }, // Aumentado padding
  infoLabel: { fontSize: 15, marginLeft: 12, width: 80, color: '#666' }, // Ancho y tamaño aumentados
  infoValue: { fontSize: 15, fontWeight: "500", flex: 1 }, // Tamaño aumentado
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#e74c3c", padding: 18, borderRadius: 12, elevation: 2, marginTop: 10 }, // Aumentado padding y margen superior
  logoutButtonDisabled: { backgroundColor: "#95a5a6", opacity: 0.7 },
  logoutText: { color: "#fff", fontSize: 17, fontWeight: "bold", marginLeft: 10 }, // Tamaño aumentado
  loadingText: { marginTop: 15, fontSize: 17, textAlign: "center" }, // Tamaño aumentado
});