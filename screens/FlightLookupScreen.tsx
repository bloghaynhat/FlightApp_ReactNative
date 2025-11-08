import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import apiClient from '../apis/apiClient'
import Ticket from '../components/Payment/Ticket'

const FlightLookupScreen: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [bookingPassengerId, setBookingPassengerId] = useState('')
    const [bpResults, setBpResults] = useState<any[]>([])

    // Only allow lookup by bookingPassenger id
    const searchByBookingPassenger = async () => {
        setError(null)
        setLoading(true)
        setBpResults([])
        try {
            const id = bookingPassengerId.trim()
            if (!id) {
                setError('Vui lòng nhập mã vé (ví dụ BP123)')
                setLoading(false)
                return
            }
            const resp = await apiClient.get(`/bookingPassengers?id=${encodeURIComponent(id)}`)
            const bps: any[] = Array.isArray(resp.data) ? resp.data : []
            if (bps.length === 0) {
                setError('Không tìm thấy mã vé')
                setLoading(false)
                return
            }

            const tickets: any[] = []
            for (const bp of bps) {
                // fetch segment
                const segResp = await apiClient.get(`/bookingSegments/${bp.bookingSegmentId}`).then(r => r.data).catch(() => null)
                const seg = segResp

                // fetch booking order
                const boResp = seg ? await apiClient.get(`/bookingOrders/${seg.bookingOrderId}`).then(r => r.data).catch(() => null) : null
                const booking = boResp || {}

                // passenger
                let passenger = null
                if (bp.passengerId) {
                    passenger = await apiClient.get(`/passengers/${bp.passengerId}`).then(r => r.data).catch(() => null)
                } else {
                    passenger = { firstName: bp.passengerFirst ?? '', lastName: bp.passengerLast ?? '' }
                }

                // seat class
                const sc = seg?.seatClassId ? await apiClient.get(`/seatClasses/${seg.seatClassId}`).then(r => r.data).catch(() => null) : null

                // flight
                let flight = null
                if (seg?.flightId) flight = await apiClient.get(`/flights/${seg.flightId}`).then(r => r.data).catch(() => null)
                else if (sc?.flightId) flight = await apiClient.get(`/flights/${sc.flightId}`).then(r => r.data).catch(() => null)

                // airports
                let fromAirport = null
                let toAirport = null
                if (flight) {
                    fromAirport = await apiClient.get(`/airports/${flight.fromAirportId}`).then(r => r.data).catch(() => null)
                    toAirport = await apiClient.get(`/airports/${flight.toAirportId}`).then(r => r.data).catch(() => null)
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
                }
                tickets.push(ticket)
            }

            setBpResults(tickets)
        } catch (err: any) {
            console.warn('BP lookup failed', err)
            setError('Tìm mã vé thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ImageBackground source={require('../assets/lookup.png')} style={{ flex: 1 }} imageStyle={{ resizeMode: 'cover' }}>
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Text style={styles.title}>Tra cứu mã vé</Text>

                <Text style={{ marginBottom: 6, color: '#f3f4f6' }}>Nhập mã vé (bookingPassenger.id) để tra cứu vé. Ví dụ: BP01</Text>
                <TextInput placeholder="Mã vé (VD: BP01)" placeholderTextColor="#d1d5db" style={styles.input} value={bookingPassengerId} onChangeText={setBookingPassengerId} />
                <TouchableOpacity style={[styles.button, { backgroundColor: '#059669' }]} onPress={searchByBookingPassenger} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tìm theo mã vé</Text>}
                </TouchableOpacity>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {bpResults && bpResults.length > 0 ? (
                    <FlatList
                        data={bpResults}
                        keyExtractor={(item, idx) => String(item.bp?.id ?? idx)}
                        renderItem={({ item }) => {
                            const bp = item.bp
                            const seg = item.seg
                            const flight = item.flight
                            const passenger = item.passenger
                            const seatClass = item.seatClass
                            const fromAirport = item.fromAirport
                            const toAirport = item.toAirport
                            const passengerName = passenger ? `${passenger.lastName ?? ''} ${passenger.firstName ?? ''}`.trim() : '-'
                            const dep = flight?.departureTime ?? ''
                            const time = dep ? new Date(dep).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                            return (
                                <Ticket
                                    key={bp.id}
                                    fromCode={fromAirport?.code ?? flight?.fromAirportId ?? '---'}
                                    fromName={fromAirport?.city ?? fromAirport?.name}
                                    toCode={toAirport?.code ?? flight?.toAirportId ?? '---'}
                                    toName={toAirport?.city ?? toAirport?.name}
                                    passengerName={passengerName}
                                    flightNumber={flight?.flightNumber ?? ''}
                                    date={dep}
                                    time={time}
                                    seat={bp.seatNumber ?? ''}
                                    bookingCode={String(bp.id)}
                                    seatClass={seatClass?.className ?? ''}
                                />
                            )
                        }}
                    />
                ) : (
                    <View style={styles.empty}><Text style={styles.emptyText}>{loading ? 'Đang tìm...' : 'Nhập mã vé để tra cứu'}</Text></View>
                )}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
    container: { flex: 1, padding: 16, backgroundColor: 'transparent' },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#fff' },
    input: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
    button: { backgroundColor: '#0066cc', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    buttonText: { color: '#fff', fontWeight: '700' },
    card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
    flight: { fontSize: 16, fontWeight: '800' },
    status: { marginLeft: 8, color: '#6b7280' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    detail: { color: '#374151', marginTop: 6 },
    empty: { padding: 24, alignItems: 'center' },
    emptyText: { color: '#e5e7eb' },
    error: { color: 'crimson', marginBottom: 8 },
})

export default FlightLookupScreen
