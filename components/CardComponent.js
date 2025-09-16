import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CardComponent({ title, subtitle, icon, value, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={32} color="#007AFF" />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
    </TouchableOpacity>
  )
} 

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: 'relative',
    minHeight: 140,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statusIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});