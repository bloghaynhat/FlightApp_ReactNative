import React from "react";
import { TouchableOpacity, View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SearchBar = () => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    // Navigate to root stack's SearchFlight screen
    navigation.getParent()?.navigate("SearchFlight");
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.container}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput style={styles.input} placeholder="Find a flight" placeholderTextColor="#999" editable={false} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    color: "#333",
    flex: 1,
  },
});

export default SearchBar;
