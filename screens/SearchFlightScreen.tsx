import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import RoundTripForm from "../components/SearchFlight/RoundTripForm";
import OneWayForm from "../components/SearchFlight/OneWayForm";
import MultiCityForm from "../components/SearchFlight/MultiCityForm";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { Airport } from "../types";

const FlightSearchScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"round" | "oneway" | "multi">("round");

  // Shared state across all forms
  const [sharedFromCity, setSharedFromCity] = useState<Airport | null>(null);
  const [sharedToCity, setSharedToCity] = useState<Airport | null>(null);
  const [sharedDepartDate, setSharedDepartDate] = useState<Date | null>(null);
  const [sharedReturnDate, setSharedReturnDate] = useState<Date | null>(null);
  const [sharedPassengers, setSharedPassengers] = useState<number>(1);

  const renderTab = () => {
    switch (activeTab) {
      case "round":
        return (
          <RoundTripForm
            fromCity={sharedFromCity}
            toCity={sharedToCity}
            departDate={sharedDepartDate}
            returnDate={sharedReturnDate}
            passengers={sharedPassengers}
            onFromCityChange={setSharedFromCity}
            onToCityChange={setSharedToCity}
            onDepartDateChange={setSharedDepartDate}
            onReturnDateChange={setSharedReturnDate}
            onPassengersChange={setSharedPassengers}
          />
        );
      case "oneway":
        return (
          <OneWayForm
            fromCity={sharedFromCity}
            toCity={sharedToCity}
            departDate={sharedDepartDate}
            passengers={sharedPassengers}
            onFromCityChange={setSharedFromCity}
            onToCityChange={setSharedToCity}
            onDepartDateChange={setSharedDepartDate}
            onPassengersChange={setSharedPassengers}
          />
        );
      case "multi":
        return <MultiCityForm />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "round" && styles.activeTab]}
          onPress={() => setActiveTab("round")}
        >
          <Text style={[styles.tabText, activeTab === "round" && styles.activeTabText]}>Round-trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "oneway" && styles.activeTab]}
          onPress={() => setActiveTab("oneway")}
        >
          <Text style={[styles.tabText, activeTab === "oneway" && styles.activeTabText]}>One-way</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "multi" && styles.activeTab]}
          onPress={() => setActiveTab("multi")}
        >
          <Text style={[styles.tabText, activeTab === "multi" && styles.activeTabText]}>Multi-city</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>{renderTab()}</ScrollView>
    </View>
  );
};

export default FlightSearchScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 28,
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: { borderColor: "#00AEEF" },
  tabText: { color: "#777", fontWeight: "500" },
  activeTabText: { color: "#00AEEF", fontWeight: "600" },
  content: { marginTop: 10 },
});
