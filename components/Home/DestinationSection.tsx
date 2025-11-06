import React from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import DestinationCard, { CityWithPrice } from "./DestinationCard";

interface DestinationSectionProps {
  cities: CityWithPrice[];
  loading: boolean;
  onCityPress: (city: CityWithPrice) => void;
  formatPrice: (price: number) => string;
}

const DestinationSection: React.FC<DestinationSectionProps> = ({ cities, loading, onCityPress, formatPrice }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.greatFareLabel}>GREAT DESTINATION TO VISIT </Text>
        </Text>
        {/* <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity> */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={{ marginVertical: 20 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationScroll}>
          {cities.map((city) => (
            <DestinationCard key={city.id} city={city} onPress={onCityPress} formatPrice={formatPrice} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    flex: 1,
  },
  greatFareLabel: {
    color: "#ff9900",
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "600",
  },
  destinationScroll: {
    marginTop: 8,
  },
});

export default DestinationSection;
