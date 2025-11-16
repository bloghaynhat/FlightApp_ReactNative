import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { type RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PaymentHeader from "../components/Payment/PaymentHeader";
import Ticket from "../components/Payment/Ticket";
import { useState, useRef, useEffect } from "react";
import apiClient from "../apis/apiClient";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  BookingConfirmation: { booking: any; segments?: any[]; bookingPassengers?: any[]; passengers?: any[] };
};

type BookingConfirmationRouteProp = RouteProp<RootStackParamList, "BookingConfirmation">;

const BookingConfirmation: React.FC = () => {
  const route = useRoute<BookingConfirmationRouteProp>();
  const navigation = useNavigation();
  const { booking, segments, bookingPassengers, passengers } = route.params;

  const [isAnimating, setIsAnimating] = useState(false);
  const planePosition = useRef(new Animated.Value(-100)).current;

  const handleNavigateHome = () => {
    setIsAnimating(true);
    Animated.timing(planePosition, {
      toValue: 1000,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      // Reset BookFlight stack to initial screen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs" as any,
            state: {
              routes: [
                { name: "Home" },
                { name: "BookFlight", state: { routes: [{ name: "SearchFlight" }] } },
                { name: "Profile" },
              ],
              index: 0, // Navigate to Home tab
            },
          },
        ],
      });
    });
  };

  const [flightsMap, setFlightsMap] = useState<Record<string, any>>({});
  const [seatClassMap, setSeatClassMap] = useState<Record<string, any>>({});
  const [airportsMap, setAirportsMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!segments || segments.length === 0) return;

    const load = async () => {
      try {
        const seatClassIds = Array.from(new Set(segments.map((s: any) => s.seatClassId).filter(Boolean)));
        const flightIdsFromSegments = Array.from(new Set(segments.map((s: any) => s.flightId).filter(Boolean)));

        const seatClassPromises = seatClassIds.map((id: string) =>
          apiClient
            .get(`/seatClasses/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        );
        const seatClasses = await Promise.all(seatClassPromises);
        const seatClassMapLocal: Record<string, any> = {};
        const extraFlightIds: string[] = [];
        seatClasses.forEach((sc: any) => {
          if (!sc) return;
          seatClassMapLocal[sc.id] = sc;
          if (sc.flightId) extraFlightIds.push(sc.flightId);
        });

        const flightIds = Array.from(new Set([...flightIdsFromSegments, ...extraFlightIds]));
        const flightPromises = flightIds.map((id: string) =>
          apiClient
            .get(`/flights/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        );
        const flights = await Promise.all(flightPromises);
        const flightsMapLocal: Record<string, any> = {};
        const airportIds: string[] = [];
        flights.forEach((f: any) => {
          if (!f) return;
          flightsMapLocal[f.id] = f;
          if (f.fromAirportId) airportIds.push(f.fromAirportId);
          if (f.toAirportId) airportIds.push(f.toAirportId);
        });

        const uniqueAirportIds = Array.from(new Set(airportIds));
        const airportPromises = uniqueAirportIds.map((id: string) =>
          apiClient
            .get(`/airports/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        );
        const airports = await Promise.all(airportPromises);
        const airportsMapLocal: Record<string, any> = {};
        airports.forEach((a: any) => {
          if (!a) return;
          airportsMapLocal[a.id] = a;
        });

        setSeatClassMap(seatClassMapLocal);
        setFlightsMap(flightsMapLocal);
        setAirportsMap(airportsMapLocal);
      } catch (err) {
        console.warn("Failed to load flight/seat/airport data", err);
      }
    };

    load();
  }, [segments]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {isAnimating && (
        <Animated.View
          style={[
            styles.planeOverlay,
            {
              transform: [{ translateX: planePosition }],
            },
          ]}
        >
          <MaterialCommunityIcons name="airplane" size={48} color="#0066cc" />
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <PaymentHeader title="Booking confirmation" currentStep={4} totalSteps={4} showBackButton={false} />

        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons name="check-circle" size={56} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Booking Successful!</Text>
          <Text style={styles.successSubtitle}>Your flight ticket has been confirmed</Text>
        </View>
        {/* 
                <View style={styles.confirmationCard}>
                    <Text style={styles.cardLabel}>Mã xác nhận</Text>
                    <LinearGradient
                        colors={["#0066cc", "#0052a3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.codeBox}
                    >
                        <Text style={styles.confirmationCode}>{booking.confirmationCode}</Text>
                    </LinearGradient>
                    <Text style={styles.codeHint}>Giữ mã này để check-in</Text>
                </View> */}

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="cash" size={24} color="#0066cc" />
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(booking.totalPrice)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="calendar" size={24} color="#0066cc" />
            <Text style={styles.summaryLabel}>Booking Date</Text>
            <Text style={styles.summaryValue}>{new Date(booking.bookingDate).toLocaleDateString("en-US")}</Text>
          </View>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="email" size={24} color="#0066cc" />
            <Text style={styles.summaryLabel}>Email</Text>
            <Text style={styles.summaryValueSmall}>{booking.emailContact}</Text>
          </View>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="phone" size={24} color="#0066cc" />
            <Text style={styles.summaryLabel}>Phone</Text>
            <Text style={styles.summaryValue}>{booking.phoneContact}</Text>
          </View>
        </View>

        {/* Tickets: render one Ticket per passenger × segment.
            Render grouped by leg (outbound then return) so round-trip shows two tickets per passenger. */}
        {segments && segments.length > 0 && bookingPassengers && bookingPassengers.length > 0 && (
          <View style={[styles.segmentsSection, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>Your Tickets</Text>
            {["outbound", "return"].map((legLabel) => {
              const legSegments = segments.filter((s: any) => (s.leg ?? "outbound") === legLabel);
              if (legSegments.length === 0) return null;
              return (
                <View key={legLabel} style={{ marginBottom: 8 }}>
                  <Text style={[styles.sectionTitle, { fontSize: 14 }]}>
                    {legLabel === "outbound" ? "Outbound" : "Return"}
                  </Text>
                  {legSegments.flatMap((segment: any) => {
                    const bps = (bookingPassengers || []).filter((bp: any) => bp.bookingSegmentId === segment.id);
                    return bps.map((bp: any, bpIndex: number) => {
                      const passenger = passengers?.find((p: any) => String(p.id) === String(bp.passengerId));
                      const passengerName = passenger
                        ? `${passenger.lastName ?? ""} ${passenger.firstName ?? ""}`.trim()
                        : `${bp.passengerLast ?? ""} ${bp.passengerFirst ?? ""}`.trim();
                      const flight =
                        flightsMap[segment.flightId] ??
                        (seatClassMap[segment.seatClassId] && flightsMap[seatClassMap[segment.seatClassId].flightId]);
                      const fromAirport = flight ? airportsMap[flight.fromAirportId] : undefined;
                      const toAirport = flight ? airportsMap[flight.toAirportId] : undefined;
                      const fromCode = fromAirport?.code ?? segment.fromCode ?? booking.fromCode ?? "";
                      const toCode = toAirport?.code ?? segment.toCode ?? booking.toCode ?? "";
                      const flightNumber = flight?.flightNumber ?? segment.flightNumber ?? segment.flightId ?? "";
                      const date = flight?.departureTime ?? booking.bookingDate ?? booking.date ?? "";
                      const time = flight?.departureTime
                        ? new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : segment.time ?? "";
                      const arrivalTime = flight?.arrivalTime
                        ? new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : time;
                      const seat = bp.seatNumber ?? segment.seatNumber ?? "";
                      const bookingCode = bp.id ?? "";
                      const seatClass = seatClassMap[segment.seatClassId]?.className ?? segment.seatClassId ?? "";

                      return (
                        <Ticket
                          key={`${legLabel}_${segment.id}_${bp.id ?? bpIndex}`}
                          fromCode={fromCode || "---"}
                          fromName={fromAirport?.city ?? segment.fromName ?? booking.fromName}
                          toCode={toCode || "---"}
                          toName={toAirport?.city ?? segment.toName ?? booking.toName}
                          passengerName={passengerName || "-"}
                          flightNumber={flightNumber}
                          date={date}
                          time={time}
                          arrivalTime={arrivalTime}
                          seat={seat}
                          bookingCode={String(bookingCode)}
                          seatClass={seatClass}
                        />
                      );
                    });
                  })}
                </View>
              );
            })}
          </View>
        )}

        <LinearGradient
          colors={["#0066cc", "#0052a3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <TouchableOpacity style={styles.button} onPress={handleNavigateHome} disabled={isAnimating}>
            <MaterialCommunityIcons name="home" size={20} color="#fff" />
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  container: {
    backgroundColor: "#f8f9fb",
    paddingBottom: 24,
  },
  successHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0066cc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  confirmationCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  codeBox: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  confirmationCode: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
  },
  codeHint: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  summaryGrid: {
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  summaryValueSmall: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  segmentsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  segmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  segmentBadge: {
    backgroundColor: "#e0eeff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0066cc",
  },
  seatClassText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0066cc",
  },
  flightTimeline: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0066cc",
    marginRight: 8,
  },
  timelineTime: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  timelineRight: {
    flex: 1,
    marginLeft: 8,
  },
  timelineCity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: "#666",
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#d1d5db",
    marginLeft: 3,
    marginVertical: 4,
  },
  segmentDetails: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  statusBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeConfirmed: {
    backgroundColor: "#d1fae5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#78350f",
  },
  buttonGradient: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  planeOverlay: {
    position: "absolute",
    top: "50%",
    left: -100,
    width: 60,
    height: 60,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BookingConfirmation;
