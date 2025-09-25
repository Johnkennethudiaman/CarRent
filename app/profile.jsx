import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../src/firebaseConfig";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

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
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#eee" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={require("../assets/images/profile.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || "CarRent User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/editProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Navigate to Bookings screen */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/bookings")}
        >
          <Text style={styles.buttonText}>My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logout]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  backText: {
    color: "#eee",
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#eee",
  },
  email: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  actions: {
    gap: 14,
  },
  button: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#eee",
    fontWeight: "500",
  },
  logout: {
    backgroundColor: "#e76f51",
  },
});
