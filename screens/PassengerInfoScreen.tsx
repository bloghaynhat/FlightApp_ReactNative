import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentHeader from "../components/Payment/PaymentHeader";
import PriceSummary from "../components/PassengerInfo/PriceSummary";
import PassengerForm from "../components/PassengerInfo/PassengerForm";
import ContactForm from "../components/PassengerInfo/ContactForm";
import DatePickerModal from "../components/PassengerInfo/DatePickerModal";
import PriceDetailModal from "../components/PassengerInfo/PriceDetailModal";
import type { RootStackParamList, PassengerData, ContactData } from "../types/types";

type PassengerInfoScreenRouteProp = RouteProp<RootStackParamList, "PassengerInfo">;
type PassengerInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PassengerInfo">;

// Use shared types
// PassengerData and ContactData are defined in ../types/types

const PassengerInfoScreen: React.FC = () => {
  const route = useRoute<PassengerInfoScreenRouteProp>();
  const navigation = useNavigation<PassengerInfoScreenNavigationProp>();
  const {
    flight,
    outboundFlight,
    returnFlight,
    fromAirport,
    toAirport,
    departDate,
    returnDate,
    passengers,
    tripType,
    selectedSeatClassId: initialSelectedSeatClassId,
    selectedReturnSeatClassId: initialSelectedReturnSeatClassId,
  } = route.params;

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

  // State for Calendar Modal
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState<number | null>(null);
  const [showPriceDetail, setShowPriceDetail] = useState(false);

  // Use seat class IDs from route params (already selected in SearchResult screen)
  const selectedSeatClassId = initialSelectedSeatClassId || mainFlight?.seatClasses?.[0]?.id || "";
  const selectedReturnSeatClassId =
    initialSelectedReturnSeatClassId ||
    (isRoundTrip && returnFlight?.seatClasses?.[0]?.id ? returnFlight.seatClasses[0].id : "");

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    const newList = [...passengerList];
    newList[index][field] = value;
    setPassengerList(newList);
  };

  const openCalendar = (index: number) => {
    setSelectedPassengerIndex(index);
    setShowCalendar(true);
  };

  const handleDateSelect = (dateString: string) => {
    if (selectedPassengerIndex !== null) {
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = dateString.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      updatePassenger(selectedPassengerIndex, "birthDate", formattedDate);
    }
    setShowCalendar(false);
    setSelectedPassengerIndex(null);
  };

  const validateForm = (): boolean => {
    // Validate passengers
    for (let i = 0; i < passengerList.length; i++) {
      const passenger = passengerList[i];
      if (!passenger.firstName.trim() || !passenger.lastName.trim() || !passenger.birthDate.trim()) {
        Alert.alert("Error", `Please fill in all information for passenger ${i + 1}`);
        return false;
      }

      // Validate birth date format
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = passenger.birthDate.match(dateRegex);
      if (!match) {
        Alert.alert("Error", `Birth date for passenger ${i + 1} is invalid. Please enter in DD/MM/YYYY format`);
        return false;
      }

      const day = parseInt(match[1]);
      const month = parseInt(match[2]);
      const year = parseInt(match[3]);

      // Validate date ranges
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
        Alert.alert("Error", `Birth date for passenger ${i + 1} is invalid`);
        return false;
      }

      // Validate date is not in future
      const birthDate = new Date(year, month - 1, day);
      if (birthDate > new Date()) {
        Alert.alert("Error", `Birth date for passenger ${i + 1} cannot be in the future`);
        return false;
      }
    }

    // Validate contact
    if (!contact.email.trim() || !contact.phone.trim()) {
      Alert.alert("Error", "Please fill in all contact information");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      Alert.alert("Error", "Invalid email address");
      return false;
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(contact.phone)) {
      Alert.alert("Error", "Invalid phone number (10-11 digits)");
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
      // Ensure we pass the selected main flight (outbound) as `flight` so PaymentInfo
      // always receives the outbound flight regardless of how this screen was reached.
      flight: mainFlight,
      // Also forward airport objects so PaymentInfo can display friendly names/codes
      fromAirport,
      toAirport,
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

  const selectedSeatClass = mainFlight?.seatClasses?.find((sc) => sc.id === selectedSeatClassId);
  const selectedReturnSeatClass = isRoundTrip
    ? returnFlight?.seatClasses?.find((sc) => sc.id === selectedReturnSeatClassId)
    : null;

  const outboundPrice = selectedSeatClass ? selectedSeatClass.price * passengers : 0;
  const returnPrice = selectedReturnSeatClass ? selectedReturnSeatClass.price * passengers : 0;

  // Tính toán giá tổng bao gồm tất cả các phí
  const baseFare = outboundPrice + returnPrice;
  const systemAdminSurcharge = 220000; // Phụ thu hệ thống & quản trị
  const passengerServiceCharge = 50000; // Phí phục vụ hành khách nội địa
  const securityScreeningCharge = 10000; // Phí soi chiếu an ninh
  const vat = Math.round((baseFare + systemAdminSurcharge + passengerServiceCharge + securityScreeningCharge) * 0.1); // 8% VAT
  const totalPrice = baseFare + systemAdminSurcharge + passengerServiceCharge + securityScreeningCharge + vat;

  if (!mainFlight) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Flight information not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PaymentHeader title="Passenger details" currentStep={2} totalSteps={4} showBackButton={true} />

      <ScrollView style={styles.content}>
        {/* Price Summary */}
        <PriceSummary totalPrice={totalPrice} onShowDetail={() => setShowPriceDetail(true)} />

        {/* Passengers Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          {passengerList.map((passenger, index) => (
            <PassengerForm
              key={index}
              passenger={passenger}
              index={index}
              onUpdate={(field, value) => updatePassenger(index, field, value)}
              onOpenCalendar={() => openCalendar(index)}
            />
          ))}
        </View>

        {/* Contact Info */}
        <ContactForm contact={contact} onUpdate={(field, value) => setContact({ ...contact, [field]: value })} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <DatePickerModal visible={showCalendar} onClose={() => setShowCalendar(false)} onDateSelect={handleDateSelect} />

      {/* Price Detail Modal */}
      {mainFlight && selectedSeatClass && (
        <PriceDetailModal
          visible={showPriceDetail}
          onClose={() => setShowPriceDetail(false)}
          mainFlight={mainFlight}
          returnFlight={returnFlight}
          fromAirport={fromAirport}
          toAirport={toAirport}
          departDate={departDate}
          returnDate={returnDate}
          passengers={passengers}
          selectedSeatClass={selectedSeatClass}
          selectedReturnSeatClass={selectedReturnSeatClass || undefined}
          baseFare={baseFare}
          systemAdminSurcharge={systemAdminSurcharge}
          passengerServiceCharge={passengerServiceCharge}
          securityScreeningCharge={securityScreeningCharge}
          vat={vat}
          totalPrice={totalPrice}
          isRoundTrip={isRoundTrip}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
