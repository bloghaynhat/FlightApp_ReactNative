import React from "react";
import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import type { Airport } from "../../types";
import { CitySearchDropdown } from "./CitySearchDropdown";

export interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onSelect: (airport: Airport) => void;
  iconName: string;
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
          <View style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 12 }}>
            <Text style={styles.value1}>{value ? `${value.code}` : placeholder}</Text>
            <Text style={styles.value2}>{value ? `${value.city}, ${value.country}` : ""}</Text>
          </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
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
    color: "#fff",
    fontWeight: "400",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value1: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
  },
  value2: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
