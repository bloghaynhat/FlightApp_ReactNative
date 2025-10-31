import React from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import type { City } from "../../types/City";
import { LocationInput } from "./LocationInput";
import DateRangePicker from "./DateRangePicker";

const RoundTripForm = () => {
  const [fromCity, setFromCity] = useState<City | null>(null);
  const [toCity, setToCity] = useState<City | null>(null);
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

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
        {/* From Location */}
        <LocationInput label="Từ" placeholder="Chọn thành phố khởi hành" value={fromCity} onSelect={setFromCity} />

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={handleSwapCities}>
          <Text style={styles.swapIcon}>⇄</Text>
        </TouchableOpacity>

        {/* To Location */}
        <LocationInput label="Đến" placeholder="Chọn thành phố đến" value={toCity} onSelect={setToCity} />

        {/* Divider */}
        <View style={styles.divider} />

        <DateRangePicker
          startDate={departDate}
          endDate={returnDate}
          onSelect={(start, end) => {
            setDepartDate(start);
            setReturnDate(end);
          }}
        />

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
  swapButton: {
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  swapIcon: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
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
