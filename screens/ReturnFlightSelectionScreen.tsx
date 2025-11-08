import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { flightService, FlightResult } from "../apis/flightService";
import { airportService } from "../apis/airportService";
import { FlightCard } from "../components/SearchResult/FlightCard";
import { LoadingState } from "../components/SearchResult/LoadingState";
import { EmptyState } from "../components/SearchResult/EmptyState";
import PaymentHeader from "../components/Payment/PaymentHeader";
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
    selectedSeatClassId: string;
  };
};

type ReturnFlightSelectionRouteProp = RouteProp<RootStackParamList, "ReturnFlightSelection">;
type ReturnFlightSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, "ReturnFlightSelection">;

const ReturnFlightSelectionScreen: React.FC = () => {
  const route = useRoute<ReturnFlightSelectionRouteProp>();
  const navigation = useNavigation<ReturnFlightSelectionNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    outboundFlight,
    fromAirportId,
    toAirportId,
    departDate,
    returnDate,
    passengers,
    tripType,
    selectedSeatClassId,
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<FlightResult | null>(null);
  const [selectedReturnSeatClassId, setSelectedReturnSeatClassId] = useState<string | null>(null);

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

  const handleFlightPress = (returnFlight: FlightResult, selectedReturnSeatClassId: string) => {
    setSelectedReturnFlight(returnFlight);
    setSelectedReturnSeatClassId(selectedReturnSeatClassId);
  };

  const handleContinue = () => {
    if (!selectedReturnFlight || !selectedReturnSeatClassId || !fromAirport || !toAirport) return;

    // Navigate to passenger info with both outbound and return flights
    (navigation as any).navigate("PassengerInfo", {
      outboundFlight,
      returnFlight: selectedReturnFlight,
      fromAirport: toAirport, // Original fromAirport
      toAirport: fromAirport, // Original toAirport
      departDate,
      returnDate,
      passengers,
      tripType,
      selectedSeatClassId,
      selectedReturnSeatClassId,
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !fromAirport || !toAirport) {
    return <EmptyState message={error || "Có lỗi xảy ra"} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <PaymentHeader title="Select return flight" currentStep={1} totalSteps={4} showBackButton={true} />

      {/* Selected Outbound Flight Banner */}
      <View style={styles.selectedBanner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="checkmark-circle" size={24} color="#00aa00" />
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Selected Outbound Flight</Text>
          <Text style={styles.bannerText}>
            {outboundFlight.flightNumber} • {outboundFlight.airline?.name}
          </Text>
          <Text style={styles.bannerDate}>{new Date(departDate).toLocaleDateString("en-US")}</Text>
        </View>
      </View>

      {/* Return Flights List */}
      {flights.length === 0 ? (
        <EmptyState message="No return flights found" />
      ) : (
        <>
          <FlatList
            data={flights}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FlightCard
                flight={item}
                fromAirport={fromAirport}
                toAirport={toAirport}
                selectedSeatClassId={selectedReturnFlight?.id === item.id ? selectedReturnSeatClassId : null}
                onSelectSeatClass={(seatClassId) => handleFlightPress(item, seatClassId)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />

          {/* Global Continue Button */}
          {selectedReturnFlight && selectedReturnSeatClassId && (
            <View style={[styles.continueContainer, { paddingBottom: 12 + insets.bottom }]}>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    paddingBottom: 100, // Add space for continue button
  },
  continueContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: "#0070BB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ReturnFlightSelectionScreen;
