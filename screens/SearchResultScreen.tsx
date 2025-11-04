import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { flightService, FlightResult } from "../apis/flightService";
import { airportService } from "../apis/airportService";
import { FlightCard } from "../components/SearchResult/FlightCard";
import { LoadingState } from "../components/SearchResult/LoadingState";
import { EmptyState } from "../components/SearchResult/EmptyState";
import { SearchHeader } from "../components/SearchResult/SearchHeader";
import type { Airport } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { fromAirportId, toAirportId, departDate, returnDate, passengers, tripType } = route.params;

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

  const handleFlightPress = (flight: FlightResult) => {
    // TODO: Navigate to flight details
    console.log("Selected flight:", flight);
  };

  const handleModifySearch = () => {
    navigation.goBack();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !fromAirport || !toAirport) {
    return <EmptyState message={error || "Có lỗi xảy ra"} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        fromAirport={fromAirport}
        toAirport={toAirport}
        departDate={new Date(departDate)}
        returnDate={returnDate ? new Date(returnDate) : null}
        passengers={passengers}
        onModify={handleModifySearch}
      />

      {flights.length === 0 ? (
        <EmptyState />
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
  listContent: {
    paddingVertical: 8,
  },
});

export default SearchResultScreen;
