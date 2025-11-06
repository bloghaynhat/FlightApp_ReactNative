import React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, type RouteProp, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import type { RootStackParamList } from "../types/types"
import apiClient from "../apis/apiClient"
import PaymentHeader from "../components/Payment/PaymentHeader"

type PaymentMethodRouteProp = RouteProp<RootStackParamList, "PaymentMethod">

interface PaymentMethodOption {
  id: string
  label: string
  icon: string
  description: string
  color: string
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "momo",
    label: "Momo",
    icon: "wallet-outline",
    description: "Ví điện tử Momo",
    color: "#FF6B35",
  },
  {
    id: "vnpay",
    label: "VNPay",
    icon: "credit-card",
    description: "Thẻ ngân hàng",
    color: "#0066CC",
  },
  {
    id: "credit_card",
    label: "Thẻ tín dụng",
    icon: "card-outline",
    description: "Visa, Mastercard",
    color: "#1E40AF",
  },
]

const PaymentMethodScreen: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<PaymentMethodRouteProp>()
  const bookingPayload = route.params?.bookingPayload

  const genConfirmationCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

  const handleProceedToPayment = async () => {
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 1200))

      const confirmationCode = genConfirmationCode()
      const bookingOrder = {
        id: `BO${Date.now()}`,
        confirmationCode,
        totalPrice: bookingPayload?.grandTotal ?? 0,
        bookingDate: new Date().toISOString(),
        emailContact: bookingPayload?.contact?.email ?? "",
        phoneContact: bookingPayload?.contact?.phone ?? "",
        paymentMethod,
        status: "Confirmed",
      }

      const resp = await apiClient.post("/bookingOrders", bookingOrder)

      if (resp.status === 201) {
        const created = resp.data
        const segments = [] as any[]
        if (bookingPayload?.selectedSeatClassId) {
          segments.push({
            id: `BS${Date.now()}1`,
            bookingOrderId: created.id,
            seatClassId: bookingPayload.selectedSeatClassId,
            numSeats: Array.isArray(bookingPayload.passengers)
              ? bookingPayload.passengers.length
              : bookingPayload.passengers || 1,
            status: "Confirmed",
          })
        }
        if (bookingPayload?.selectedReturnSeatClassId) {
          segments.push({
            id: `BS${Date.now()}2`,
            bookingOrderId: created.id,
            seatClassId: bookingPayload.selectedReturnSeatClassId,
            numSeats: Array.isArray(bookingPayload.passengers)
              ? bookingPayload.passengers.length
              : bookingPayload.passengers || 1,
            status: "Confirmed",
          })
        }

        const createdSegments: any[] = []
        for (const seg of segments) {
          const segResp = await apiClient.post("/bookingSegments", seg)
          if (segResp.status === 201) createdSegments.push(segResp.data)
        }
        setLoading(false)
        navigation.navigate("BookingConfirmation", { booking: created, segments: createdSegments })
        return
      }
      setLoading(false)
      Alert.alert("Thanh toán", `Thanh toán thành công. Mã xác nhận: ${confirmationCode}`)
      navigation.navigate("BookingConfirmation", { booking: resp.data, segments: [] })
    } catch (error) {
      setLoading(false)
      console.error("Create booking error", error)
      Alert.alert("Lỗi", "Không thể tạo BookingOrder. Vui lòng thử lại.")
    }
  }

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#1f2937" />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <PaymentHeader title="Thanh toán" currentStep={3} totalSteps={4} />

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Chọn phương thức thanh toán</Text>
          <Text style={styles.subtitle}>Lựa chọn cách thanh toán phù hợp cho bạn</Text>
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
            <Text style={styles.summaryLabel}>Tổng tiền:</Text>
            <Text style={styles.summaryValue}>{(bookingPayload?.grandTotal ?? 0).toLocaleString("vi-VN")} VND</Text>
          </View>
          <View style={styles.summaryDivider} />
          <Text style={styles.securityText}>🔒 Thanh toán được bảo mật 100%</Text>
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
              <Text style={styles.paymentButtonText}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topNav: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
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
})

export default PaymentMethodScreen
