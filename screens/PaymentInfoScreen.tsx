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
import { SafeAreaView } from "react-native-safe-area-context";

type PaymentInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PaymentInfo">;
interface Props {
  navigation: PaymentInfoScreenNavigationProp;
}

const PaymentInfoScreen = ({ navigation }: Props): React.ReactElement => {
  const route = useRoute<RouteProp<RootStackParamList, "PaymentInfo">>();
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

  const outboundPricePerPassenger = getSeatClassPrice(flight as any, selectedSeatClassId);
  const returnPricePerPassenger = getSeatClassPrice(returnFlight as any, selectedReturnSeatClassId);
  const outboundTotal = outboundPricePerPassenger * passengerCount;
  const returnTotal = returnPricePerPassenger * passengerCount;
  const grandTotal = outboundTotal + returnTotal;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleProceedToPayment = () => {
    // Pass booking payload to PaymentMethod so it can create the BookingOrder after payment
    navigation.navigate("PaymentMethod", {
      bookingPayload: {
        flight,
        passengers: passengerList ?? passengerCount,
        contact,
        selectedSeatClassId,
        selectedReturnSeatClassId,
        departDate,
        returnDate,
        tripType,
        grandTotal,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PaymentHeader title="Payment confirmation" currentStep={3} totalSteps={4} showBackButton={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Total Amount Section - Gradient Background */}
        <LinearGradient
          colors={["#0070BB", "#0070BB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalAmountCard}
        >
          <Text style={styles.totalAmountLabel}>Tổng tiền thanh toán</Text>
          <Text style={styles.totalAmount}>{formatPrice(grandTotal)}</Text>
        </LinearGradient>

        {/* Flight Info Card */}
        <CollapsibleCard
          icon="airplane"
          title="Thông tin chuyến bay"
          isOpen={showFlightInfo}
          onToggle={() => setShowFlightInfo(!showFlightInfo)}
          accentColor="#9333ea"
        >
          <PaymentDetailRow label="Flight Number" value={flight?.flightNumber ?? "-"} />
          <PaymentDetailRow
            label="Khởi hành"
            value={flight?.departureTime ? new Date(flight.departureTime).toLocaleString() : "-"}
          />
          <PaymentDetailRow
            label="Đến nơi"
            value={flight?.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "-"}
          />
          <PaymentDetailRow
            label="Từ"
            value={
              params?.fromAirport
                ? `${params.fromAirport.code} (${params.fromAirport.name})`
                : flight?.fromAirportId ?? "-"
            }
          />
          <PaymentDetailRow
            label="Đến"
            value={
              params?.toAirport ? `${params.toAirport.code} (${params.toAirport.name})` : flight?.toAirportId ?? "-"
            }
            isLast
          />
        </CollapsibleCard>

        {/* Price Details Card */}
        <CollapsibleCard
          icon="cash"
          title="Chi tiết giá"
          isOpen={showPriceDetails}
          onToggle={() => setShowPriceDetails(!showPriceDetails)}
          accentColor="#6366f1"
        >
          <PaymentDetailRow label="Giá vé (1 hành khách) - Chiều đi" value={formatPrice(outboundPricePerPassenger)} />
          {tripType === "roundTrip" && (
            <PaymentDetailRow label="Giá vé (1 hành khách) - Chiều về" value={formatPrice(returnPricePerPassenger)} />
          )}
          <PaymentDetailRow label="Số hành khách" value={`${passengerCount}`} />
          <PaymentDetailRow label="Tổng (chiều đi)" value={formatPrice(outboundTotal)} />
          {tripType === "roundTrip" && <PaymentDetailRow label="Tổng (chiều về)" value={formatPrice(returnTotal)} />}
          <PaymentDetailRow label="Tổng cộng" value={formatPrice(grandTotal)} isLast />
        </CollapsibleCard>

        <CollapsibleCard
          icon="account-multiple"
          title="Thông tin hành khách"
          isOpen={showPassengerInfo}
          onToggle={() => setShowPassengerInfo(!showPassengerInfo)}
          accentColor="#a855f7"
        >
          {passengerList && passengerList.length > 0 ? (
            passengerList.map((p: any, idx: number) => (
              <PaymentDetailRow key={idx} label={`Hành khách ${idx + 1}`} value={`${p.lastName} ${p.firstName}`} />
            ))
          ) : (
            <PaymentDetailRow label="Số hành khách" value={`${passengerCount}`} />
          )}
          <PaymentDetailRow label="Email liên hệ" value={contact?.email ?? "-"} />
          <PaymentDetailRow label="SĐT liên hệ" value={contact?.phone ?? "-"} isLast />
        </CollapsibleCard>

        {/* Total Amount Card */}
        <LinearGradient
          colors={["#0070BB", "#0070BB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalAmountCard}
        >
          <Text style={styles.totalAmountLabel}>Tổng tiền thanh toán</Text>
          <Text style={styles.totalAmount}>{formatPrice(grandTotal)}</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#0070BB", "#0070BB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButtonGradient}
        >
          <TouchableOpacity style={styles.payButton} onPress={handleProceedToPayment} activeOpacity={0.8}>
            <Text style={styles.payButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
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
      <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#9333ea" />
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
    backgroundColor: "#f8f7ff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  totalAmountCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 10,
  },
  totalAmountLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fafaf9",
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  cardContent: {
    marginTop: 16,
    gap: 0,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  payButtonGradient: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 14,
    elevation: 10,
  },
  payButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
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
});

export default PaymentInfoScreen;
