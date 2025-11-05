import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { Airport } from "../../types";
import { LocationInput } from "./LocationInput";
import DateRangePicker from "./DateRangePicker";
import Ionicons from "react-native-vector-icons/Ionicons";

interface OneWayFormProps {
  fromCity: Airport | null;
  toCity: Airport | null;
  departDate: Date | null;
  passengers: number;
  onFromCityChange: (city: Airport | null) => void;
  onToCityChange: (city: Airport | null) => void;
  onDepartDateChange: (date: Date | null) => void;
  onPassengersChange: (count: number) => void;
}

const OneWayForm: React.FC<OneWayFormProps> = ({
  fromCity,
  toCity,
  departDate,
  passengers,
  onFromCityChange,
  onToCityChange,
  onDepartDateChange,
  onPassengersChange,
}) => {
  const navigation = useNavigation<any>();

  const handleSwapCities = () => {
    const temp = fromCity;
    onFromCityChange(toCity);
    onToCityChange(temp);
  };

  const handleSearch = () => {
    if (fromCity && toCity && departDate) {
      // Navigate to search results
      navigation.navigate("SearchResult", {
        fromAirportId: fromCity.id,
        toAirportId: toCity.id,
        departDate: departDate.toISOString().split("T")[0],
        passengers,
        tripType: "oneWay",
      });
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
            onSelect={onFromCityChange}
            iconName=""
          />

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapCities}>
            <Ionicons name="swap-vertical" size={22} color="#333" />
          </TouchableOpacity>

          {/* To Location */}
          <LocationInput
            label="Đến"
            placeholder="Chọn thành phố đến"
            value={toCity}
            onSelect={onToCityChange}
            iconName=""
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <DateRangePicker
          startDate={departDate}
          endDate={null}
          onSelect={(start) => {
            onDepartDateChange(start);
          }}
          mode="single"
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
                  onPress={() => onPassengersChange(Math.max(1, passengers - 1))}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.passengerValue}>{passengers}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => onPassengersChange(Math.min(9, passengers + 1))}
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

export default OneWayForm;

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
    transform: [{ translateY: -22 }],
    zIndex: 10,
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
