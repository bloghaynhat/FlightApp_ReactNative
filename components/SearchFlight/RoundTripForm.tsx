import React from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";

const RoundTripForm = () => {
  return (
    <View style={styles.form}>
      <TextInput style={styles.input} placeholder="From" />
      <TextInput style={styles.input} placeholder="To" />
      <View style={styles.dateRow}>
        <TextInput style={[styles.input, styles.half]} placeholder="Departure" />
        <TextInput style={[styles.input, styles.half]} placeholder="Return" />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Search flights</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoundTripForm;

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 10,
  },
  dateRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  half: { flex: 1 },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
