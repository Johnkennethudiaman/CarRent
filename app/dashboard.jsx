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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";

const carBrands = [
  { id: "1", name: "Tesla", icon: require("../assets/images/cars/tesla.png") },
  { id: "2", name: "Mazda", icon: require("../assets/images/cars/mazda.png") },
  { id: "3", name: "BMW", icon: require("../assets/images/cars/bmw.png") },
  { id: "4", name: "Ferrari", icon: require("../assets/images/cars/ferrari.png") },
];

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
          <Ionicons name="notifications-outline" size={24} color="#eee" />
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
              activeOpacity={0.8}
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
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
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
                activeOpacity={0.85}
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
        <Ionicons name="home" size={26} color="#14b8a6" />
        <Ionicons name="calendar-outline" size={26} color="#555" />
        <Ionicons name="car-outline" size={26} color="#555" />
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={26} color="#555" />
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
                  {selectedCar.location} • {selectedCar.seats} • {selectedCar.price}
                </Text>
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#444" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#14b8a6" }]}
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
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background matching signup
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  locationLabel: {
    fontSize: 12,
    color: "#888",
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eee",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileWrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  brandsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  brandItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  brandSelected: {
    backgroundColor: "#14b8a6",
    shadowColor: "#14b8a6",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  brandIcon: {
    width: 48,
    height: 48,
    marginBottom: 6,
    resizeMode: "contain",
  },
  brandName: {
    fontSize: 12,
    color: "#eee",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#eee",
  },
  viewAll: {
    fontSize: 14,
    color: "#14b8a6",
    fontWeight: "600",
  },

  carCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    marginHorizontal: 10,
    padding: 12,
    width: 180,
    shadowColor: "#14b8a6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  carImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "contain",
  },
  carName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#eee",
  },
  carLocation: {
    fontSize: 13,
    color: "#bbb",
    marginBottom: 6,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carInfo: {
    fontSize: 13,
    color: "#aaa",
  },
  noCarsText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#222",
    backgroundColor: "#121212",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
    shadowColor: "#14b8a6",
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#eee",
  },
  modalCar: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#14b8a6",
  },
  modalDetails: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
