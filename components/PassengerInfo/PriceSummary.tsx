import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface PriceSummaryProps {
  totalPrice: number;
  onShowDetail: () => void;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ totalPrice, onShowDetail }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <View style={[styles.section, styles.firstSection]}>
      <View style={styles.totalContainer}>
        <View>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
          <Text style={styles.priceNote}>Price does not include add-on services</Text>
        </View>
        <TouchableOpacity style={styles.detailButton} onPress={onShowDetail}>
          <Text style={styles.detailText}>Details</Text>
          <Ionicons name="chevron-down-circle-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PriceSummary;
