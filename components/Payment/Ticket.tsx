import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

type TicketProps = {
    fromCode: string
    fromName?: string
    toCode: string
    toName?: string
    passengerName: string
    flightNumber?: string
    date?: string // ISO date
    time?: string // time string
    seat?: string
    gate?: string
    bookingCode?: string
    seatClass?: string
    onShare?: () => void
}

const Ticket: React.FC<TicketProps> = ({
    fromCode,
    fromName,
    toCode,
    toName,
    passengerName,
    flightNumber,
    date,
    time,
    seat,
    gate,
    bookingCode,
    seatClass,
    onShare,
}) => {
    const prettyDate = date ? new Date(date).toLocaleDateString("vi-VN") : ""

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.routeBlock}>
                    <Text style={styles.airportCode}>{fromCode}</Text>
                    <Text style={styles.city}>{fromName}</Text>
                </View>

                <View style={styles.arrowBlock}>
                    <Text style={styles.arrow}>→</Text>
                </View>

                <View style={styles.routeBlockRight}>
                    <Text style={styles.airportCode}>{toCode}</Text>
                    <Text style={styles.city}>{toName}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Hành khách</Text>
                    <Text style={styles.value}>{passengerName}</Text>
                </View>

                <View style={styles.infoCol}>
                    <Text style={styles.label}>Ngày</Text>
                    <Text style={styles.value}>{prettyDate}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Chuyến</Text>
                    <Text style={styles.value}>{flightNumber ?? `-`}</Text>
                </View>

                <View style={styles.infoCol}>
                    <Text style={styles.label}>Giờ</Text>
                    <Text style={styles.value}>{time ?? `-`}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Hạng</Text>
                    <Text style={styles.value}>{seatClass ?? `-`}</Text>
                </View>

                <View style={styles.infoCol}>
                    <Text style={styles.label}>Số ghế</Text>
                    <Text style={styles.value}>{seat ?? `-`}</Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View>
                    <Text style={styles.pnrLabel}>Mã đặt chỗ</Text>
                    <Text style={styles.pnr}>{bookingCode ?? `-`}</Text>
                </View>

                {onShare && (
                    <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                        <Text style={styles.shareText}>Chia sẻ</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    routeBlock: {
        flex: 1,
    },
    routeBlockRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    airportCode: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
    },
    city: {
        fontSize: 12,
        color: '#6b7280',
    },
    arrowBlock: {
        paddingHorizontal: 8,
    },
    arrow: {
        fontSize: 20,
        color: '#0066cc',
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoCol: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#6b7280',
    },
    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    pnrLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    pnr: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    shareButton: {
        backgroundColor: '#0066cc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    shareText: {
        color: '#fff',
        fontWeight: '700',
    },
})

export default Ticket
