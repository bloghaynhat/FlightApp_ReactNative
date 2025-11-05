import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { FlightResult } from "../../apis/flightService";
import type { Airport } from "../../types";

interface FlightCardProps {
  flight: FlightResult;
  fromAirport: Airport;
  toAirport: Airport;
  onPress: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, fromAirport, toAirport }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const lowestPrice =
    flight.seatClasses && flight.seatClasses.length > 0 ? Math.min(...flight.seatClasses.map((sc) => sc.price)) : 0;

  return (
    <View style={styles.card}>
      {/* Header: Airline */}
      <View style={styles.header}>
        {flight.airline?.logo && (
          <Image source={{ uri: flight.airline.logo }} style={styles.airlineLogo} resizeMode="contain" />
        )}
        <View style={styles.airlineInfo}>
          <Text style={styles.airlineName}>{flight.airline?.name || "Airline"}</Text>
          <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        </View>
      </View>

      {/* Flight Route */}
      <View style={styles.routeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTime(flight.departureTime)}</Text>
          <Text style={styles.cityCode}>{fromAirport.code}</Text>
        </View>

        <View style={styles.durationBlock}>
          <Text style={styles.duration}>{calculateDuration(flight.departureTime, flight.arrivalTime)}</Text>
          <View style={styles.line}>
            <View style={styles.dot} />
            <View style={styles.solidLine} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.directText}>Bay thẳng</Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTime(flight.arrivalTime)}</Text>
          <Text style={styles.cityCode}>{toAirport.code}</Text>
        </View>
      </View>

      {/* Price */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Từ</Text>
          <Text style={styles.price}>{formatPrice(lowestPrice)}</Text>
        </View>
        <View style={styles.seatsInfo}>
          {flight.seatClasses?.map((sc) => (
            <Text key={sc.id} style={styles.seatClass}>
              {sc.className}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  airlineLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  airlineInfo: {
    flex: 1,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  flightNumber: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeBlock: {
    alignItems: "center",
  },
  time: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  cityCode: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  durationBlock: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  duration: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0066cc",
  },
  solidLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#0066cc",
    marginHorizontal: 4,
  },
  directText: {
    fontSize: 10,
    color: "#0066cc",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6b35",
  },
  seatsInfo: {
    alignItems: "flex-end",
  },
  seatClass: {
    fontSize: 11,
    color: "#0066cc",
    marginTop: 2,
  },
});
