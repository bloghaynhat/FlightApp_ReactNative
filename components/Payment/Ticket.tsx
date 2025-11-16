import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type TicketProps = {
  fromCode: string;
  fromName?: string;
  toCode: string;
  toName?: string;
  passengerName: string;
  flightNumber?: string;
  date?: string; // ISO date
  time?: string; // departure time string
  arrivalTime?: string; // arrival time string
  seat?: string;
  gate?: string;
  bookingCode?: string;
  seatClass?: string;
  onShare?: () => void;
};

const Ticket: React.FC<TicketProps> = ({
  fromCode,
  fromName,
  toCode,
  toName,
  passengerName,
  flightNumber,
  date,
  time,
  arrivalTime,
  seat,
  gate,
  bookingCode,
  seatClass,
  onShare,
}) => {
  const prettyDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  // Generate random seat number if not provided (e.g., 12A, 15B, etc.)
  const seatNumber =
    seat || `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;

  // Format reservation number to 4 uppercase alphanumeric characters
  const formatReservationNumber = (code: string | undefined) => {
    if (!code) return "-";
    // Take last 4 characters and convert to uppercase, pad if needed
    const cleaned = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    return cleaned.padEnd(4, "X").slice(0, 4);
  };

  return (
    <View style={styles.container}>
      {/* Flight Route Header - Similar to FlightCard */}
      <View style={styles.flightHeader}>
        <View style={styles.routeBlock}>
          <Text style={styles.timeText}>{time ?? "-"}</Text>
          <Text style={styles.airportCode}>{fromCode}</Text>
          <Text style={styles.city}>{fromName}</Text>
        </View>

        <View style={styles.durationBlock}>
          <View style={styles.flightLine}>
            <View style={styles.lineWithPlane}>
              <View style={styles.dottedLine} />
              <Text style={styles.planeIcon}>✈️</Text>
            </View>
          </View>
          <Text style={styles.stopText}>Non stop</Text>
        </View>

        <View style={styles.routeBlock}>
          <Text style={styles.timeText}>{arrivalTime ?? time ?? "-"}</Text>
          <Text style={styles.airportCode}>{toCode}</Text>
          <Text style={styles.city}>{toName}</Text>
        </View>
      </View>

      {/* Flight Number */}
      <Text style={styles.flightNumber}>{flightNumber ?? "-"}</Text>

      {/* Passenger & Flight Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Passenger</Text>
            <Text style={styles.value}>{passengerName}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{prettyDate}</Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.label}>Class</Text>
            <Text style={styles.value}>{seatClass ?? `-`}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.label}>Seat</Text>
            <Text style={styles.value}>{seatNumber}</Text>
          </View>
        </View>

        <View style={styles.pnrCard}>
          <Text style={styles.label}>Reservation Number</Text>
          <Text style={styles.pnr}>{formatReservationNumber(bookingCode)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  routeBlock: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  airportCode: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  city: {
    fontSize: 11,
    color: "#999",
  },
  durationBlock: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
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
  detailsSection: {
    gap: 12,
  },
  detailGrid: {
    flexDirection: "row",
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  pnrCard: {
    backgroundColor: "#e0f2ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  pnr: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0070BB",
    letterSpacing: 2,
    marginTop: 4,
  },
});

export default Ticket;
