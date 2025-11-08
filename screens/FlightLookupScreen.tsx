import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../apis/apiClient";
import Ticket from "../components/Payment/Ticket";

const FlightLookupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingPassengerId, setBookingPassengerId] = useState("");
  const [bpResults, setBpResults] = useState<any[]>([]);

  // Only allow lookup by bookingPassenger id
  const searchByBookingPassenger = async () => {
    setError(null);
    setLoading(true);
    setBpResults([]);
    try {
      const id = bookingPassengerId.trim();
      if (!id) {
        setError("Please enter reservation number (e.g. BP123)");
        setLoading(false);
        return;
      }
      const resp = await apiClient.get(`/bookingPassengers?id=${encodeURIComponent(id)}`);
      const bps: any[] = Array.isArray(resp.data) ? resp.data : [];
      if (bps.length === 0) {
        setError("Reservation number not found");
        setLoading(false);
        return;
      }

      const tickets: any[] = [];
      for (const bp of bps) {
        // fetch segment
        const segResp = await apiClient
          .get(`/bookingSegments/${bp.bookingSegmentId}`)
          .then((r) => r.data)
          .catch(() => null);
        const seg = segResp;

        // fetch booking order
        const boResp = seg
          ? await apiClient
              .get(`/bookingOrders/${seg.bookingOrderId}`)
              .then((r) => r.data)
              .catch(() => null)
          : null;
        const booking = boResp || {};

        // passenger
        let passenger = null;
        if (bp.passengerId) {
          passenger = await apiClient
            .get(`/passengers/${bp.passengerId}`)
            .then((r) => r.data)
            .catch(() => null);
        } else {
          passenger = { firstName: bp.passengerFirst ?? "", lastName: bp.passengerLast ?? "" };
        }

        // seat class
        const sc = seg?.seatClassId
          ? await apiClient
              .get(`/seatClasses/${seg.seatClassId}`)
              .then((r) => r.data)
              .catch(() => null)
          : null;

        // flight
        let flight = null;
        if (seg?.flightId)
          flight = await apiClient
            .get(`/flights/${seg.flightId}`)
            .then((r) => r.data)
            .catch(() => null);
        else if (sc?.flightId)
          flight = await apiClient
            .get(`/flights/${sc.flightId}`)
            .then((r) => r.data)
            .catch(() => null);

        // airports
        let fromAirport = null;
        let toAirport = null;
        if (flight) {
          fromAirport = await apiClient
            .get(`/airports/${flight.fromAirportId}`)
            .then((r) => r.data)
            .catch(() => null);
          toAirport = await apiClient
            .get(`/airports/${flight.toAirportId}`)
            .then((r) => r.data)
            .catch(() => null);
        }

        const ticket = {
          bp,
          seg,
          booking,
          passenger,
          flight,
          seatClass: sc,
          fromAirport,
          toAirport,
        };
        tickets.push(ticket);
      }

      setBpResults(tickets);
    } catch (err: any) {
      console.warn("BP lookup failed", err);
      setError("Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../assets/lookup.png")} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Flight Lookup</Text>
              <Text style={styles.subtitle}>Track your booking with reservation number</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("Home" as never)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.label}>Reservation Number</Text>
          <TextInput
            placeholder="Enter your reservation number (e.g. BP01)"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={bookingPassengerId}
            onChangeText={setBookingPassengerId}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={searchByBookingPassenger}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Search Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Results Section */}
        {bpResults && bpResults.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Your Tickets</Text>
            <FlatList
              data={bpResults}
              keyExtractor={(item, idx) => String(item.bp?.id ?? idx)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const bp = item.bp;
                const seg = item.seg;
                const flight = item.flight;
                const passenger = item.passenger;
                const seatClass = item.seatClass;
                const fromAirport = item.fromAirport;
                const toAirport = item.toAirport;
                const passengerName = passenger
                  ? `${passenger.lastName ?? ""} ${passenger.firstName ?? ""}`.trim()
                  : "-";
                const dep = flight?.departureTime ?? "";
                const time = dep ? new Date(dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
                return (
                  <Ticket
                    key={bp.id}
                    fromCode={fromAirport?.code ?? flight?.fromAirportId ?? "---"}
                    fromName={fromAirport?.city ?? fromAirport?.name}
                    toCode={toAirport?.code ?? flight?.toAirportId ?? "---"}
                    toName={toAirport?.city ?? toAirport?.name}
                    passengerName={passengerName}
                    flightNumber={flight?.flightNumber ?? ""}
                    date={dep}
                    time={time}
                    seat={bp.seatNumber ?? ""}
                    bookingCode={String(bp.id)}
                    seatClass={seatClass?.className ?? ""}
                  />
                );
              }}
            />
          </View>
        ) : !loading ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>✈️</Text>
            </View>
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>Enter your reservation number above to view your flight tickets</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  headerSection: {
    marginBottom: 16,
    marginTop: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  searchCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f9fafb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  button: {
    backgroundColor: "#0070BB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#0070BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  resultsSection: {
    flex: 1,
    minHeight: 600,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default FlightLookupScreen;
