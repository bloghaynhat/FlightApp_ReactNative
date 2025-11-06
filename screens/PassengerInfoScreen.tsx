import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { FlightResult } from "../apis/flightService";
import type { Airport } from "../types";
import type { RootStackParamList, PassengerData, ContactData } from "../types/types";

type PassengerInfoScreenRouteProp = RouteProp<RootStackParamList, "PassengerInfo">;
type PassengerInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PassengerInfo">;

// Use shared types
// PassengerData and ContactData are defined in ../types/types

const PassengerInfoScreen: React.FC = () => {
  const route = useRoute<PassengerInfoScreenRouteProp>();
  const navigation = useNavigation<PassengerInfoScreenNavigationProp>();
  const { flight, outboundFlight, returnFlight, fromAirport, toAirport, departDate, returnDate, passengers, tripType } =
    route.params;

  // Get the appropriate flight(s) based on trip type
  const isRoundTrip = tripType === "roundTrip";
  const mainFlight = isRoundTrip ? outboundFlight : flight;

  // Initialize passenger data array
  const [passengerList, setPassengerList] = useState<PassengerData[]>(
    Array.from({ length: passengers }, () => ({
      firstName: "",
      lastName: "",
      birthDate: "",
    }))
  );

  const [contact, setContact] = useState<ContactData>({
    email: "",
    phone: "",
  });

  const [selectedSeatClassId, setSelectedSeatClassId] = useState<string>(mainFlight?.seatClasses?.[0]?.id || "");

  const [selectedReturnSeatClassId, setSelectedReturnSeatClassId] = useState<string>(
    isRoundTrip && returnFlight?.seatClasses?.[0]?.id ? returnFlight.seatClasses[0].id : ""
  );

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    const newList = [...passengerList];
    newList[index][field] = value;
    setPassengerList(newList);
  };

  const validateForm = (): boolean => {
    // Validate passengers
    for (let i = 0; i < passengerList.length; i++) {
      const passenger = passengerList[i];
      if (!passenger.firstName.trim() || !passenger.lastName.trim() || !passenger.birthDate.trim()) {
        Alert.alert("Lỗi", `Vui lòng điền đầy đủ thông tin hành khách ${i + 1}`);
        return false;
      }
    }

    // Validate contact
    if (!contact.email.trim() || !contact.phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin liên hệ");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return false;
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(contact.phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ (10-11 số)");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    // Now PassengerInfo is in the same HomeStack as PaymentInfo,
    // so we can navigate directly by route name and pass params.
    navigation.navigate("PaymentInfo", {
      flight,
      passengers: passengerList,
      contact,
      selectedSeatClassId,
      returnFlight,
      selectedReturnSeatClassId,
      departDate,
      returnDate,
      tripType,
    } as any);
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const selectedSeatClass = mainFlight?.seatClasses?.find((sc) => sc.id === selectedSeatClassId);
  const selectedReturnSeatClass = isRoundTrip
    ? returnFlight?.seatClasses?.find((sc) => sc.id === selectedReturnSeatClassId)
    : null;

  const outboundPrice = selectedSeatClass ? selectedSeatClass.price * passengers : 0;
  const returnPrice = selectedReturnSeatClass ? selectedReturnSeatClass.price * passengers : 0;
  const totalPrice = outboundPrice + returnPrice;

  if (!mainFlight) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Không tìm thấy thông tin chuyến bay</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin hành khách</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Flight Summary - Outbound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isRoundTrip ? "Chuyến bay chiều đi" : "Thông tin chuyến bay"}</Text>
          <View style={styles.flightSummary}>
            <Text style={styles.flightRoute}>
              {fromAirport.code} → {toAirport.code}
            </Text>
            <Text style={styles.flightDetails}>
              {mainFlight.flightNumber} • {mainFlight.airline?.name}
            </Text>
            <Text style={styles.flightDate}>{new Date(departDate).toLocaleDateString("vi-VN")}</Text>
          </View>
        </View>

        {/* Flight Summary - Return (for RoundTrip) */}
        {isRoundTrip && returnFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chuyến bay chiều về</Text>
            <View style={styles.flightSummary}>
              <Text style={styles.flightRoute}>
                {toAirport.code} → {fromAirport.code}
              </Text>
              <Text style={styles.flightDetails}>
                {returnFlight.flightNumber} • {returnFlight.airline?.name}
              </Text>
              <Text style={styles.flightDate}>
                {returnDate ? new Date(returnDate).toLocaleDateString("vi-VN") : ""}
              </Text>
            </View>
          </View>
        )}

        {/* Seat Class Selection - Outbound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isRoundTrip ? "Chọn hạng vé chiều đi" : "Chọn hạng vé"}</Text>
          {mainFlight.seatClasses?.map((seatClass) => (
            <TouchableOpacity
              key={seatClass.id}
              style={[styles.seatClassOption, selectedSeatClassId === seatClass.id && styles.seatClassSelected]}
              onPress={() => setSelectedSeatClassId(seatClass.id)}
            >
              <View>
                <Text style={styles.seatClassName}>{seatClass.className}</Text>
                <Text style={styles.seatClassPrice}>{formatPrice(seatClass.price)}</Text>
              </View>
              {selectedSeatClassId === seatClass.id && <Ionicons name="checkmark-circle" size={24} color="#0066cc" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Seat Class Selection - Return (for RoundTrip) */}
        {isRoundTrip && returnFlight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn hạng vé chiều về</Text>
            {returnFlight.seatClasses?.map((seatClass) => (
              <TouchableOpacity
                key={seatClass.id}
                style={[styles.seatClassOption, selectedReturnSeatClassId === seatClass.id && styles.seatClassSelected]}
                onPress={() => setSelectedReturnSeatClassId(seatClass.id)}
              >
                <View>
                  <Text style={styles.seatClassName}>{seatClass.className}</Text>
                  <Text style={styles.seatClassPrice}>{formatPrice(seatClass.price)}</Text>
                </View>
                {selectedReturnSeatClassId === seatClass.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0066cc" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Passengers Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hành khách</Text>
          {passengerList.map((passenger, index) => (
            <View key={index} style={styles.passengerCard}>
              <Text style={styles.passengerLabel}>Hành khách {index + 1}</Text>

              <TextInput
                style={styles.input}
                placeholder="Họ và tên đệm"
                value={passenger.lastName}
                onChangeText={(text) => updatePassenger(index, "lastName", text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Tên"
                value={passenger.firstName}
                onChangeText={(text) => updatePassenger(index, "firstName", text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Ngày sinh (DD/MM/YYYY)"
                value={passenger.birthDate}
                onChangeText={(text) => updatePassenger(index, "birthDate", text)}
              />
            </View>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          <View style={styles.contactCard}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={contact.email}
              onChangeText={(text) => setContact({ ...contact, email: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={contact.phone}
              onChangeText={(text) => setContact({ ...contact, phone: text })}
            />
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết giá</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {passengers} x {selectedSeatClass?.className}
            </Text>
            <Text style={styles.priceValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  flightSummary: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  flightRoute: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  flightDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  flightDate: {
    fontSize: 12,
    color: "#999",
  },
  seatClassOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  seatClassSelected: {
    borderColor: "#0066cc",
    backgroundColor: "#f0f8ff",
  },
  seatClassName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  seatClassPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0066cc",
  },
  passengerCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  passengerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  contactCard: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: "#000",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6b35",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  continueButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PassengerInfoScreen;
