import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import type { FlightResult } from "../../apis/flightService";
import type { Airport } from "../../types";

interface FlightCardProps {
  flight: FlightResult;
  fromAirport: Airport;
  toAirport: Airport;
  selectedSeatClassId?: string | null;
  onSelectSeatClass: (seatClassId: string) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  fromAirport,
  toAirport,
  selectedSeatClassId,
  onSelectSeatClass,
}) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours ${minutes} minutes`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  return (
    <View style={styles.card}>
      {/* Flight Info Header */}
      <View style={styles.flightHeader}>
        <View style={styles.dateTimeBlock}>
          <Text style={styles.dateText}>{formatDate(flight.departureTime)}</Text>
          <Text style={styles.timeText}>{formatTime(flight.departureTime)}</Text>
          <Text style={styles.cityCode}>{fromAirport.code}</Text>
        </View>

        <View style={styles.durationBlock}>
          <Text style={styles.durationText}>{calculateDuration(flight.departureTime, flight.arrivalTime)}</Text>
          <View style={styles.flightLine}>
            <View style={styles.lineWithPlane}>
              <View style={styles.dottedLine} />
              <Text style={styles.planeIcon}>✈️</Text>
            </View>
          </View>
          <Text style={styles.stopText}>Non stop</Text>
        </View>

        <View style={styles.dateTimeBlock}>
          <Text style={styles.dateText}>{formatDate(flight.arrivalTime)}</Text>
          <Text style={styles.timeText}>{formatTime(flight.arrivalTime)}</Text>
          <Text style={styles.cityCode}>{toAirport.code}</Text>
        </View>
      </View>

      {/* Flight Number */}
      <Text style={styles.flightNumber}>
        {flight.flightNumber}/{flight.airline?.name || "AIRBUS A321"}
      </Text>

      {/* Seat Classes */}
      <View style={styles.seatClassesContainer}>
        {flight.seatClasses?.map((seatClass) => {
          const isSelected = selectedSeatClassId === seatClass.id;
          return (
            <View key={seatClass.id} style={styles.seatClassRow}>
              <View style={styles.seatClassInfo}>
                <Text style={styles.seatClassName}>
                  {seatClass.className}({seatClass.className.charAt(0)})
                </Text>
                <Text style={styles.refundableText}>Refundable</Text>
                <Text style={styles.priceText}>{formatPrice(seatClass.price)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.selectButton, isSelected && styles.selectButtonSelected]}
                onPress={() => onSelectSeatClass(seatClass.id)}
              >
                <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>
                  {isSelected ? "Selecting" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTimeBlock: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  cityCode: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  durationBlock: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  durationText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  flightLine: {
    width: "100%",
    marginBottom: 6,
  },
  lineWithPlane: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dottedLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#ccc",
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "#999",
  },
  planeIcon: {
    position: "absolute",
    fontSize: 16,
    top: -12,
  },
  stopText: {
    fontSize: 10,
    color: "#000",
    fontWeight: "500",
  },
  flightNumber: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  seatClassesContainer: {
    gap: 12,
  },
  seatClassRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  seatClassInfo: {
    flex: 1,
  },
  seatClassName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  refundableText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0070BB",
  },
  selectButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  selectButtonSelected: {
    backgroundColor: "#0070BB",
    borderColor: "#0070BB",
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  selectButtonTextSelected: {
    color: "#fff",
  },
});
