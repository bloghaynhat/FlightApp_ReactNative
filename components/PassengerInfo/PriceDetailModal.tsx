import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { Airport, SeatClass } from "../../types/index";
import type { FlightResult } from "../../apis/flightService";

interface PriceDetailModalProps {
  visible: boolean;
  onClose: () => void;
  mainFlight: FlightResult;
  returnFlight?: FlightResult;
  fromAirport: Airport;
  toAirport: Airport;
  departDate: string;
  returnDate?: string;
  passengers: number;
  selectedSeatClass: SeatClass;
  selectedReturnSeatClass?: SeatClass;
  baseFare: number;
  systemAdminSurcharge: number;
  passengerServiceCharge: number;
  securityScreeningCharge: number;
  vat: number;
  totalPrice: number;
  isRoundTrip: boolean;
}

const PriceDetailModal: React.FC<PriceDetailModalProps> = ({
  visible,
  onClose,
  mainFlight,
  returnFlight,
  fromAirport,
  toAirport,
  departDate,
  returnDate,
  passengers,
  selectedSeatClass,
  selectedReturnSeatClass,
  baseFare,
  systemAdminSurcharge,
  passengerServiceCharge,
  securityScreeningCharge,
  vat,
  totalPrice,
  isRoundTrip,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính tổng các phí
  const taxFeesTotal = systemAdminSurcharge + passengerServiceCharge + securityScreeningCharge + vat;

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.priceModalOverlay}>
        <View style={styles.priceModalContainer}>
          <View style={styles.priceModalHeader}>
            <Text style={styles.priceModalTitle}>Flight details</Text>
            <TouchableOpacity onPress={onClose}>
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
              </View>

              {/* Departure Flight */}
              <View style={styles.flightDetailBlock}>
                <Text style={styles.flightType}>Departure flight/ {selectedSeatClass.className}</Text>

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
                  <Text style={styles.flightType}>Return flight/ {selectedReturnSeatClass?.className}</Text>

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
              </View>

              <View style={styles.priceBreakdown}>
                {/* Fare */}
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownLabel}>Fare</Text>
                  <Text style={styles.priceBreakdownValue}>{formatPrice(baseFare)}</Text>
                </View>

                {/* Adult */}
                <View style={[styles.priceBreakdownRow, styles.subRow]}>
                  <Text style={styles.priceBreakdownSubLabel}>Adult</Text>
                  <View style={styles.adultPriceContainer}>
                    <Text style={styles.passengerCount}>{String(passengers).padStart(2, "0")}</Text>
                    <Text style={styles.priceBreakdownSubValue}>{formatPrice(baseFare)}</Text>
                  </View>
                </View>

                {/* Divider between Fare and Tax */}
                <View style={styles.priceBreakdownDivider} />

                {/* Tax, fees and carrier charges */}
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownLabel}>Tax, fees and carrier charges</Text>
                  <Text style={styles.priceBreakdownValue}>{formatPrice(taxFeesTotal)}</Text>
                </View>

                {/* Surcharges */}
                <Text style={styles.surchargeSectionTitle}>Surcharges</Text>
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownSubLabel}>System and Admin Surcharge</Text>
                  <Text style={styles.priceBreakdownSubValue}>{formatPrice(systemAdminSurcharge)}</Text>
                </View>

                {/* Taxes, fees and charges */}
                <Text style={styles.surchargeSectionTitle}>Taxes, fees and charges</Text>
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownSubLabel}>Passenger Service Charge – Domestic</Text>
                  <Text style={styles.priceBreakdownSubValue}>{formatPrice(passengerServiceCharge)}</Text>
                </View>
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownSubLabel}>
                    Passenger and Baggage Security Screening Service Charge
                  </Text>
                  <Text style={styles.priceBreakdownSubValue}>{formatPrice(securityScreeningCharge)}</Text>
                </View>
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.priceBreakdownSubLabel}>Value Added Tax, Vietnam</Text>
                  <Text style={styles.priceBreakdownSubValue}>{formatPrice(vat)}</Text>
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
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 12,
  },
  subRow: {
    paddingLeft: 0,
    marginTop: 0,
    marginBottom: 8,
  },
  adultPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passengerCount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginRight: 20,
  },
  priceBreakdownLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 12,
  },
  priceBreakdownValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "right",
  },
  priceBreakdownSubLabel: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 12,
  },
  priceBreakdownSubValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
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
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  priceBreakdownTotalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f59e0b",
  },
});

export default PriceDetailModal;
