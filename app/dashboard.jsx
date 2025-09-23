import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";

// Car Brands
const carBrands = [
  { id: "1", name: "Tesla", icon: require("../assets/images/cars/tesla.png") },
  { id: "2", name: "Mazda", icon: require("../assets/images/cars/mazda.png") },
  { id: "3", name: "BMW", icon: require("../assets/images/cars/bmw.png") },
  { id: "4", name: "Ferrari", icon: require("../assets/images/cars/ferrari.png") },
];

// All Cars
const allCars = [
  {
    id: "1",
    brand: "Tesla",
    name: "Tesla Model X",
    image: require("../assets/images/cars/tesla.png"),
    location: "Ranjang, Wangon",
    seats: "4 seats",
    price: "$30/hour",
  },
  {
    id: "2",
    brand: "Tesla",
    name: "Tesla Model 3",
    image: require("../assets/images/cars/tesla.png"),
    location: "Ranjang, Wangon",
    seats: "4 seats",
    price: "$28/hour",
  },
  {
    id: "3",
    brand: "Mazda",
    name: "Mazda CX-5",
    image: require("../assets/images/cars/mazda.png"),
    location: "Colomadu, Surakarta",
    seats: "5 seats",
    price: "$25/hour",
  },
  {
    id: "4",
    brand: "BMW",
    name: "BMW X5",
    image: require("../assets/images/cars/bmw.png"),
    location: "Colomadu, Surakarta",
    seats: "5 seats",
    price: "$40/hour",
  },
  {
    id: "5",
    brand: "Ferrari",
    name: "Ferrari 488",
    image: require("../assets/images/cars/ferrari.png"),
    location: "Colomadu, Surakarta",
    seats: "2 seats",
    price: "$100/hour",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Filter cars by brand
  const filteredCars = selectedBrand
    ? allCars.filter((car) => car.brand === selectedBrand)
    : allCars;

  const openRentModal = (car) => {
    setSelectedCar(car);
    setModalVisible(true);
  };

  const confirmRent = async () => {
    if (!selectedCar) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to rent a car");
        return;
      }

      await addDoc(collection(db, "rentals"), {
        userId: user.uid,
        carName: selectedCar.name,
        price: selectedCar.price,
        location: selectedCar.location,
        seats: selectedCar.seats,
        rentedAt: new Date().toISOString(),
      });

      Alert.alert("Success 🚗", `${selectedCar.name} has been rented!`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.location}>Colomadu, Surakarta</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <TouchableOpacity
            style={styles.profileWrapper}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={require("../assets/images/profile.jpg")}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Car Brands */}
        <View style={styles.brandsWrapper}>
          {carBrands.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={[
                styles.brandItem,
                selectedBrand === brand.name && styles.brandSelected,
              ]}
              onPress={() =>
                setSelectedBrand(
                  selectedBrand === brand.name ? null : brand.name
                )
              }
            >
              <Image source={brand.icon} style={styles.brandIcon} />
              <Text style={styles.brandName}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cars List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedBrand ? `${selectedBrand} Cars` : "Best Cars"}
          </Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {filteredCars.length > 0 ? (
          <FlatList
            data={filteredCars}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.carCard}
                onPress={() => openRentModal(item)}
              >
                <Image source={item.image} style={styles.carImage} />
                <Text style={styles.carName}>{item.name}</Text>
                <Text style={styles.carLocation}>{item.location}</Text>
                <View style={styles.carDetails}>
                  <Text style={styles.carInfo}>{item.seats}</Text>
                  <Text style={styles.carInfo}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noCarsText}>No cars available</Text>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={26} color="#000" />
        <Ionicons name="calendar-outline" size={26} color="#999" />
        <Ionicons name="car-outline" size={26} color="#999" />
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={26} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Rent Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rent this car?</Text>
            {selectedCar && (
              <>
                <Text style={styles.modalCar}>{selectedCar.name}</Text>
                <Text style={styles.modalDetails}>
                  {selectedCar.location} • {selectedCar.seats} •{" "}
                  {selectedCar.price}
                </Text>
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#28a745" }]}
                onPress={confirmRent}
              >
                <Text style={styles.modalButtonText}>Rent</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  locationLabel: { fontSize: 12, color: "#888" },
  location: { fontSize: 16, fontWeight: "600", color: "#000" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileWrapper: { borderRadius: 20, overflow: "hidden" },
  profile: { width: 32, height: 32, borderRadius: 16 },

  brandsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  brandItem: { alignItems: "center", padding: 6, borderRadius: 8 },
  brandSelected: { backgroundColor: "#f0f0f0" },
  brandIcon: { width: 48, height: 48, marginBottom: 4, resizeMode: "contain" },
  brandName: { fontSize: 12, color: "#333" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  viewAll: { fontSize: 12, color: "#007AFF" },

  carCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 10,
    padding: 12,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  carImage: { width: "100%", height: 100, borderRadius: 12, marginBottom: 8 },
  carName: { fontSize: 14, fontWeight: "600", color: "#000" },
  carLocation: { fontSize: 12, color: "#777", marginBottom: 6 },
  carDetails: { flexDirection: "row", justifyContent: "space-between" },
  carInfo: { fontSize: 12, color: "#444" },
  noCarsText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 14,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalCar: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  modalDetails: { fontSize: 14, color: "#555", marginBottom: 16 },
  modalActions: { flexDirection: "row", gap: 12 },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: { color: "#fff", fontWeight: "600" },
});
