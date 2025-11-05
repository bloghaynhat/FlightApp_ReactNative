import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "Không tìm thấy chuyến bay phù hợp" }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="airplane-outline" size={64} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.suggestion}>Vui lòng thử tìm kiếm với thông tin khác</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  suggestion: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
