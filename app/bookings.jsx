import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Not logged in", "Please log in to see your bookings.");
          setLoading(false);
          return;
        }

        const q = query(collection(db, "rentals"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const rentals = [];
        querySnapshot.forEach((doc) => {
          rentals.push({ id: doc.id, ...doc.data() });
        });

        setBookings(rentals);
      } catch (error) {
        Alert.alert("Error fetching bookings", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.carName}>{item.carName}</Text>
      <Text style={styles.details}>Location: {item.location}</Text>
      <Text style={styles.details}>Seats: {item.seats}</Text>
      <Text style={styles.details}>Price: {item.price}</Text>
      <Text style={styles.details}>
        Rented At: {new Date(item.rentedAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/profile")}>
        <Ionicons name="arrow-back" size={24} color="#14b8a6" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>You have no bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#14b8a6",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
  },
  bookingCard: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#14b8a6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  carName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#eee",
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  noBookingsText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 50,
  },
});
