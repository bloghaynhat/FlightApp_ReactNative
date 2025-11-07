import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import PaymentHeader from "../components/Payment/PaymentHeader";
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

  const formatBirthDate = (text: string, index: number) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Format as DD/MM/YYYY
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.substring(0, 2);
      if (cleaned.length >= 3) {
        formatted += "/" + cleaned.substring(2, 4);
        if (cleaned.length >= 5) {
          formatted += "/" + cleaned.substring(4, 8);
        }
      }
    }

    updatePassenger(index, "birthDate", formatted);
  };

  const validateForm = (): boolean => {
    // Validate passengers
    for (let i = 0; i < passengerList.length; i++) {
      const passenger = passengerList[i];
      if (!passenger.firstName.trim() || !passenger.lastName.trim() || !passenger.birthDate.trim()) {
        Alert.alert("Lỗi", `Vui lòng điền đầy đủ thông tin hành khách ${i + 1}`);
        return false;
      }

      // Validate birth date format
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = passenger.birthDate.match(dateRegex);
      if (!match) {
        Alert.alert("Lỗi", `Ngày sinh hành khách ${i + 1} không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY`);
        return false;
      }

      const day = parseInt(match[1]);
      const month = parseInt(match[2]);
      const year = parseInt(match[3]);

      // Validate date ranges
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
        Alert.alert("Lỗi", `Ngày sinh hành khách ${i + 1} không hợp lệ`);
        return false;
      }

      // Validate date is not in future
      const birthDate = new Date(year, month - 1, day);
      if (birthDate > new Date()) {
        Alert.alert("Lỗi", `Ngày sinh hành khách ${i + 1} không thể là ngày trong tương lai`);
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
      <PaymentHeader title="Passenger details" currentStep={2} totalSteps={4} showBackButton={true} />

      <ScrollView style={styles.content}>
        {/* Price Summary - Moved to top */}
        <View style={[styles.section, styles.firstSection]}>
          <View style={styles.totalContainer}>
            <View>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
              <Text style={styles.priceNote}>Price does not include add-on services</Text>
            </View>
            <TouchableOpacity style={styles.detailButton} onPress={() => setShowPriceDetail(true)}>
              <Text style={styles.detailText}>Details</Text>
              <Ionicons name="chevron-down-circle-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

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

              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Ngày sinh (DD/MM/YYYY)"
                  value={passenger.birthDate}
                  onChangeText={(text) => formatBirthDate(text, index)}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TouchableOpacity style={styles.calendarIconButton} onPress={() => openCalendar(index)}>
                  <Ionicons name="calendar-outline" size={20} color="#0066cc" />
                </TouchableOpacity>
              </View>
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
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Chọn ngày sinh</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day) => handleDateSelect(day.dateString)}
              maxDate={new Date().toISOString().split("T")[0]}
              minDate="1900-01-01"
              monthFormat={"MM/yyyy"}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#0066cc",
                selectedDayBackgroundColor: "#0066cc",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#0066cc",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#0066cc",
                selectedDotColor: "#ffffff",
                arrowColor: "#0066cc",
                monthTextColor: "#0066cc",
                indicatorColor: "#0066cc",
                textDayFontWeight: "400",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "600",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>
        </View>
      </Modal>

      {/* Price Detail Modal */}
      <Modal
        visible={showPriceDetail}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriceDetail(false)}
      >
        <View style={styles.priceModalOverlay}>
          <View style={styles.priceModalContainer}>
            <View style={styles.priceModalHeader}>
              <Text style={styles.priceModalTitle}>Flight details</Text>
              <TouchableOpacity onPress={() => setShowPriceDetail(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.priceModalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Route Summary */}
              <View style={styles.routeSummary}>
                <View style={styles.routePoint}>
                  <Text style={styles.routeCode}>{fromAirport?.code || "N/A"}</Text>
                  <Text style={styles.routeCity}>
                    {fromAirport?.city || "Unknown"}, {fromAirport?.country || "Unknown"}
                  </Text>
                </View>
                <View style={styles.routeArrowContainer}>
                  <View style={styles.routeIconWrapper}>
                    <View style={styles.dottedLine} />
                    <Ionicons name="airplane" size={20} color="#0066cc" style={styles.airplaneIcon} />
                  </View>
                  {isRoundTrip && (
                    <View style={styles.routeIconWrapper}>
                      <Ionicons
                        name="airplane"
                        size={20}
                        color="#0066cc"
                        style={[styles.airplaneIcon, styles.airplaneReturn]}
                      />
                      <View style={styles.dottedLine} />
                    </View>
                  )}
                </View>
                <View style={styles.routePoint}>
                  <Text style={styles.routeCode}>{toAirport?.code || "N/A"}</Text>
                  <Text style={styles.routeCity}>
                    {toAirport?.city || "Unknown"}, {toAirport?.country || "Unknown"}
                  </Text>
                </View>
              </View>

              {/* Selected Flights Section */}
              <View style={styles.flightSection}>
                <View style={styles.flightSectionHeader}>
                  <Ionicons name="airplane-outline" size={20} color="#0066cc" />
                  <Text style={styles.flightSectionTitle}>Selected Flight(s)</Text>
                  <Ionicons name="chevron-up" size={20} color="#0066cc" />
                </View>

                {/* Departure Flight */}
                <View style={styles.flightDetailBlock}>
                  <Text style={styles.flightType}>
                    Departure flight/ {selectedSeatClass?.className || "Economy Classic"}
                  </Text>

                  {mainFlight && (
                    <>
                      <View style={styles.flightTimelineRow}>
                        <View style={styles.timelineIconContainer}>
                          <Ionicons name="radio-button-on-outline" size={14} color="#999" />
                          <View style={styles.timelineConnector} />
                        </View>
                        <View style={styles.flightTimelineContent}>
                          <Text style={styles.flightDateTime}>
                            {new Date(departDate).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                            {new Date(departDate).toLocaleDateString("en-GB")}{" "}
                            {new Date(mainFlight.departureTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          <Text style={styles.flightLocation}>{fromAirport?.code || "N/A"}</Text>
                          <Text style={styles.flightCity}>
                            {fromAirport?.city || "Unknown"}, {fromAirport?.country || "Unknown"}
                          </Text>
                          <Text style={styles.flightDuration}>
                            {Math.floor(
                              (new Date(mainFlight.arrivalTime).getTime() -
                                new Date(mainFlight.departureTime).getTime()) /
                              (1000 * 60 * 60)
                            )}{" "}
                            hours{" "}
                            {Math.floor(
                              ((new Date(mainFlight.arrivalTime).getTime() -
                                new Date(mainFlight.departureTime).getTime()) %
                                (1000 * 60 * 60)) /
                              (1000 * 60)
                            )}{" "}
                            minutes
                          </Text>
                          <Text style={styles.flightNumber}>
                            {mainFlight.flightNumber}/ {mainFlight.airline?.name || "N/A"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.flightTimelineRow}>
                        <View style={styles.timelineIconContainer}>
                          <Ionicons name="radio-button-on-outline" size={14} color="#999" />
                        </View>
                        <View style={styles.flightTimelineContent}>
                          <Text style={styles.flightDateTime}>
                            {new Date(mainFlight.arrivalTime).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                            {new Date(mainFlight.arrivalTime).toLocaleDateString("en-GB")}{" "}
                            {new Date(mainFlight.arrivalTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          <Text style={styles.flightLocation}>{toAirport?.code || "N/A"}</Text>
                          <Text style={styles.flightCity}>
                            {toAirport?.city || "Unknown"}, {toAirport?.country || "Unknown"}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                {/* Return Flight */}
                {isRoundTrip && returnFlight && (
                  <View style={styles.flightDetailBlock}>
                    <Text style={styles.flightType}>
                      Return flight/ {selectedReturnSeatClass?.className || "Economy Classic"}
                    </Text>

                    <View style={styles.flightTimelineRow}>
                      <View style={styles.timelineIconContainer}>
                        <Ionicons name="radio-button-on-outline" size={14} color="#999" />
                        <View style={styles.timelineConnector} />
                      </View>
                      <View style={styles.flightTimelineContent}>
                        <Text style={styles.flightDateTime}>
                          {returnDate && new Date(returnDate).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                          {returnDate && new Date(returnDate).toLocaleDateString("en-GB")}{" "}
                          {returnFlight &&
                            new Date(returnFlight.departureTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </Text>
                        <Text style={styles.flightLocation}>{toAirport?.code || "N/A"}</Text>
                        <Text style={styles.flightCity}>
                          {toAirport?.city || "Unknown"}, {toAirport?.country || "Unknown"}
                        </Text>
                        <Text style={styles.flightDuration}>
                          {Math.floor(
                            (new Date(returnFlight.arrivalTime).getTime() -
                              new Date(returnFlight.departureTime).getTime()) /
                            (1000 * 60 * 60)
                          )}{" "}
                          hours{" "}
                          {Math.floor(
                            ((new Date(returnFlight.arrivalTime).getTime() -
                              new Date(returnFlight.departureTime).getTime()) %
                              (1000 * 60 * 60)) /
                            (1000 * 60)
                          )}{" "}
                          minutes
                        </Text>
                        <Text style={styles.flightNumber}>
                          {returnFlight.flightNumber}/ {returnFlight.airline?.name || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.flightTimelineRow}>
                      <View style={styles.timelineIconContainer}>
                        <Ionicons name="radio-button-on-outline" size={14} color="#999" />
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
                        <Text style={styles.flightLocation}>{fromAirport?.code || "N/A"}</Text>
                        <Text style={styles.flightCity}>
                          {fromAirport?.city || "Unknown"}, {fromAirport?.country || "Unknown"}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Price Breakdown Section */}
              <View style={styles.priceSection}>
                <View style={styles.priceSectionHeader}>
                  <Ionicons name="cash-outline" size={20} color="#0066cc" />
                  <Text style={styles.priceSectionTitle}>Review trip cost</Text>
                  <Ionicons name="chevron-up" size={20} color="#0066cc" />
                </View>

                <View style={styles.priceBreakdown}>
                  {/* Fare */}
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownLabel}>Fare</Text>
                    <Text style={styles.priceBreakdownValue}>{formatPrice(totalPrice * 0.757)}</Text>
                  </View>

                  {/* Adult */}
                  <View style={[styles.priceBreakdownRow, styles.subRow]}>
                    <Text style={styles.priceBreakdownSubLabel}>Adult</Text>
                    <Text style={styles.priceBreakdownSubValue}>
                      {String(passengers).padStart(2, "0")} {formatPrice(totalPrice * 0.757)}
                    </Text>
                  </View>

                  {/* Divider between Fare and Tax */}
                  <View style={styles.priceBreakdownDivider} />

                  {/* Tax, fees and carrier charges */}
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownLabel}>Tax, fees and carrier charges</Text>
                    <Text style={styles.priceBreakdownValue}>{formatPrice(totalPrice * 0.243)}</Text>
                  </View>

                  {/* Surcharges */}
                  <Text style={styles.surchargeSectionTitle}>Surcharges</Text>
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownSubLabel}>System and Admin Surcharge</Text>
                    <Text style={styles.priceBreakdownSubValue}>{formatPrice(totalPrice * 0.144)}</Text>
                  </View>

                  {/* Taxes, fees and charges */}
                  <Text style={styles.surchargeSectionTitle}>Taxes, fees and charges</Text>
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownSubLabel}>Passenger Service Charge – Domestic</Text>
                    <Text style={styles.priceBreakdownSubValue}>{formatPrice(totalPrice * 0.032)}</Text>
                  </View>
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownSubLabel}>
                      Passenger and Baggage Security Screening Service Charge
                    </Text>
                    <Text style={styles.priceBreakdownSubValue}>{formatPrice(totalPrice * 0.006)}</Text>
                  </View>
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownSubLabel}>Value Added Tax, Vietnam</Text>
                    <Text style={styles.priceBreakdownSubValue}>{formatPrice(totalPrice * 0.061)}</Text>
                  </View>

                  {/* Total */}
                  <View style={styles.priceBreakdownDivider} />
                  <View style={styles.priceBreakdownRow}>
                    <Text style={styles.priceBreakdownTotalLabel}>Total:</Text>
                    <Text style={styles.priceBreakdownTotalValue}>{formatPrice(totalPrice)}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  firstSection: {
    marginTop: 0,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 8,
  },
  priceNote: {
    fontSize: 12,
    color: "#999",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
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
  dateInputContainer: {
    position: "relative",
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 14,
  },
  calendarIcon: {
    position: "absolute",
    right: 12,
    top: 10,
  },
  calendarIconButton: {
    position: "absolute",
    right: 8,
    top: 6,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  calendar: {
    borderRadius: 0,
  },
  priceModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  priceModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    width: "100%",
  },
  priceModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  priceModalScroll: {
    flex: 1,
  },
  routeSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f8f9fb",
  },
  routePoint: {
    flex: 1,
    alignItems: "center",
  },
  routeCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  routeCity: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  routeArrowContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 4,
  },
  routeIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  airplaneIcon: {
    marginHorizontal: 4,
  },
  airplaneReturn: {
    transform: [{ rotate: "180deg" }],
  },
  dottedLine: {
    width: 30,
    height: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#0066cc",
  },
  flightSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  flightSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  flightSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  flightDetailBlock: {
    marginTop: 12,
  },
  flightType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 12,
  },
  flightTimelineRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  timelineIconContainer: {
    alignItems: "center",
    width: 14,
  },
  timelineConnector: {
    width: 1,
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    borderStyle: "dashed",
    marginTop: 2,
  },
  flightTimelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  flightDateTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  flightLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  flightCity: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
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
  priceSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  priceSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  priceBreakdown: {
    backgroundColor: "#fff",
  },
  priceBreakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  subRow: {
    paddingLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  priceBreakdownLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  priceBreakdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
  },
  priceBreakdownSubLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  priceBreakdownSubValue: {
    fontSize: 14,
    color: "#333",
  },
  surchargeSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginTop: 12,
    marginBottom: 8,
  },
  priceBreakdownDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  priceBreakdownTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  priceBreakdownTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  priceModalContent: {
    padding: 20,
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
