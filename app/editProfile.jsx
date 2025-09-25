import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { auth } from "../src/firebaseConfig";
import { updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Invalid Name", "Display name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      Alert.alert("Success", "Profile updated successfully!");
      router.back(); // navigate back to profile
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Display Section */}
      <View style={styles.profileDisplay}>
        <Image
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require("../assets/images/profile.jpg")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || "CarRent User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Edit Display Name Input */}
      <Text style={styles.label}>Edit Display Name</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        placeholder="Enter new display name"
        placeholderTextColor="#666"
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: "#e76f51" }]}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
  },
  profileDisplay: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
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
  label: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#1f1f1f",
    padding: 14,
    borderRadius: 12,
    color: "#eee",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#14b8a6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#e76f51",
  },
});
