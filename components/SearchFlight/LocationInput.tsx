import React from "react";
import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import type { City } from "../../types/City";
import { CitySearchDropdown } from "./CitySearchDropdown";

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: City | null;
  onSelect: (city: City) => void;
  iconName?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onSelect,
  iconName = "📍",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setShowDropdown(true)}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{iconName}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value ? `${value.name} (${value.code})` : placeholder}</Text>
        </View>
      </TouchableOpacity>

      <CitySearchDropdown visible={showDropdown} onSelect={onSelect} onClose={() => setShowDropdown(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
