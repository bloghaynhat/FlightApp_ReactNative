import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#888" />
      <TextInput style={styles.input} placeholder="Find a flight" placeholderTextColor="#aaa" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    padding: 10,
  },
});

export default SearchBar;
