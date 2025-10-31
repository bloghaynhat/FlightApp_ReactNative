import React from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";

const OneWayForm = () => {
  return (
    <View style={styles.form}>
      <TextInput style={styles.input} placeholder="From" />
      <TextInput style={styles.input} placeholder="To" />
      <TextInput style={styles.input} placeholder="Departure" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Search flights</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OneWayForm;

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
