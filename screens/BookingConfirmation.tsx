import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native"
import { type RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import PaymentHeader from "../components/Payment/PaymentHeader"
import { useState, useRef } from "react"

type RootStackParamList = {
    BookingConfirmation: { booking: any; segments?: any[]; bookingPassengers?: any[]; passengers?: any[] }
}

type BookingConfirmationRouteProp = RouteProp<RootStackParamList, "BookingConfirmation">

const BookingConfirmation: React.FC = () => {
    const route = useRoute<BookingConfirmationRouteProp>()
    const navigation = useNavigation()
    const { booking, segments, bookingPassengers, passengers } = route.params

    const [isAnimating, setIsAnimating] = useState(false)
    const planePosition = useRef(new Animated.Value(-100)).current

    const handleNavigateHome = () => {
        setIsAnimating(true)
        Animated.timing(planePosition, {
            toValue: 1000,
            duration: 1500,
            useNativeDriver: true,
        }).start(() => {
            navigation.navigate("MainTabs" as any, { screen: "Home" })
        })
    }

    return (
        <>
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
                <PaymentHeader title="Thanh toán" currentStep={4} totalSteps={4} />

                <View style={styles.successHeader}>
                    <View style={styles.successIcon}>
                        <MaterialCommunityIcons name="check-circle" size={56} color="#fff" />
                    </View>
                    <Text style={styles.successTitle}>Đặt vé thành công!</Text>
                    <Text style={styles.successSubtitle}>Vé máy bay của bạn đã được xác nhận</Text>
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
                        <Text style={styles.summaryLabel}>Tổng tiền</Text>
                        <Text style={styles.summaryValue}>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(booking.totalPrice)}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <MaterialCommunityIcons name="calendar" size={24} color="#0066cc" />
                        <Text style={styles.summaryLabel}>Ngày đặt</Text>
                        <Text style={styles.summaryValue}>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <MaterialCommunityIcons name="email" size={24} color="#0066cc" />
                        <Text style={styles.summaryLabel}>Email</Text>
                        <Text style={styles.summaryValueSmall}>{booking.emailContact}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <MaterialCommunityIcons name="phone" size={24} color="#0066cc" />
                        <Text style={styles.summaryLabel}>Điện thoại</Text>
                        <Text style={styles.summaryValue}>{booking.phoneContact}</Text>
                    </View>
                </View>

                {segments && segments.length > 0 && (
                    <View style={styles.segmentsSection}>
                        <Text style={styles.sectionTitle}>Chi tiết chuyến bay</Text>
                        {segments.map((segment: any, index: number) => (
                            <View key={segment.id} style={styles.segmentCard}>
                                <View style={styles.segmentHeader}>
                                    <View style={styles.segmentBadge}>
                                        <Text style={styles.segmentBadgeText}>Chuyến {index + 1}</Text>
                                    </View>
                                    <MaterialCommunityIcons name="airplane" size={20} color="#0066cc" />
                                </View>

                                <View style={styles.segmentDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Hạng ghế:</Text>
                                        <Text style={styles.detailValue}>{segment.seatClassId}</Text>
                                    </View>
                                    {bookingPassengers && bookingPassengers.length > 0 ? (
                                        (bookingPassengers.filter((bp: any) => bp.bookingSegmentId === segment.id) || []).map((bp: any) => {
                                            const passenger = passengers?.find((p: any) => p.id === bp.passengerId)
                                            const name = passenger
                                                ? `${passenger.lastName ?? ""} ${passenger.firstName ?? ""}`.trim()
                                                : `${bp.passengerLast ?? ""} ${bp.passengerFirst ?? ""}`.trim()
                                            return (
                                                <View key={bp.id} style={styles.detailRow}>
                                                    <Text style={styles.detailLabel}>Hành khách:</Text>
                                                    <Text style={styles.detailValue}>{name || "-"}</Text>
                                                </View>
                                            )
                                        })
                                    ) : (
                                        segment.passengerName && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Hành khách:</Text>
                                                <Text style={styles.detailValue}>{segment.passengerName}</Text>
                                            </View>
                                        )
                                    )}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Số ghế:</Text>
                                        <Text style={styles.detailValue}>{segment.numSeats}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Trạng thái:</Text>
                                        <View style={[styles.statusBadge, segment.status === "confirmed" && styles.statusBadgeConfirmed]}>
                                            <Text style={styles.statusText}>{segment.status}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
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
                        <Text style={styles.buttonText}>Về trang chủ</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
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
        borderLeftWidth: 4,
        borderLeftColor: "#0066cc",
    },
    segmentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
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
    segmentDetails: {
        gap: 8,
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
})

export default BookingConfirmation
