import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { Airport } from "../../types";

interface SearchHeaderProps {
  fromAirport: Airport;
  toAirport: Airport;
  departDate: Date;
  returnDate?: Date | null;
  passengers: number;
  onModify?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  fromAirport,
  toAirport,
  departDate,
  returnDate,
  passengers,
  onModify,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.routeContainer}>
        <View style={styles.cityBlock}>
          <Text style={styles.cityCode}>{fromAirport.code}</Text>
          <Text style={styles.cityName} numberOfLines={1}>
            {fromAirport.city}
          </Text>
        </View>

        <Ionicons name="arrow-forward" size={20} color="#666" style={styles.arrow} />

        <View style={styles.cityBlock}>
          <Text style={styles.cityCode}>{toAirport.code}</Text>
          <Text style={styles.cityName} numberOfLines={1}>
            {toAirport.city}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            {formatDate(departDate)}
            {returnDate && ` - ${formatDate(returnDate)}`}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            {passengers} {passengers === 1 ? "passenger" : "passengers"}
          </Text>
        </View>
      </View>

      {onModify && (
        <TouchableOpacity style={styles.modifyButton} onPress={onModify}>
          <Text style={styles.modifyText}>Modify</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cityBlock: {
    flex: 1,
  },
  cityCode: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  cityName: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  arrow: {
    marginHorizontal: 12,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
  },
  modifyButton: {
    position: "absolute",
    top: 12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0066cc",
  },
  modifyText: {
    fontSize: 12,
    color: "#0066cc",
    fontWeight: "600",
  },
});
