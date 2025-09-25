import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match ❌");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully 🎉");
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/car-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Blur and animated form */}
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
          <Animated.View
            entering={FadeInUp.duration(700)}
            exiting={FadeOutDown.duration(500)}
            style={styles.card}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join CarRent and book your ride today 🚗
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#bbb"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#bbb"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 30,
    zIndex: 10,
  },
  blurContainer: {
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "rgba(38, 70, 83, 0.85)",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#e76f51",
    paddingVertical: 16,
    paddingHorizontal: 55,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#e76f51",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 15,
    color: "#f4a261",
    textAlign: "center",
    fontWeight: "600",
  },
});
