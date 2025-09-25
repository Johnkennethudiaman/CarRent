import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/car-bg.jpg")} // put your car image here
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay to improve text visibility */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Animated.View entering={FadeInUp.duration(700)} style={styles.content}>
          <Text style={styles.title}>Get Started with CarRent</Text>
          <Text style={styles.subtitle}>Rent your perfect ride in just a few taps.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // dark overlay for contrast
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
