import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { RootStackParamList } from "../types/types";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PaymentHeader from "../components/Payment/PaymentHeader";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlightResult } from "../apis/flightService";
import { Airport } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PaymentInfo">;
interface Props {
  navigation: PaymentInfoScreenNavigationProp;
}

const PaymentInfoScreen = ({ navigation }: Props): React.ReactElement => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentInfo">>();
  const insets = useSafeAreaInsets();
  const params = route.params;
  const {
    flight,
    passengers,
    contact,
    selectedSeatClassId,
    returnFlight,
    selectedReturnSeatClassId,
    departDate,
    returnDate,
    tripType,
  } = (params ?? {}) as NonNullable<RootStackParamList["PaymentInfo"]>;

  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showPassengerInfo, setShowPassengerInfo] = useState(false);

  // Interpret incoming params
  const passengerList = Array.isArray(passengers) ? (passengers as any[]) : undefined;
  const passengerCount = passengerList
    ? passengerList.length
    : typeof passengers === "number"
    ? (passengers as number)
    : 1;

  const getSeatClassPrice = (f: any, seatClassId?: string) => {
    if (!f || !f.seatClasses) return 0;
    const sc = seatClassId ? f.seatClasses.find((s: any) => s.id === seatClassId) : f.seatClasses[0];
    return sc ? sc.price || 0 : 0;
  };

  const getSeatClassName = (f: any, seatClassId?: string) => {
    if (!f || !f.seatClasses) return "-";
    const sc = seatClassId ? f.seatClasses.find((s: any) => s.id === seatClassId) : f.seatClasses[0];
    return sc ? sc.className || sc.name || "-" : "-";
  };

  const outboundPricePerPassenger = getSeatClassPrice(flight as any, selectedSeatClassId);
  const returnPricePerPassenger = getSeatClassPrice(returnFlight as any, selectedReturnSeatClassId);
  const outboundTotal = outboundPricePerPassenger * passengerCount;
  const returnTotal = returnPricePerPassenger * passengerCount;

  // Tính toán giá tổng bao gồm tất cả các phí (đồng bộ với PassengerInfoScreen)
  const baseFare = outboundTotal + returnTotal;
  const systemAdminSurcharge = 220000; // Phụ thu hệ thống & quản trị
  const passengerServiceCharge = 50000; // Phí phục vụ hành khách nội địa
  const securityScreeningCharge = 10000; // Phí soi chiếu an ninh
  const vat = Math.round((baseFare + systemAdminSurcharge + passengerServiceCharge + securityScreeningCharge) * 0.1); // 10% VAT
  const taxFeesTotal = systemAdminSurcharge + passengerServiceCharge + securityScreeningCharge + vat;
  const grandTotal = baseFare + taxFeesTotal;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleProceedToPayment = () => {
    // Pass booking payload to PaymentMethod so it can create the BookingOrder after payment
    navigation.navigate("PaymentMethod", {
      bookingPayload: {
        // include both outbound and return flight objects so PaymentMethod can create segments for both legs
        outboundFlight: flight,
        returnFlight: returnFlight,
        passengers: passengerList ?? passengerCount,
        contact,
        selectedSeatClassId,
        selectedReturnSeatClassId,
        departDate,
        returnDate,
        tripType,
        grandTotal, // Tổng giá đã bao gồm tất cả các phí
        baseFare, // Giá vé cơ bản
        systemAdminSurcharge,
        passengerServiceCharge,
        securityScreeningCharge,
        vat,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <PaymentHeader title="Payment confirmation" currentStep={3} totalSteps={4} showBackButton={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Flight Info Card */}
        <CollapsibleCard
          icon="airplane"
          title="Flight Information"
          isOpen={showFlightInfo}
          onToggle={() => setShowFlightInfo(!showFlightInfo)}
          accentColor="#0066cc"
        >
          {/* Departure Flight */}
          <Text style={styles.flightType}>
            Departure flight / {getSeatClassName(flight as any, selectedSeatClassId)}
          </Text>

          {flight && (
            <>
              <View style={styles.flightTimelineRow}>
                <View style={styles.timelineIconContainer}>
                  <MaterialCommunityIcons name="checkbox-blank-circle" size={12} color="#999" />
                  <View style={styles.timelineConnector} />
                </View>
                <View style={styles.flightTimelineContent}>
                  <Text style={styles.flightDateTime}>
                    {departDate && new Date(departDate).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                    {departDate && new Date(departDate).toLocaleDateString("en-GB")}{" "}
                    {new Date(flight.departureTime).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.flightLocation}>{params?.fromAirport?.code || flight.fromAirportId}</Text>
                  <Text style={styles.flightCity}>
                    {params?.fromAirport?.city || "Unknown"}, {params?.fromAirport?.country || "Unknown"}
                  </Text>
                  <Text style={styles.flightDuration}>
                    {Math.floor(
                      (new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours{" "}
                    {Math.floor(
                      ((new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) %
                        (1000 * 60 * 60)) /
                        (1000 * 60)
                    )}{" "}
                    minutes
                  </Text>
                  <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
                </View>
              </View>

              <View style={styles.flightTimelineRow}>
                <View style={styles.timelineIconContainer}>
                  <MaterialCommunityIcons name="checkbox-blank-circle" size={12} color="#999" />
                </View>
                <View style={styles.flightTimelineContent}>
                  <Text style={styles.flightDateTime}>
                    {new Date(flight.arrivalTime).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                    {new Date(flight.arrivalTime).toLocaleDateString("en-GB")}{" "}
                    {new Date(flight.arrivalTime).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.flightLocation}>{params?.toAirport?.code || flight.toAirportId}</Text>
                  <Text style={styles.flightCity}>
                    {params?.toAirport?.city || "Unknown"}, {params?.toAirport?.country || "Unknown"}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Return Flight */}
          {tripType === "roundTrip" && returnFlight && (
            <>
              <Text style={[styles.flightType, { marginTop: 20 }]}>
                Return flight / {getSeatClassName(returnFlight as any, selectedReturnSeatClassId)}
              </Text>

              <View style={styles.flightTimelineRow}>
                <View style={styles.timelineIconContainer}>
                  <MaterialCommunityIcons name="checkbox-blank-circle" size={12} color="#999" />
                  <View style={styles.timelineConnector} />
                </View>
                <View style={styles.flightTimelineContent}>
                  <Text style={styles.flightDateTime}>
                    {returnDate && new Date(returnDate).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                    {returnDate && new Date(returnDate).toLocaleDateString("en-GB")}{" "}
                    {new Date(returnFlight.departureTime).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.flightLocation}>{params?.toAirport?.code || returnFlight.fromAirportId}</Text>
                  <Text style={styles.flightCity}>
                    {params?.toAirport?.city || "Unknown"}, {params?.toAirport?.country || "Unknown"}
                  </Text>
                  <Text style={styles.flightDuration}>
                    {Math.floor(
                      (new Date(returnFlight.arrivalTime).getTime() - new Date(returnFlight.departureTime).getTime()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours{" "}
                    {Math.floor(
                      ((new Date(returnFlight.arrivalTime).getTime() - new Date(returnFlight.departureTime).getTime()) %
                        (1000 * 60 * 60)) /
                        (1000 * 60)
                    )}{" "}
                    minutes
                  </Text>
                  <Text style={styles.flightNumber}>{returnFlight.flightNumber}</Text>
                </View>
              </View>

              <View style={styles.flightTimelineRow}>
                <View style={styles.timelineIconContainer}>
                  <MaterialCommunityIcons name="checkbox-blank-circle" size={12} color="#999" />
                </View>
                <View style={styles.flightTimelineContent}>
                  <Text style={styles.flightDateTime}>
                    {new Date(returnFlight.arrivalTime).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                    {new Date(returnFlight.arrivalTime).toLocaleDateString("en-GB")}{" "}
                    {new Date(returnFlight.arrivalTime).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.flightLocation}>{params?.fromAirport?.code || returnFlight.toAirportId}</Text>
                  <Text style={styles.flightCity}>
                    {params?.fromAirport?.city || "Unknown"}, {params?.fromAirport?.country || "Unknown"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </CollapsibleCard>

        {/* Price Details Card */}
        <CollapsibleCard
          icon="cash"
          title="Price Details"
          isOpen={showPriceDetails}
          onToggle={() => setShowPriceDetails(!showPriceDetails)}
          accentColor="#0066cc"
        >
          {/* Fare Section */}
          <View style={styles.priceSection}>
            <Text style={styles.priceSectionTitle}>Fare</Text>
            <Text style={styles.priceSectionValue}>{formatPrice(baseFare)}</Text>
          </View>
          <PaymentDetailRow
            label="Ticket price (1 passenger) - Outbound"
            value={formatPrice(outboundPricePerPassenger)}
          />
          {tripType === "roundTrip" && (
            <PaymentDetailRow
              label="Ticket price (1 passenger) - Return"
              value={formatPrice(returnPricePerPassenger)}
            />
          )}
          <PaymentDetailRow
            label="Number of passengers"
            value={`${passengerCount} x ${formatPrice(outboundPricePerPassenger + returnPricePerPassenger)}`}
          />

          <View style={styles.divider} />

          {/* Tax, fees and carrier charges Section */}
          <View style={styles.priceSection}>
            <Text style={styles.priceSectionTitle}>Tax, fees and carrier charges</Text>
            <Text style={styles.priceSectionValue}>{formatPrice(taxFeesTotal)}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Surcharges</Text>
          <PaymentDetailRow label="System and Admin Surcharge" value={formatPrice(systemAdminSurcharge)} />

          <Text style={styles.subSectionTitle}>Taxes, fees and charges</Text>
          <PaymentDetailRow label="Passenger Service Charge – Domestic" value={formatPrice(passengerServiceCharge)} />
          <PaymentDetailRow
            label="Passenger and Baggage Security Screening Service Charge"
            value={formatPrice(securityScreeningCharge)}
          />
          <PaymentDetailRow label="Value Added Tax, Vietnam" value={formatPrice(vat)} />

          <View style={styles.divider} />

          {/* Total Section */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
          </View>
        </CollapsibleCard>

        <CollapsibleCard
          icon="account-multiple"
          title="Passenger Information"
          isOpen={showPassengerInfo}
          onToggle={() => setShowPassengerInfo(!showPassengerInfo)}
          accentColor="#0066cc"
        >
          {passengerList && passengerList.length > 0 ? (
            passengerList.map((p: any, idx: number) => (
              <PaymentDetailRow key={idx} label={`Passenger ${idx + 1}`} value={`${p.lastName} ${p.firstName}`} />
            ))
          ) : (
            <PaymentDetailRow label="Number of passengers" value={`${passengerCount}`} />
          )}
          <PaymentDetailRow label="Contact Email" value={contact?.email ?? "-"} />
          <PaymentDetailRow label="Contact Phone" value={contact?.phone ?? "-"} isLast />
        </CollapsibleCard>
      </ScrollView>

      {/* Fixed Bottom Section - Total and Payment Button */}
      <View style={[styles.bottomContainer, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.totalSummaryContainer}>
          <Text style={styles.totalLabelText}>Total:</Text>
          <Text style={styles.totalAmountText}>{formatPrice(grandTotal)}</Text>
        </View>

        <LinearGradient
          colors={["#0070BB", "#0070BB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButtonGradient}
        >
          <TouchableOpacity style={styles.payButton} onPress={handleProceedToPayment} activeOpacity={0.8}>
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

/**
 * Collapsible card component for payment details
 */
interface CollapsibleCardProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
  children: React.ReactNode;
}

const CollapsibleCard = ({
  icon,
  title,
  isOpen,
  onToggle,
  accentColor,
  children,
}: CollapsibleCardProps): React.ReactElement => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: accentColor }]} onPress={onToggle} activeOpacity={0.7}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={accentColor} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#666" />
    </View>

    {isOpen && <View style={styles.cardContent}>{children}</View>}
  </TouchableOpacity>
);

/**
 * Payment detail row component
 */
interface PaymentDetailRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const PaymentDetailRow = ({ label, value, isLast = false }: PaymentDetailRowProps): React.ReactElement => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 180,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  totalSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginBottom: 12,
  },
  totalLabelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalAmountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderLeftWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  cardContent: {
    marginTop: 16,
    gap: 0,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    marginBottom: 4,
  },
  detailRowBorder: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
    flex: 1,
    paddingRight: 12,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  payButtonGradient: {
    borderRadius: 10,
  },
  payButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  securityText: {
    textAlign: "center",
    fontSize: 13,
    color: "#9333ea",
    fontWeight: "500",
    marginTop: 8,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    marginBottom: 12,
  },
  priceSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    paddingRight: 12,
  },
  priceSectionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "right",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginTop: 12,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "right",
  },
  flightType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 12,
    marginTop: 8,
  },
  flightTimelineRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: "center",
    width: 12,
    marginTop: 2,
  },
  timelineConnector: {
    width: 1,
    flex: 1,
    backgroundColor: "#ddd",
    marginTop: 4,
    marginBottom: 4,
  },
  flightTimelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  flightDateTime: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  flightLocation: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  flightCity: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  flightDuration: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  flightNumber: {
    fontSize: 12,
    color: "#666",
  },
});

export default PaymentInfoScreen;
