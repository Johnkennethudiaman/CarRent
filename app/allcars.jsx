import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

const allCars = [
  {
    id: "1",
    name: "Tesla Model X",
    image: require("../assets/images/cars/tesla.png"),
    location: "Ranjang, Wangon",
    seats: "4 seats",
    price: "$30/hour",
  },
  {
    id: "2",
    name: "Mazda CX-5",
    image: require("../assets/images/cars/mazda.png"),
    location: "Jakarta",
    seats: "5 seats",
    price: "$25/hour",
  },
  {
    id: "3",
    name: "BMW X5",
    image: require("../assets/images/cars/bmw.png"),
    location: "Bandung",
    seats: "5 seats",
    price: "$40/hour",
  },
];

export default function AllCarsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Cars</Text>
      <FlatList
        data={allCars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.carName}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>{item.seats}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
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
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  image: { width: 80, height: 50, marginRight: 12, resizeMode: "contain" },
  carName: { fontSize: 16, fontWeight: "600" },
  price: { fontWeight: "700", marginTop: 4 },
});
