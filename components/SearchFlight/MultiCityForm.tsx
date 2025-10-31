import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";

const MultiCityForm = () => {
  const [segments, setSegments] = useState([{ from: "", to: "" }]);

  const addSegment = () => {
    setSegments([...segments, { from: "", to: "" }]);
  };

  return (
    <View style={styles.form}>
      {segments.map((_, i) => (
        <View key={i} style={styles.segment}>
          <TextInput style={styles.input} placeholder="From" />
          <TextInput style={styles.input} placeholder="To" />
        </View>
      ))}

      <TouchableOpacity onPress={addSegment}>
        <Text style={styles.add}>+ Add another flight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Search flights</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiCityForm;

const styles = StyleSheet.create({
  form: { gap: 12 },
  segment: { gap: 8 },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 10,
  },
  add: { color: "#00AEEF", textAlign: "center", marginTop: 4 },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
