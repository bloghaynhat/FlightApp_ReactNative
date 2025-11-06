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
      <View style={styles.formContainer}>
        <View style={styles.locationContainer}>
          {/* From Location */}
          <LocationInput
            label="POINT OF DEPARTURE"
            placeholder="FROM"
            value={fromCity}
            onSelect={onFromCityChange}
            iconName=""
          />

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapCities}>
            <Ionicons name="swap-vertical" size={22} color="#333" />
          </TouchableOpacity>

          {/* To Location */}
          <LocationInput label="ARRIVAL" placeholder="TO" value={toCity} onSelect={onToCityChange} iconName="" />
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
              <Text style={styles.passengerLabel}>PASSENGER</Text>
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
            <Ionicons name="person-outline" size={20} color="#fff" />
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
  },
  formContainer: {
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  locationContainer: {
    position: "relative",
    height: "auto",
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -24 }],
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  divider: {
    height: 0,
    marginVertical: 8,
  },
  passengerInput: {
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  passengerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passengerLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  passengerValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    minWidth: 24,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#ffc400ff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#0052a3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonDisabled: {
    backgroundColor: "rgba(200, 200, 200, 0.7)",
    borderColor: "rgba(150, 150, 150, 0.5)",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
