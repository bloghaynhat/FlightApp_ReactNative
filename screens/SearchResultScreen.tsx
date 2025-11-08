import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { flightService, FlightResult } from "../apis/flightService";
import { airportService } from "../apis/airportService";
import { FlightCard } from "../components/SearchResult/FlightCard";
import { LoadingState } from "../components/SearchResult/LoadingState";
import { EmptyState } from "../components/SearchResult/EmptyState";
import PaymentHeader from "../components/Payment/PaymentHeader";
import type { Airport } from "../types";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type RootStackParamList = {
  SearchResult: {
    fromAirportId: string;
    toAirportId: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
    tripType: "oneWay" | "roundTrip";
  };
};

type SearchResultScreenRouteProp = RouteProp<RootStackParamList, "SearchResult">;
type SearchResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "SearchResult">;

const SearchResultScreen: React.FC = () => {
  const route = useRoute<SearchResultScreenRouteProp>();
  const navigation = useNavigation<SearchResultScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { fromAirportId, toAirportId, departDate, returnDate, passengers, tripType } = route.params;

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [selectedSeatClassId, setSelectedSeatClassId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load airports và flights song song
      const [fromAirportData, toAirportData, flightsData] = await Promise.all([
        airportService.getAirportById(fromAirportId),
        airportService.getAirportById(toAirportId),
        flightService.searchFlights({
          fromAirportId,
          toAirportId,
          departureDate: departDate,
          returnDate,
          passengers,
        }),
      ]);

      setFromAirport(fromAirportData);
      setToAirport(toAirportData);
      setFlights(flightsData);
    } catch (err) {
      console.error("Error loading search results:", err);
      setError("Không thể tải kết quả tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleFlightPress = (flight: FlightResult, seatClassId: string) => {
    setSelectedFlight(flight);
    setSelectedSeatClassId(seatClassId);
  };

  const handleContinue = () => {
    if (!selectedFlight || !selectedSeatClassId) return;

    // Navigate to passenger info for OneWay
    if (tripType === "oneWay") {
      // Navigate within the same BookFlightStack
      (navigation as any).navigate("PassengerInfo", {
        flight: selectedFlight,
        fromAirport,
        toAirport,
        departDate,
        passengers,
        tripType,
        selectedSeatClassId,
      });
    } else {
      // For RoundTrip: Navigate to return flight selection
      (navigation as any).navigate("ReturnFlightSelection", {
        outboundFlight: selectedFlight,
        fromAirportId: fromAirportId,
        toAirportId: toAirportId,
        departDate,
        returnDate,
        passengers,
        tripType,
        selectedSeatClassId,
      });
    }
  };

  const handleBackPress = () => {
    // Navigate back within the same stack
    navigation.goBack();
  };

  const handleClosePress = () => {
    // Navigate to Home tab
    (navigation as any).navigate("MainTabs", {
      screen: "Home",
      params: {
        screen: "Home",
      },
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
      <PaymentHeader
        title="Select flight"
        currentStep={1}
        totalSteps={4}
        showBackButton={true}
        onBackPress={handleBackPress}
        onClosePress={handleClosePress}
      />

      {flights.length === 0 ? (
        <EmptyState />
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
                selectedSeatClassId={selectedFlight?.id === item.id ? selectedSeatClassId : null}
                onSelectSeatClass={(seatClassId) => handleFlightPress(item, seatClassId)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />

          {/* Global Continue Button */}
          {selectedFlight && selectedSeatClassId && (
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

export default SearchResultScreen;
