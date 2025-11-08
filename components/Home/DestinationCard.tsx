import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Airport } from "../../types";

export interface CityWithPrice extends Airport {
  minPrice?: number;
}

interface DestinationCardProps {
  city: CityWithPrice;
  onPress: (city: CityWithPrice) => void;
  formatPrice: (price: number) => string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, onPress, formatPrice }) => {
  return (
    <TouchableOpacity onPress={() => onPress(city)}>
      <View style={styles.destinationCard}>
        <Image source={{ uri: city.image }} style={styles.destinationImage} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.destinationGradient}>
          <Text style={styles.destinationCity}>{city.city}, Vietnam</Text>
          <Text style={styles.destinationPrice}>from {formatPrice(city.minPrice || 1227000)}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  destinationCard: {
    width: 240,
    height: 320,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  destinationCity: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  destinationPrice: {
    color: "#fff",
    fontSize: 14,
  },
});

export default DestinationCard;
