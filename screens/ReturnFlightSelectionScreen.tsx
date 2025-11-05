import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { flightService, FlightResult } from "../apis/flightService";
import { airportService } from "../apis/airportService";
import { FlightCard } from "../components/SearchResult/FlightCard";
import { LoadingState } from "../components/SearchResult/LoadingState";
import { EmptyState } from "../components/SearchResult/EmptyState";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { Airport } from "../types";

type RootStackParamList = {
  ReturnFlightSelection: {
    outboundFlight: FlightResult;
    fromAirportId: string;
    toAirportId: string;
    departDate: string;
    returnDate: string;
    passengers: number;
    tripType: "roundTrip";
  };
};

type ReturnFlightSelectionRouteProp = RouteProp<RootStackParamList, "ReturnFlightSelection">;
type ReturnFlightSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, "ReturnFlightSelection">;

const ReturnFlightSelectionScreen: React.FC = () => {
  const route = useRoute<ReturnFlightSelectionRouteProp>();
  const navigation = useNavigation<ReturnFlightSelectionNavigationProp>();
  const { outboundFlight, fromAirportId, toAirportId, departDate, returnDate, passengers, tripType } = route.params;

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load airports và return flights
      // Note: For return flight, we swap from/to airports
      const [fromAirportData, toAirportData, flightsData] = await Promise.all([
        airportService.getAirportById(toAirportId), // Swap: toAirport becomes fromAirport for return
        airportService.getAirportById(fromAirportId), // Swap: fromAirport becomes toAirport for return
        flightService.searchFlights({
          fromAirportId: toAirportId, // Swap
          toAirportId: fromAirportId, // Swap
          departureDate: returnDate,
          passengers,
        }),
      ]);

      setFromAirport(fromAirportData);
      setToAirport(toAirportData);
      setFlights(flightsData);
    } catch (err) {
      console.error("Error loading return flights:", err);
      setError("Không thể tải danh sách chuyến bay chiều về");
    } finally {
      setLoading(false);
    }
  };

  const handleFlightPress = (returnFlight: FlightResult) => {
    // Navigate to passenger info with both outbound and return flights
    if (!fromAirport || !toAirport) return;

    (navigation as any).navigate("PassengerInfo", {
      outboundFlight,
      returnFlight,
      fromAirport: toAirport, // Original fromAirport
      toAirport: fromAirport, // Original toAirport
      departDate,
      returnDate,
      passengers,
      tripType,
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !fromAirport || !toAirport) {
    return <EmptyState message={error || "Có lỗi xảy ra"} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chọn chuyến bay chiều về</Text>
          <Text style={styles.headerSubtitle}>
            {fromAirport.code} → {toAirport.code}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Selected Outbound Flight Banner */}
      <View style={styles.selectedBanner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="checkmark-circle" size={24} color="#00aa00" />
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Chuyến bay chiều đi đã chọn</Text>
          <Text style={styles.bannerText}>
            {outboundFlight.flightNumber} • {outboundFlight.airline?.name}
          </Text>
          <Text style={styles.bannerDate}>{new Date(departDate).toLocaleDateString("vi-VN")}</Text>
        </View>
      </View>

      {/* Return Flights List */}
      {flights.length === 0 ? (
        <EmptyState message="Không tìm thấy chuyến bay chiều về phù hợp" />
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleFlightPress(item)}>
              <FlightCard
                flight={item}
                fromAirport={fromAirport}
                toAirport={toAirport}
                onPress={() => handleFlightPress(item)}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  selectedBanner: {
    flexDirection: "row",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#c8e6c9",
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b5e20",
  },
  bannerDate: {
    fontSize: 12,
    color: "#4caf50",
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default ReturnFlightSelectionScreen;
