import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { PassengerData } from "../../types/types";

interface PassengerFormProps {
  passenger: PassengerData;
  index: number;
  onUpdate: (field: keyof PassengerData, value: string) => void;
  onOpenCalendar: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ passenger, index, onUpdate, onOpenCalendar }) => {
  const formatBirthDate = (text: string) => {
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

    onUpdate("birthDate", formatted);
  };

  return (
    <View style={styles.passengerCard}>
      <Text style={styles.passengerLabel}>Passenger {index + 1}</Text>

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={passenger.lastName}
        onChangeText={(text) => onUpdate("lastName", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={passenger.firstName}
        onChangeText={(text) => onUpdate("firstName", text)}
      />

      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Date of Birth (DD/MM/YYYY)"
          value={passenger.birthDate}
          onChangeText={formatBirthDate}
          keyboardType="numeric"
          maxLength={10}
        />
        <TouchableOpacity style={styles.calendarIconButton} onPress={onOpenCalendar}>
          <Ionicons name="calendar-outline" size={20} color="#0066cc" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  calendarIconButton: {
    position: "absolute",
    right: 8,
    top: 6,
    padding: 4,
  },
});

export default PassengerForm;
