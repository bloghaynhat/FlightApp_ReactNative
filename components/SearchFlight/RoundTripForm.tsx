import React from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import type { Airport } from "../../types/City";
import { LocationInput } from "./LocationInput";
import DateRangePicker from "./DateRangePicker";
import Ionicons from "react-native-vector-icons/Ionicons";

const RoundTripForm = () => {
  const [fromCity, setFromCity] = useState<Airport | null>(null);
  const [toCity, setToCity] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState<number>(1);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = () => {
    if (fromCity && toCity && departDate) {
      console.log({
        from: fromCity,
        to: toCity,
        departDate,
        returnDate,
        passengers,
      });
      // Navigate to search results or perform search
    }
  };

  const isFormValid = fromCity && toCity && departDate;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tìm chuyến bay</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.locationContainer}>
          {/* From Location */}
          <LocationInput
            label="Từ"
            placeholder="Chọn thành phố khởi hành"
            value={fromCity}
            onSelect={setFromCity}
            iconName=""
          />

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapCities}>
            <Ionicons name="swap-vertical" size={22} color="#333" />
          </TouchableOpacity>

          {/* To Location */}
          <LocationInput label="Đến" placeholder="Chọn thành phố đến" value={toCity} onSelect={setToCity} iconName="" />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <DateRangePicker
          startDate={departDate}
          endDate={returnDate}
          onSelect={(start, end) => {
            setDepartDate(start);
            setReturnDate(end);
          }}
          mode="range"
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Passenger Input */}
        <TouchableOpacity style={styles.passengerInput}>
          <View style={styles.passengerContent}>
            <View>
              <Text style={styles.passengerLabel}>Số hành khách</Text>
              <View style={styles.passengerCounter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setPassengers(Math.max(1, passengers - 1))}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.passengerValue}>{passengers}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setPassengers(Math.min(9, passengers + 1))}
                >
                  <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
            <Ionicons name="person-outline" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchButton, !isFormValid && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!isFormValid}
        >
          <Text style={styles.searchButtonText}>Tìm chuyến bay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationContainer: {
    position: "relative",
    height: "auto",
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -22 }], // -1/2 chiều cao của nút
    zIndex: 10, // ✅ nổi lên trên các phần tử khác
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  passengerInput: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  passengerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passengerLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  passengerCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passengerValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    minWidth: 24,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RoundTripForm;
