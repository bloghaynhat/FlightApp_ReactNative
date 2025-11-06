import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text style={styles.text}>Đang tìm kiếm chuyến bay...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
});
