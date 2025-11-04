import React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { RootStackParamList } from "../types/types"
import type { StackNavigationProp } from "@react-navigation/stack"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import PaymentHeader from "../components/Payment/PaymentHeader"

type PaymentInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, "PaymentInfo">

interface Props {
  navigation: PaymentInfoScreenNavigationProp
}

const PaymentInfoScreen = ({ navigation }: Props): React.ReactElement => {
  const [showFlightInfo, setShowFlightInfo] = useState(false)
  const [showPriceDetails, setShowPriceDetails] = useState(false)
  const [showPassengerInfo, setShowPassengerInfo] = useState(false)

  const handleProceedToPayment = (): void => {
    navigation.navigate("PaymentMethod")
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <PaymentHeader title="Thanh toán" currentStep={0} totalSteps={4} />

        {/* Total Amount Section - Gradient Background */}
        <LinearGradient
          colors={["#9333ea", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalAmountCard}
        >
          <Text style={styles.totalAmountLabel}>Tổng tiền thanh toán</Text>
          <Text style={styles.totalAmount}>3,662,000 VND</Text>
        </LinearGradient>

        {/* Flight Info Card */}
        <CollapsibleCard
          icon="airplane"
          title="Thông tin chuyến bay"
          isOpen={showFlightInfo}
          onToggle={() => setShowFlightInfo(!showFlightInfo)}
          accentColor="#9333ea"
        >
          <PaymentDetailRow label="Flight Number" value="VN123" />
          <PaymentDetailRow label="Khởi hành" value="2025-11-12 10:00" />
          <PaymentDetailRow label="Đến nơi" value="2025-11-12 12:00" />
          <PaymentDetailRow label="Từ" value="TP HCM (SGN)" />
          <PaymentDetailRow label="Đến" value="Hà Nội (HAN)" isLast />
        </CollapsibleCard>

        {/* Price Details Card */}
        <CollapsibleCard
          icon="cash"
          title="Chi tiết giá"
          isOpen={showPriceDetails}
          onToggle={() => setShowPriceDetails(!showPriceDetails)}
          accentColor="#6366f1"
        >
          <PaymentDetailRow label="Giá vé" value="3,662,000 VND" />
          <PaymentDetailRow label="Số ghế" value="1" />
          <PaymentDetailRow label="Số hiệu ghế" value="12A" isLast />
        </CollapsibleCard>

        {/* Passenger Info Card */}
        <CollapsibleCard
          icon="account-multiple"
          title="Thông tin hành khách"
          isOpen={showPassengerInfo}
          onToggle={() => setShowPassengerInfo(!showPassengerInfo)}
          accentColor="#a855f7"
        >
          <PaymentDetailRow label="Tên" value="Nguyễn Văn A" />
          <PaymentDetailRow label="Email" value="nguyen@domain.com" />
          <PaymentDetailRow label="Điện thoại" value="0901234567" isLast />
        </CollapsibleCard>

        {/* Payment Button - Gradient */}
        <LinearGradient
          colors={["#9333ea", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButtonGradient}
        >
          <TouchableOpacity style={styles.payButton} onPress={handleProceedToPayment} activeOpacity={0.8}>
            <Text style={styles.payButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Security Info */}
        <Text style={styles.securityText}>🔒 Thanh toán của bạn được bảo mật 100%</Text>
      </ScrollView>
    </View>
  )
}

/**
 * Collapsible card component for payment details
 */
interface CollapsibleCardProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
  title: string
  isOpen: boolean
  onToggle: () => void
  accentColor: string
  children: React.ReactNode
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
)

/**
 * Payment detail row component
 */
interface PaymentDetailRowProps {
  label: string
  value: string
  isLast?: boolean
}

const PaymentDetailRow = ({ label, value, isLast = false }: PaymentDetailRowProps): React.ReactElement => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
)

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
    marginTop: 20,
    marginBottom: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  payButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
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
})

export default PaymentInfoScreen
