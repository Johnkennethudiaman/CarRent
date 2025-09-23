import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../src/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/profile.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || "CarRent User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: "600", color: "#222" },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  actions: { gap: 14 },
  button: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, color: "#222", fontWeight: "500" },
  logout: { backgroundColor: "#e76f51" },
});
