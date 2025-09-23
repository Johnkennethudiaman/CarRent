import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "rentals"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      setBookings(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.carName}>{item.carName}</Text>
            <Text>{item.location}</Text>
            <Text>{item.price}</Text>
            <Text style={styles.date}>{new Date(item.rentedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  carName: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 12, color: "#666", marginTop: 6 },
});
