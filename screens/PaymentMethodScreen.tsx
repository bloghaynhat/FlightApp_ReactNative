import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, type RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { RootStackParamList } from "../types/types";
import apiClient from "../apis/apiClient";
import PaymentHeader from "../components/Payment/PaymentHeader";
import { SafeAreaView } from "react-native-safe-area-context";

type PaymentMethodRouteProp = RouteProp<RootStackParamList, "PaymentMethod">;

interface PaymentMethodOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "momo",
    label: "Momo",
    icon: "wallet-outline",
    description: "Momo E-wallet",
    color: "#FF6B35",
  },
  {
    id: "vnpay",
    label: "VNPay",
    icon: "credit-card",
    description: "Bank Card",
    color: "#0066CC",
  },
  {
    id: "credit_card",
    label: "Credit Card",
    icon: "card-outline",
    description: "Visa, Mastercard",
    color: "#1E40AF",
  },
];

const PaymentMethodScreen: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PaymentMethodRouteProp>();
  const bookingPayload = route.params?.bookingPayload;

  const genConfirmationCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));

      const confirmationCode = genConfirmationCode();
      const bookingOrder = {
        id: `BO${Date.now()}`,
        confirmationCode,
        totalPrice: bookingPayload?.grandTotal ?? 0,
        bookingDate: new Date().toISOString(),
        emailContact: bookingPayload?.contact?.email ?? "",
        phoneContact: bookingPayload?.contact?.phone ?? "",
        paymentMethod,
        status: "Confirmed",
      };

      const resp = await apiClient.post("/bookingOrders", bookingOrder);

      if (resp.status === 201) {
        const created = resp.data;

        // Normalize passengers into an array of passenger objects (or placeholders)
        const passengersArray = Array.isArray(bookingPayload?.passengers)
          ? bookingPayload.passengers
          : Array.from({ length: bookingPayload?.passengers || 1 }).map((_, i) => ({ firstName: `Passenger${i + 1}` }));

        // --- AVAILABILITY CHECK ---
        const checkSeatAvailability = async (seatClassId: string, neededSeats: number) => {
          try {
            const scResp = await apiClient.get(`/seatClasses/${seatClassId}`);
            const seatClass = scResp.data;
            if (!seatClass) return { ok: false, available: 0 };
            const segResp = await apiClient.get(`/bookingSegments?seatClassId=${seatClassId}`);
            const existingSegments = Array.isArray(segResp.data) ? segResp.data : [];
            const reserved = existingSegments.reduce((sum: number, s: any) => sum + (s.numSeats || 0), 0);
            const available = (seatClass.totalSeats || 0) - reserved;
            return { ok: available >= neededSeats, available };
          } catch (err) {
            console.warn("Seat availability check failed", err);
            return { ok: true, available: Infinity };
          }
        };

        const needed = passengersArray.length;
        if (bookingPayload?.selectedSeatClassId) {
          const result = await checkSeatAvailability(bookingPayload.selectedSeatClassId, needed);
          if (!result.ok) {
            setLoading(false);
            Alert.alert(
              "Insufficient Seats",
              `Only ${result.available} seats available in class ${bookingPayload.selectedSeatClassId}. Please choose another class or reduce the number of passengers.`
            );
            return;
          }
        }
        if (bookingPayload?.selectedReturnSeatClassId) {
          const result = await checkSeatAvailability(bookingPayload.selectedReturnSeatClassId, needed);
          if (!result.ok) {
            setLoading(false);
            Alert.alert(
              "Insufficient Seats",
              `Only ${result.available} seats available in class ${bookingPayload.selectedReturnSeatClassId} (return flight). Please choose another class or reduce the number of passengers.`
            );
            return;
          }
        }

        // Create bookingSegments per leg (one segment per leg, numSeats = passengerCount)
        const segmentsCreated: any[] = [];
        const outboundFlightId = bookingPayload?.outboundFlight?.id ?? bookingPayload?.flight?.id;
        const returnFlightId = bookingPayload?.returnFlight?.id;

        if (bookingPayload?.selectedSeatClassId) {
          const segBody: any = {
            bookingOrderId: created.id,
            flightId: outboundFlightId,
            leg: "outbound",
            seatClassId: bookingPayload.selectedSeatClassId,
            numSeats: needed,
            status: "Confirmed",
          };
          const segResp = await apiClient.post("/bookingSegments", segBody);
          if (segResp.status === 201) segmentsCreated.push(segResp.data);
        }

        if (bookingPayload?.selectedReturnSeatClassId && returnFlightId) {
          const segBody: any = {
            bookingOrderId: created.id,
            flightId: returnFlightId,
            leg: "return",
            seatClassId: bookingPayload.selectedReturnSeatClassId,
            numSeats: needed,
            status: "Confirmed",
          };
          const segResp = await apiClient.post("/bookingSegments", segBody);
          if (segResp.status === 201) segmentsCreated.push(segResp.data);
        }

        // Create normalized passengers (POST /passengers if missing) and collect their ids
        const createdPassengers: any[] = [];
        for (let i = 0; i < passengersArray.length; i++) {
          const p = passengersArray[i];
          if (p?.id) {
            createdPassengers.push(p);
            continue;
          }
          const pBody = { firstName: p.firstName ?? "", lastName: p.lastName ?? "", birthDate: p.birthDate ?? null };
          const pResp = await apiClient.post("/passengers", pBody);
          if (pResp.status === 201) createdPassengers.push(pResp.data);
        }

        // Create bookingPassengers mapping entries for each segment × passenger
        const createdBookingPassengers: any[] = [];
        for (const seg of segmentsCreated) {
          for (let i = 0; i < createdPassengers.length; i++) {
            const p = createdPassengers[i];
            const bpBody = { bookingSegmentId: seg.id, passengerId: p.id, seatNumber: null };
            const bpResp = await apiClient.post("/bookingPassengers", bpBody);
            if (bpResp.status === 201) createdBookingPassengers.push(bpResp.data);
          }
        }

        setLoading(false);
        navigation.navigate("BookingConfirmation", {
          booking: created,
          segments: segmentsCreated,
          bookingPassengers: createdBookingPassengers,
          passengers: createdPassengers,
        });
        return;
      }
      setLoading(false);
      Alert.alert("Payment", `Payment successful. Confirmation code: ${confirmationCode}`);
      navigation.navigate("BookingConfirmation", { booking: resp.data, segments: [] });
    } catch (error) {
      setLoading(false);
      console.error("Create booking error", error);
      Alert.alert("Error", "Unable to create booking order. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <PaymentHeader title="Payment method" currentStep={4} totalSteps={4} showBackButton={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Select Payment Method</Text>
          <Text style={styles.subtitle}>Choose the payment method that suits you</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setPaymentMethod(method.id)}
              style={[styles.paymentMethodCard, paymentMethod === method.id && styles.paymentMethodCardActive]}
            >
              <View style={styles.paymentMethodContent}>
                <View style={[styles.iconContainer, { backgroundColor: method.color + "20" }]}>
                  <MaterialCommunityIcons name={method.icon as any} size={28} color={method.color} />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                <View style={[styles.radioButton, paymentMethod === method.id && styles.radioButtonActive]}>
                  {paymentMethod === method.id && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>{(bookingPayload?.grandTotal ?? 0).toLocaleString("vi-VN")} VND</Text>
          </View>
          <View style={styles.summaryDivider} />
          <Text style={styles.securityText}>🔒 100% Secure Payment</Text>
        </View>

        {/* Payment Button */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
          </View>
        ) : (
          <LinearGradient
            colors={["#0066CC", "#0052A3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.paymentButtonGradient}
          >
            <TouchableOpacity onPress={handleProceedToPayment} style={styles.paymentButton}>
              <MaterialCommunityIcons name="check-circle" size={20} color="white" />
              <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  paymentMethodsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentMethodCardActive: {
    borderColor: "#0066CC",
    backgroundColor: "#f0f7ff",
  },
  paymentMethodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: "#0066CC",
    backgroundColor: "#0066CC",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  summarySection: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0066CC",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  securityText: {
    fontSize: 12,
    color: "#10b981",
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  paymentButtonGradient: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  paymentButton: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});

export default PaymentMethodScreen;
